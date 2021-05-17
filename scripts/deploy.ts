import { ethers } from "hardhat";
import { NodeList__factory, NodeList } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

async function main(): Promise<void> {
  const sigers: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deployer:", sigers[0].address);
  console.log("Balance:", ethers.utils.formatEther(await sigers[0].getBalance()));
  const NodeList: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
  const node_list: NodeList = await NodeList.deploy();
  await node_list.deployed();

  console.log("Node List deployed to: ", node_list.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
