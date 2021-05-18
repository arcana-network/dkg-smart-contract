import { ethers, network, upgrades } from "hardhat";
import { NodeList__factory, NodeList } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { hashBytecodeWithoutMetadata, Manifest } from "@openzeppelin/upgrades-core";

async function main(): Promise<void> {
  const sigers: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer:", sigers[0].address);
  console.log("Balance:", ethers.utils.formatEther(await sigers[0].getBalance()));
  const NodeList: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
  const nodelistProxy = await upgrades.deployProxy(NodeList);
  await nodelistProxy.deployed();

  console.log("Node List deployed to: ", nodelistProxy.address);

  // Peer into OpenZeppelin manifest to extract the implementation address
  const ozUpgradesManifestClient = await Manifest.forNetwork(network.provider);
  const manifest = await ozUpgradesManifestClient.read();
  const bytecodeHash = hashBytecodeWithoutMetadata(NodeList.bytecode);
  const implementationContract = manifest.impls[bytecodeHash];

  console.log("Implemetation address:", implementationContract?.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
