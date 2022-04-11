import { expect, should } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NodeList__factory } from "../typechain";

describe("NodeList (Proxy)", () => {
  let nodelistProxy: any, accounts: SignerWithAddress[], whitelist: number[], whiteListAddress: string[];
  let currentEpoch = ethers.BigNumber.from(1);
  let n = ethers.BigNumber.from(5);

  before("Deploy Contracts", async () => {
    const NodeListFactory: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
    nodelistProxy = await upgrades.deployProxy(NodeListFactory, [currentEpoch]);
    await nodelistProxy.deployed();
    accounts = await ethers.getSigners();
  });

  describe("After Deploy", () => {
    it("Should have valid address", async () => {
      expect(nodelistProxy.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should match currrent epoch", async () => {
      expect(await nodelistProxy.currentEpoch()).equal(currentEpoch);
    });
  });

  describe("Configure nodes", () => {
    it("Should updateEpoch", async () => {
      const epoch = ethers.BigNumber.from(1),
        k = ethers.BigNumber.from(3),
        t = ethers.BigNumber.from(1),
        prevEpoch = 0,
        nextEpoch = 2;
      whitelist = [0, 2, 3];
      whiteListAddress = whitelist.map(d => {
        return accounts[d].address;
      });
      let tx = await nodelistProxy.updateEpoch(epoch, n, k, t, [], prevEpoch, nextEpoch);
      await tx.wait();
      const epochData = await nodelistProxy.getEpochInfo(epoch);

      expect(epochData.id).to.equal(epoch);
      expect(epochData.n).to.equal(n);
      expect(epochData.k).to.equal(k);
      expect(epochData.t).to.equal(t);
      expect(epochData.prevEpoch).to.equal(prevEpoch);
      expect(epochData.nextEpoch).to.equal(nextEpoch);
    });

    it("Should update whitelist", async () => {
      let epoch = 1;
      whiteListAddress.forEach(async acc => {
        const tx = await nodelistProxy.updateWhitelist(epoch, acc, true);
        await tx.wait();
        expect(await nodelistProxy.isWhitelisted(epoch, acc)).to.be.true;
      });
    });

    it("Should update nodeList", async () => {
      let epoch = 1;
      for (let i = 0; i < whitelist.length; i++) {
        await nodelistProxy
          .connect(accounts[whitelist[i]])
          .listNode(epoch, `127.0.0.${i}`, (i + 1) * 256, (i + 1) * 512, `tmp2p${i}`, `p2p${i}`);
      }
    });
  });

  describe("Node details", async () => {
    it("Fetch all node details", async () => {
      let nodes = await nodelistProxy.getCurrentEpochDetails();
      expect(nodes.length).equal(whitelist.length);
      for (let i = 0; i < whitelist.length; i++) {
        expect(nodes[i].declaredIp).equal(`127.0.0.${i}`);
        expect(nodes[i].pubKx).equal((i + 1) * 256);
        expect(nodes[i].pubKy).equal((i + 1) * 512);
        expect(nodes[i].tmP2PListenAddress).equal(`tmp2p${i}`);
        expect(nodes[i].p2pListenAddress).equal(`p2p${i}`);
      }
    });
  });

  describe("Set current epoch", () => {
    it("Should change current epoch", async () => {
      const epoch = ethers.BigNumber.from(2);
      const tx = await await nodelistProxy.setCurrentEpoch(epoch);
      await tx.wait();
      expect(await nodelistProxy.currentEpoch()).to.equal(epoch);
    });
  });

  describe("Delete all epochs", () => {
    it("Should remoave all epoch data", async () => {
      expect((await nodelistProxy.getEpochInfo(1)).n).equal(n);
      const tx = await nodelistProxy.clearAllEpoch();
      await tx.wait();
      expect((await nodelistProxy.getEpochInfo(1)).n).equal(ethers.constants.Zero);
    });
  });
});
