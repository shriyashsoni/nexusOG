const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║        NexusVault Deployment Script          ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\n➜  Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`➜  Balance:  ${ethers.formatEther(balance)} OG\n`);

  // 1. Deploy Guardian
  console.log("📋  [1/5] Deploying Guardian...");
  const Guardian = await ethers.getContractFactory("Guardian");
  const guardian = await Guardian.deploy();
  await guardian.waitForDeployment();
  const guardianAddr = await guardian.getAddress();
  console.log(`     ✅  Guardian: ${guardianAddr}`);

  // 2. Deploy AgentRegistry
  console.log("\n🤖  [2/5] Deploying AgentRegistry...");
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  const agentRegistryAddr = await agentRegistry.getAddress();
  console.log(`     ✅  AgentRegistry: ${agentRegistryAddr}`);

  // 3. Deploy Wrapped OG (WOG)
  console.log("\n🪙  [3/5] Deploying Wrapped OG (WOG)...");
  const WOG = await ethers.getContractFactory("WOG");
  const wog = await WOG.deploy();
  await wog.waitForDeployment();
  const wogAddr = await wog.getAddress();
  console.log(`     ✅  WOG: ${wogAddr}`);

  // 4. Mint Genesis Agent
  console.log("\n🧠  [4/5] Minting Genesis Agent...");
  await agentRegistry.mintAgent(
    deployer.address, "Nexus Alpha", "Genesis conservative yield agent",
    "Conservative Yield", "bafybeigenesis0000000000000000000000000000000000",
    1, deployer.address
  );
  console.log(`     ✅  Genesis Agent #0 minted`);

  // 5. Deploy NexusVault
  console.log("\n🏦  [5/5] Deploying NexusVault...");
  const NexusVault = await ethers.getContractFactory("NexusVault");
  const vault = await NexusVault.deploy(
    wogAddr, "NexusVault OG", "nvOG",
    guardianAddr, agentRegistryAddr, 0, deployer.address
  );
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log(`     ✅  NexusVault: ${vaultAddr}`);

  // Configure
  await guardian.setVault(vaultAddr);
  await agentRegistry.assignToVault(0, vaultAddr);

  const protocols = [
    ["0x0000000000000000000000000000000000000001", "Aave V3"],
    ["0x0000000000000000000000000000000000000002", "Uniswap V4"],
    ["0x0000000000000000000000000000000000000003", "Curve Finance"],
    ["0x0000000000000000000000000000000000000004", "GMX"],
  ];
  for (const [addr, name] of protocols) {
    await guardian.whitelistProtocol(addr, name);
    console.log(`     ✅  Whitelisted: ${name}`);
  }

  const network = await ethers.provider.getNetwork();
  const deployData = {
    network: network.name,
    chainId: network.chainId.toString(),
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      Guardian: guardianAddr,
      AgentRegistry: agentRegistryAddr,
      WOG: wogAddr,
      NexusVault: vaultAddr,
    },
  };

  const filename = `deployments-${network.name}.json`;
  fs.writeFileSync(filename, JSON.stringify(deployData, null, 2));

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║            ✅ DEPLOYMENT COMPLETE             ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║  Guardian:      ${guardianAddr}`);
  console.log(`║  AgentRegistry: ${agentRegistryAddr}`);
  console.log(`║  NexusVault:    ${vaultAddr}`);
  console.log(`║  WOG (Wrapped): ${wogAddr}`);
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\n📄  Saved to ${filename}\n`);
}

main().catch((e) => { console.error("❌ Deployment failed:", e); process.exitCode = 1; });
