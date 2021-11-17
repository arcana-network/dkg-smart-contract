import { ethers, network, upgrades } from "hardhat";
import { NodeList__factory, NodeList } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { hashBytecodeWithoutMetadata, Manifest } from "@openzeppelin/upgrades-core";

async function main(): Promise<void> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const whiteList: string[] = [
    "0x3Db44493C3C071694440c73226495E86C9afB533",
    "0x02016fE0eEE7D9F2f2e0c5bAF2F975fbe08Ce332",
    "0x3Cf33b76E91bd3D11eC44da413692CE6fDEdA386",
    "0xFd44696F9926638a040A9997b651fE2f8d0c9A25",
    "0xf011196AC7cc06710f0Cc0eba38bC5410e85a5e9",
    "0x63B43066512e033f90f592E5aF098D84DC95aD10",
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
  console.log("Logic contract",implementationContract?.address);


  for (let i = 0; i < whiteList.length; i++) {
    const tx = await nodelistProxy.updateWhitelist(epoch, whiteList[i], true);
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
