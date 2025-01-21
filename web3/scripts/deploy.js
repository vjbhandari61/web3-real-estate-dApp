const {network, ethers} = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const RealEstate = await ethers.getContractFactory("RealEstateContract");

  console.log("Deploying RealEstateContract...");
  const realEstate = await RealEstate.deploy();

  await realEstate.waitForDeployment();
  console.log(`RealEstateContract deployed to: ${realEstate.target}`);

  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    await realEstate.deployTransaction.wait(5);
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: realEstate.target,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
