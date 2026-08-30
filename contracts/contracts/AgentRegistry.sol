// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentRegistry
 * @notice ERC-7857 inspired AI Agent Identity Registry
 * @dev Inspired by 0G's iNFT standard. Gives AI agents verifiable on-chain identities.
 *      Each agent is an NFT with: performance history, risk profile, reputation score.
 */
contract AgentRegistry is ERC721, Ownable {
    // ═══════════════════════════════════════════════════════════════
    //                         STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════

    uint256 private _nextTokenId;

    /// @notice Agent metadata (the "intelligence" of each agent)
    mapping(uint256 => AgentMetadata) public agents;

    /// @notice Agent performance stats
    mapping(uint256 => AgentPerformance) public performance;

    /// @notice Designated operator for each agent (the AI backend wallet)
    mapping(uint256 => address) public agentOperators;

    /// @notice Vault that an agent is currently assigned to
    mapping(uint256 => address) public agentVaults;

    // ═══════════════════════════════════════════════════════════════
    //                            STRUCTS
    // ═══════════════════════════════════════════════════════════════

    struct AgentMetadata {
        string name;
        string description;
        string strategy;            // e.g. "Conservative Yield", "Aggressive Growth"
        string modelCid;            // 0G Storage CID of the AI model weights
        uint8 riskProfile;          // 1=Conservative, 2=Moderate, 3=Aggressive
        uint256 createdAt;
        bool active;
    }

    struct AgentPerformance {
        uint256 totalDecisions;
        uint256 successfulDecisions;
        int256 cumulativePnLBps;    // Cumulative PnL in basis points
        uint256 bestAPY;            // Best monthly APY achieved
        uint256 worstDrawdown;      // Worst drawdown in bps
        uint256 reputationScore;    // 0-1000 reputation score
        uint256 lastUpdated;
    }

    // ═══════════════════════════════════════════════════════════════
    //                             EVENTS
    // ═══════════════════════════════════════════════════════════════

    event AgentMinted(uint256 indexed agentId, address indexed owner, string name);
    event AgentOperatorSet(uint256 indexed agentId, address indexed operator);
    event AgentPerformanceUpdated(uint256 indexed agentId, int256 pnlBps, uint256 reputation);
    event AgentModelUpdated(uint256 indexed agentId, string newModelCid);
    event AgentAssignedToVault(uint256 indexed agentId, address indexed vault);

    // ═══════════════════════════════════════════════════════════════
    //                        CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════

    constructor() ERC721("NexusVault Agent", "NVA") Ownable(msg.sender) {}

    // ═══════════════════════════════════════════════════════════════
    //                      CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    /**
     * @notice Mint a new AI agent identity (ERC-7857 inspired iNFT)
     * @param to Owner of the agent NFT
     * @param name Human-readable agent name
     * @param description Agent description
     * @param strategy Strategy type
     * @param modelCid 0G Storage CID of the AI model
     * @param riskProfile 1=Conservative, 2=Moderate, 3=Aggressive
     * @param operator The wallet address that the AI backend will use to sign transactions
     */
    function mintAgent(
        address to,
        string calldata name,
        string calldata description,
        string calldata strategy,
        string calldata modelCid,
        uint8 riskProfile,
        address operator
    ) external onlyOwner returns (uint256 agentId) {
        require(riskProfile >= 1 && riskProfile <= 3, "AgentRegistry: invalid risk profile");
        require(operator != address(0), "AgentRegistry: zero operator");

        agentId = _nextTokenId++;
        _safeMint(to, agentId);

        agents[agentId] = AgentMetadata({
            name: name,
            description: description,
            strategy: strategy,
            modelCid: modelCid,
            riskProfile: riskProfile,
            createdAt: block.timestamp,
            active: true
        });

        performance[agentId] = AgentPerformance({
            totalDecisions: 0,
            successfulDecisions: 0,
            cumulativePnLBps: 0,
            bestAPY: 0,
            worstDrawdown: 0,
            reputationScore: 500, // Start at mid-range reputation
            lastUpdated: block.timestamp
        });

        agentOperators[agentId] = operator;

        emit AgentMinted(agentId, to, name);
        emit AgentOperatorSet(agentId, operator);
    }

    /**
     * @notice Update agent's performance metrics (called by vault after strategy execution)
     */
    function updatePerformance(
        uint256 agentId,
        bool wasSuccessful,
        int256 pnlBps,
        uint256 achievedAPY
    ) external {
        require(agentVaults[agentId] == msg.sender, "AgentRegistry: caller is not agent's vault");
        require(_ownerOf(agentId) != address(0), "AgentRegistry: agent does not exist");

        AgentPerformance storage perf = performance[agentId];
        perf.totalDecisions++;

        if (wasSuccessful) {
            perf.successfulDecisions++;
        }

        perf.cumulativePnLBps += pnlBps;

        if (achievedAPY > perf.bestAPY) {
            perf.bestAPY = achievedAPY;
        }

        // Update reputation: success increases, failure decreases
        if (wasSuccessful) {
            perf.reputationScore = perf.reputationScore >= 990
                ? 1000
                : perf.reputationScore + 10;
        } else {
            perf.reputationScore = perf.reputationScore <= 10
                ? 0
                : perf.reputationScore - 10;
        }

        perf.lastUpdated = block.timestamp;

        emit AgentPerformanceUpdated(agentId, pnlBps, perf.reputationScore);
    }

    /**
     * @notice Update the AI model stored on 0G Storage (when model is retrained)
     */
    function updateModel(uint256 agentId, string calldata newModelCid) external {
        require(
            _ownerOf(agentId) == msg.sender || agentOperators[agentId] == msg.sender,
            "AgentRegistry: not authorized"
        );
        agents[agentId].modelCid = newModelCid;
        emit AgentModelUpdated(agentId, newModelCid);
    }

    /**
     * @notice Assign an agent to a specific vault
     */
    function assignToVault(uint256 agentId, address vault) external onlyOwner {
        agentVaults[agentId] = vault;
        emit AgentAssignedToVault(agentId, vault);
    }

    /**
     * @notice Set the operator wallet for an agent
     */
    function setOperator(uint256 agentId, address newOperator) external {
        require(_ownerOf(agentId) == msg.sender, "AgentRegistry: not owner");
        agentOperators[agentId] = newOperator;
        emit AgentOperatorSet(agentId, newOperator);
    }

    // ═══════════════════════════════════════════════════════════════
    //                       VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function agentExists(uint256 agentId) external view returns (bool) {
        return _ownerOf(agentId) != address(0);
    }

    function getAgentOperator(uint256 agentId) external view returns (address) {
        return agentOperators[agentId];
    }

    function getAgent(uint256 agentId)
        external
        view
        returns (AgentMetadata memory, AgentPerformance memory)
    {
        return (agents[agentId], performance[agentId]);
    }

    function getSuccessRate(uint256 agentId) external view returns (uint256) {
        AgentPerformance storage perf = performance[agentId];
        if (perf.totalDecisions == 0) return 0;
        return (perf.successfulDecisions * 10000) / perf.totalDecisions;
    }

    function totalAgents() external view returns (uint256) {
        return _nextTokenId;
    }
}
