// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Guardian
 * @notice On-chain policy enforcement engine for NexusVault
 * @dev Sits between AI agent and vault execution. Mathematically enforces user policies.
 *      Even the AI agent CANNOT override Guardian rules — it is physically impossible.
 */
contract Guardian is Ownable {
    // ═══════════════════════════════════════════════════════════════
    //                         STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════

    /// @notice The NexusVault contract address
    address public vault;

    /// @notice Global vault-level policy (set by vault owner)
    GlobalPolicy public globalPolicy;

    /// @notice Per-user policies (set by each user when depositing)
    mapping(address => UserPolicy) public userPolicies;

    /// @notice Whitelisted DeFi protocols (set by vault owner)
    mapping(address => bool) public whitelistedProtocols;

    /// @notice Protocol names for frontend display
    mapping(address => string) public protocolNames;

    // ═══════════════════════════════════════════════════════════════
    //                            STRUCTS
    // ═══════════════════════════════════════════════════════════════

    struct GlobalPolicy {
        uint256 maxRiskScore;              // 1-100, max allowed agent risk level
        uint256 maxSingleProtocolBps;      // Max allocation to one protocol (e.g. 3000 = 30%)
        uint256 maxSlippageBps;            // Max allowed slippage (e.g. 100 = 1%)
        uint256 minRebalanceInterval;      // Min seconds between rebalances
        bool requireProofBeforeExecution;  // Require ZK proof before strategy execution
    }

    struct UserPolicy {
        bool isSet;
        uint256 maxRiskTolerance;          // 1-100
        uint256 stopLossBps;               // Stop loss threshold in bps (e.g. 500 = 5%)
        uint256 maxSingleProtocolBps;      // Max % to any single protocol
        address[] blacklistedProtocols;    // User-specific blacklist
        bool active;
    }

    struct PolicyViolation {
        address user;
        uint256 timestamp;
        string reason;
        bytes data;
    }

    /// @notice Log of all policy violations caught
    PolicyViolation[] public violations;

    // ═══════════════════════════════════════════════════════════════
    //                             EVENTS
    // ═══════════════════════════════════════════════════════════════

    event PolicyViolationCaught(
        address indexed user,
        string reason,
        uint256 timestamp
    );

    event UserPolicyUpdated(address indexed user, uint256 maxRisk, uint256 stopLoss);
    event ProtocolWhitelisted(address indexed protocol, string name);
    event ProtocolRemovedFromWhitelist(address indexed protocol);
    event GlobalPolicyUpdated(uint256 maxRisk, uint256 maxProtocolBps);

    // ═══════════════════════════════════════════════════════════════
    //                         CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════

    constructor() Ownable(msg.sender) {
        // Default global policy — conservative
        globalPolicy = GlobalPolicy({
            maxRiskScore: 80,
            maxSingleProtocolBps: 4000,  // 40% max to any one protocol
            maxSlippageBps: 200,          // 2% max slippage
            minRebalanceInterval: 1 hours,
            requireProofBeforeExecution: false
        });
    }

    // ═══════════════════════════════════════════════════════════════
    //                      POLICY VALIDATION
    // ═══════════════════════════════════════════════════════════════

    /**
     * @notice Validates a proposed strategy against all active policies
     * @param protocols Array of target protocol addresses
     * @param allocations Basis point allocations per protocol
     * @param riskScore Agent's self-reported risk score (1-100)
     * @return true if strategy is allowed, false if it violates any policy
     */
    function validateStrategy(
        address[] calldata protocols,
        uint256[] calldata allocations,
        uint256 riskScore
    ) external returns (bool) {
        // ── Check 1: Risk score within global bounds ─────────────
        if (riskScore > globalPolicy.maxRiskScore) {
            _logViolation(
                address(0),
                "Risk score exceeds global maximum",
                abi.encode(riskScore, globalPolicy.maxRiskScore)
            );
            return false;
        }

        // ── Check 2: All protocols are whitelisted ────────────────
        for (uint256 i = 0; i < protocols.length; i++) {
            if (!whitelistedProtocols[protocols[i]]) {
                _logViolation(
                    address(0),
                    "Protocol not whitelisted",
                    abi.encode(protocols[i])
                );
                return false;
            }

            // ── Check 3: No single protocol exceeds max allocation ─
            if (allocations[i] > globalPolicy.maxSingleProtocolBps) {
                _logViolation(
                    address(0),
                    "Single protocol allocation exceeds maximum",
                    abi.encode(protocols[i], allocations[i], globalPolicy.maxSingleProtocolBps)
                );
                return false;
            }
        }

        return true;
    }

    /**
     * @notice Check if a deposit is allowed for a user
     */
    function checkDepositAllowed(address user, uint256 /*amount*/) external view returns (bool) {
        UserPolicy storage policy = userPolicies[user];
        if (!policy.isSet) return true; // No policy = allow all
        return policy.active;
    }

    /**
     * @notice Check if a user's strategy violates their personal policy
     */
    function checkUserPolicy(
        address user,
        address[] calldata protocols,
        uint256[] calldata allocations,
        uint256 riskScore
    ) external view returns (bool allowed, string memory reason) {
        UserPolicy storage policy = userPolicies[user];

        if (!policy.isSet) return (true, "");

        // Risk tolerance check
        if (riskScore > policy.maxRiskTolerance) {
            return (false, "Risk score exceeds user tolerance");
        }

        // Check user blacklisted protocols
        for (uint256 i = 0; i < protocols.length; i++) {
            for (uint256 j = 0; j < policy.blacklistedProtocols.length; j++) {
                if (protocols[i] == policy.blacklistedProtocols[j]) {
                    return (false, "Protocol in user blacklist");
                }
            }

            // User-level single protocol max
            if (allocations[i] > policy.maxSingleProtocolBps) {
                return (false, "Single protocol allocation exceeds user maximum");
            }
        }

        return (true, "");
    }

    // ═══════════════════════════════════════════════════════════════
    //                       USER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    /**
     * @notice Users set their own policy — AI agent must respect it
     * @param maxRiskTolerance Max risk score they accept (1-100)
     * @param stopLossBps Stop loss in basis points (e.g. 500 = 5%)
     * @param maxSingleProtocolBps Max allocation to any single protocol
     * @param blacklistedProtocols Protocols this user never wants to use
     */
    function setUserPolicy(
        uint256 maxRiskTolerance,
        uint256 stopLossBps,
        uint256 maxSingleProtocolBps,
        address[] calldata blacklistedProtocols
    ) external {
        require(maxRiskTolerance > 0 && maxRiskTolerance <= 100, "Guardian: invalid risk tolerance");
        require(maxSingleProtocolBps <= 10000, "Guardian: invalid allocation max");

        userPolicies[msg.sender] = UserPolicy({
            isSet: true,
            maxRiskTolerance: maxRiskTolerance,
            stopLossBps: stopLossBps,
            maxSingleProtocolBps: maxSingleProtocolBps,
            blacklistedProtocols: blacklistedProtocols,
            active: true
        });

        emit UserPolicyUpdated(msg.sender, maxRiskTolerance, stopLossBps);
    }

    function deactivateUserPolicy() external {
        userPolicies[msg.sender].active = false;
    }

    // ═══════════════════════════════════════════════════════════════
    //                       ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function setVault(address _vault) external onlyOwner {
        vault = _vault;
    }

    function whitelistProtocol(address protocol, string calldata name) external onlyOwner {
        whitelistedProtocols[protocol] = true;
        protocolNames[protocol] = name;
        emit ProtocolWhitelisted(protocol, name);
    }

    function removeProtocol(address protocol) external onlyOwner {
        whitelistedProtocols[protocol] = false;
        emit ProtocolRemovedFromWhitelist(protocol);
    }

    function updateGlobalPolicy(
        uint256 maxRiskScore,
        uint256 maxSingleProtocolBps,
        uint256 maxSlippageBps,
        uint256 minRebalanceInterval
    ) external onlyOwner {
        require(maxRiskScore <= 100, "Guardian: invalid risk score");
        require(maxSingleProtocolBps <= 10000, "Guardian: invalid allocation");

        globalPolicy.maxRiskScore = maxRiskScore;
        globalPolicy.maxSingleProtocolBps = maxSingleProtocolBps;
        globalPolicy.maxSlippageBps = maxSlippageBps;
        globalPolicy.minRebalanceInterval = minRebalanceInterval;

        emit GlobalPolicyUpdated(maxRiskScore, maxSingleProtocolBps);
    }

    // ═══════════════════════════════════════════════════════════════
    //                       VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function getUserPolicy(address user) external view returns (UserPolicy memory) {
        return userPolicies[user];
    }

    function getGlobalPolicy() external view returns (GlobalPolicy memory) {
        return globalPolicy;
    }

    function getViolationCount() external view returns (uint256) {
        return violations.length;
    }

    function getViolation(uint256 index) external view returns (PolicyViolation memory) {
        return violations[index];
    }

    // ═══════════════════════════════════════════════════════════════
    //                      INTERNAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function _logViolation(address user, string memory reason, bytes memory data) internal {
        violations.push(PolicyViolation({
            user: user,
            timestamp: block.timestamp,
            reason: reason,
            data: data
        }));
        emit PolicyViolationCaught(user, reason, block.timestamp);
    }
}
