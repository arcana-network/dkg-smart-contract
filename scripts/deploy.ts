import { ethers, network, upgrades } from "hardhat";
import { NodeList__factory, NodeList } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { hashBytecodeWithoutMetadata, Manifest } from "@openzeppelin/upgrades-core";

async function main(): Promise<void> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const whiteList: string[] = [
    "0xb657BF59714d693D4890BCe2d1f5a0Ae2b750899",
    "0xFEC50208aBbaB0D02ad11D4a25F156d0E4E0e97d",
    "0x3007b9B9AD17bB4F21326eBe53D68ca112a9A5ea",
    "0x341d193146f6d5B6c9Ce90BB5316C8d69AeE3eC1",
    "0x5884F02a31C0cF5895a46A50d4123c92be4822B1",
    "0x0daB49804022DeC1D2a35a89C51bc7B0148c8C2E",
    "0x2B6E0Fabc2Cb3dEa7dfA96C2a63483AC33C05982"
  ];
  console.log("Deployer:", signers[0].address);
  console.log("Balance:", ethers.utils.formatEther(await signers[0].getBalance()));
  console.log("Total signers", signers.length);

  const NodeList: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
  let epoch = 1;
  const nodelistProxy = await upgrades.deployProxy(NodeList, [epoch]);
  await nodelistProxy.deployed();

  console.log("Node List deployed to: ", nodelistProxy.address);

  // Peer into OpenZeppelin manifest to extract the implementation address
  const ozUpgradesManifestClient = await Manifest.forNetwork(network.provider);
  const manifest = await ozUpgradesManifestClient.read();
  const bytecodeHash = hashBytecodeWithoutMetadata(NodeList.bytecode);
  const implementationContract = manifest.impls[bytecodeHash];
  console.log("Logic contract", implementationContract?.address);

  for (let i = 0; i < whiteList.length; i++) {
    const tx = await nodelistProxy.updateWhitelist(epoch, whiteList[i], true);
    await tx.wait();
    console.log(`${whiteList[i]}: `, tx.hash);
  }

  console.log("Sending funds to whitelisted accounts");
  for (let i = 0; i < whiteList.length; i++) {
    const tx = await signers[0].sendTransaction({
      to: whiteList[i],
      value: ethers.utils.parseEther("1"),
    });

    await tx.wait();
    console.log(`${whiteList[i]}: `, tx.hash);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
