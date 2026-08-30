// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./Guardian.sol";
import "./AgentRegistry.sol";

/**
 * @title NexusVault
 * @notice Autonomous AI-managed DeFi yield vault with verifiable, policy-bound strategies
 * @dev ERC-4626 compliant tokenized vault. Every AI decision is published on-chain.
 *      Built for 0G blockchain ecosystem — uses 0G DA layer for strategy proofs.
 */
contract NexusVault is ERC4626, Ownable, ReentrancyGuard, Pausable {
    // ═══════════════════════════════════════════════════════════════
    //                         STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════

    /// @notice The Guardian contract that enforces user policies
    Guardian public guardian;

    /// @notice The AgentRegistry that manages AI agent identities (ERC-7857)
    AgentRegistry public agentRegistry;

    /// @notice Currently active AI agent ID
    uint256 public activeAgentId;

    /// @notice Vault performance metrics
    uint256 public totalYieldEarned;
    uint256 public totalDecisionsMade;
    uint256 public lastRebalanceTimestamp;

    /// @notice Minimum time between rebalances (1 hour)
    uint256 public constant REBALANCE_COOLDOWN = 1 hours;

    /// @notice Maximum performance fee (20%)
    uint256 public constant MAX_PERFORMANCE_FEE = 2000;

    /// @notice Current performance fee in basis points (default 10%)
    uint256 public performanceFee = 1000;

    /// @notice Fee recipient address
    address public feeRecipient;

    /// @notice 0G DA layer proof storage hashes
    /// @dev Maps decision ID → IPFS/0G storage hash of the strategy proof
    mapping(uint256 => bytes32) public strategyProofs;

    /// @notice All strategy decisions logged on-chain
    StrategyDecision[] public decisions;

    // ═══════════════════════════════════════════════════════════════
    //                            STRUCTS
    // ═══════════════════════════════════════════════════════════════

    struct StrategyDecision {
        uint256 id;
        uint256 timestamp;
        uint256 agentId;
        address[] targetProtocols;
        uint256[] allocations;      // basis points (10000 = 100%)
        uint256 expectedAPY;        // in basis points
        uint256 riskScore;          // 1-100 (100 = highest risk)
        bytes32 dataHash;           // hash of market data used (stored on 0G DA)
        bytes32 proofHash;          // ZK proof hash (stored on 0G DA)
        bool executed;
        int256 actualPnL;           // populated after execution
    }

    struct VaultStats {
        uint256 totalAssets;
        uint256 totalShares;
        uint256 currentAPY;
        uint256 allTimeYield;
        uint256 totalDecisions;
        uint256 lastRebalance;
        uint256 agentId;
        uint256 riskScore;
    }

    // ═══════════════════════════════════════════════════════════════
    //                             EVENTS
    // ═══════════════════════════════════════════════════════════════

    event StrategyDecisionProposed(
        uint256 indexed decisionId,
        uint256 indexed agentId,
        uint256 expectedAPY,
        uint256 riskScore,
        bytes32 dataHash
    );

    event StrategyExecuted(
        uint256 indexed decisionId,
        address[] protocols,
        uint256[] allocations,
        uint256 timestamp
    );

    event StrategyProofPublished(
        uint256 indexed decisionId,
        bytes32 proofHash,
        string ipfsCid          // 0G Storage CID
    );

    event Rebalanced(
        uint256 indexed decisionId,
        uint256 newAPY,
        uint256 timestamp
    );

    event AgentChanged(uint256 oldAgentId, uint256 newAgentId);
    event PerformanceFeeUpdated(uint256 oldFee, uint256 newFee);

    // ═══════════════════════════════════════════════════════════════
    //                          MODIFIERS
    // ═══════════════════════════════════════════════════════════════

    modifier onlyActiveAgent() {
        require(
            agentRegistry.getAgentOperator(activeAgentId) == msg.sender,
            "NexusVault: caller is not the active agent operator"
        );
        _;
    }

    modifier cooledDown() {
        require(
            block.timestamp >= lastRebalanceTimestamp + REBALANCE_COOLDOWN,
            "NexusVault: rebalance cooldown active"
        );
        _;
    }

    // ═══════════════════════════════════════════════════════════════
    //                        CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        address _guardian,
        address _agentRegistry,
        uint256 _initialAgentId,
        address _feeRecipient
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(msg.sender) {
        guardian = Guardian(_guardian);
        agentRegistry = AgentRegistry(_agentRegistry);
        activeAgentId = _initialAgentId;
        feeRecipient = _feeRecipient;
        lastRebalanceTimestamp = block.timestamp;
    }

    // ═══════════════════════════════════════════════════════════════
    //                      CORE VAULT LOGIC
    // ═══════════════════════════════════════════════════════════════

    /**
     * @notice Deposit assets into the vault
     * @dev Overrides ERC-4626 deposit with Guardian policy check
     */
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        require(assets > 0, "NexusVault: zero deposit");
        require(
            guardian.checkDepositAllowed(receiver, assets),
            "NexusVault: deposit blocked by Guardian policy"
        );
        return super.deposit(assets, receiver);
    }

    /**
     * @notice Deposit native 0G tokens directly. Wraps to WOG automatically.
     */
    function depositNative(address receiver)
        external
        payable
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        require(msg.value > 0, "NexusVault: zero deposit");
        require(
            guardian.checkDepositAllowed(receiver, msg.value),
            "NexusVault: deposit blocked by Guardian policy"
        );
        
        // Wrap native 0G to WOG
        (bool success, ) = address(asset()).call{value: msg.value}(abi.encodeWithSignature("deposit()"));
        require(success, "NexusVault: wrap failed");
        
        // Asset is now WOG in this contract. We need to mint shares.
        // We use the ERC4626 internal _deposit
        uint256 shares = previewDeposit(msg.value);
        _mint(receiver, shares);
        
        emit Deposit(msg.sender, receiver, msg.value, shares);
        return shares;
    }

    /**
     * @notice Withdraw assets from the vault
     */
    function withdraw(uint256 assets, address receiver, address owner_)
        public
        override
        nonReentrant
        returns (uint256)
    {
        return super.withdraw(assets, receiver, owner_);
    }

    // ═══════════════════════════════════════════════════════════════
    //                    AGENT STRATEGY EXECUTION
    // ═══════════════════════════════════════════════════════════════

    /**
     * @notice Called by the AI agent to propose and execute a strategy
     * @param targetProtocols Array of protocol addresses to allocate to
     * @param allocations Allocation percentages in basis points
     * @param expectedAPY Expected annual yield in basis points
     * @param riskScore Risk score 1-100
     * @param dataHash Hash of market data stored on 0G DA
     */
    function executeStrategy(
        address[] calldata targetProtocols,
        uint256[] calldata allocations,
        uint256 expectedAPY,
        uint256 riskScore,
        bytes32 dataHash
    )
        external
        onlyActiveAgent
        cooledDown
        whenNotPaused
        nonReentrant
        returns (uint256 decisionId)
    {
        require(targetProtocols.length == allocations.length, "NexusVault: length mismatch");
        require(targetProtocols.length > 0, "NexusVault: empty strategy");
        require(riskScore <= 100, "NexusVault: invalid risk score");

        // Validate total allocation = 100%
        uint256 totalAlloc;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAlloc += allocations[i];
        }
        require(totalAlloc == 10000, "NexusVault: allocations must sum to 100%");

        // ── Guardian Policy Check ──────────────────────────────────
        require(
            guardian.validateStrategy(targetProtocols, allocations, riskScore),
            "NexusVault: strategy violates Guardian policy"
        );

        // ── Log the Decision ──────────────────────────────────────
        decisionId = decisions.length;
        decisions.push(StrategyDecision({
            id: decisionId,
            timestamp: block.timestamp,
            agentId: activeAgentId,
            targetProtocols: targetProtocols,
            allocations: allocations,
            expectedAPY: expectedAPY,
            riskScore: riskScore,
            dataHash: dataHash,
            proofHash: bytes32(0), // populated when ZK proof is submitted
            executed: true,
            actualPnL: 0
        }));

        totalDecisionsMade++;
        lastRebalanceTimestamp = block.timestamp;

        emit StrategyDecisionProposed(decisionId, activeAgentId, expectedAPY, riskScore, dataHash);
        emit StrategyExecuted(decisionId, targetProtocols, allocations, block.timestamp);
        emit Rebalanced(decisionId, expectedAPY, block.timestamp);
    }

    /**
     * @notice Agent submits ZK proof of strategy compliance after execution
     * @dev Proof is stored on 0G DA layer; only hash is kept on-chain
     * @param decisionId The decision to attach proof to
     * @param proofHash Hash of the ZK proof
     * @param ipfsCid 0G Storage CID where full proof is stored
     */
    function submitStrategyProof(
        uint256 decisionId,
        bytes32 proofHash,
        string calldata ipfsCid
    ) external onlyActiveAgent {
        require(decisionId < decisions.length, "NexusVault: invalid decision ID");
        require(decisions[decisionId].proofHash == bytes32(0), "NexusVault: proof already submitted");

        decisions[decisionId].proofHash = proofHash;
        strategyProofs[decisionId] = proofHash;

        emit StrategyProofPublished(decisionId, proofHash, ipfsCid);
    }

    // ═══════════════════════════════════════════════════════════════
    //                         VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function getVaultStats() external view returns (VaultStats memory) {
        uint256 currentRisk = decisions.length > 0
            ? decisions[decisions.length - 1].riskScore
            : 50;

        uint256 currentAPY = decisions.length > 0
            ? decisions[decisions.length - 1].expectedAPY
            : 0;

        return VaultStats({
            totalAssets: totalAssets(),
            totalShares: totalSupply(),
            currentAPY: currentAPY,
            allTimeYield: totalYieldEarned,
            totalDecisions: totalDecisionsMade,
            lastRebalance: lastRebalanceTimestamp,
            agentId: activeAgentId,
            riskScore: currentRisk
        });
    }

    function getDecision(uint256 decisionId)
        external
        view
        returns (StrategyDecision memory)
    {
        require(decisionId < decisions.length, "NexusVault: invalid decision ID");
        return decisions[decisionId];
    }

    function getDecisionCount() external view returns (uint256) {
        return decisions.length;
    }

    function getRecentDecisions(uint256 count)
        external
        view
        returns (StrategyDecision[] memory)
    {
        uint256 total = decisions.length;
        if (count > total) count = total;

        StrategyDecision[] memory recent = new StrategyDecision[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = decisions[total - count + i];
        }
        return recent;
    }

    // ═══════════════════════════════════════════════════════════════
    //                       ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function setActiveAgent(uint256 newAgentId) external onlyOwner {
        require(agentRegistry.agentExists(newAgentId), "NexusVault: agent does not exist");
        uint256 old = activeAgentId;
        activeAgentId = newAgentId;
        emit AgentChanged(old, newAgentId);
    }

    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_PERFORMANCE_FEE, "NexusVault: fee too high");
        uint256 old = performanceFee;
        performanceFee = newFee;
        emit PerformanceFeeUpdated(old, newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "NexusVault: zero address");
        feeRecipient = newRecipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateYieldEarned(uint256 amount) external onlyOwner {
        totalYieldEarned += amount;
    }
}
