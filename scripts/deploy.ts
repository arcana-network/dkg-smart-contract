import { ethers, network, upgrades } from "hardhat";
import { NodeList__factory, NodeList } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { hashBytecodeWithoutMetadata, Manifest } from "@openzeppelin/upgrades-core";

async function main(): Promise<void> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const whiteList: string[] = [
    "0x0Ce58A86E00999d46C5F2E8D65137e1F8dAfEf16",
    "0x69AA96328064a4819cd8AD262cb9d56c3b21D12B",
    "0x29b18b7fEDF56D1F8E251Bb44A6E6df79456ba41",
    "0x8b1a8E67174d2D28e211eA4fA6b3ecc77B0B1aAB",
    "0x9993083792F60a50a8808AC4Fe8A63779DdADe23",
    "0x25060622EC9275e9171F65Eb134753f45416a60f",
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
