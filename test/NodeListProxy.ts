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
        expect(await nodelistProxy.nodeRegistered(epoch , accounts[whitelist[i]].address)).to.be.true;
      }
    });

    it("Shouldn't be able to add already registered node to epoch",async () => {
      let epoch = 1;

      await expect(nodelistProxy
          .connect(accounts[whitelist[0]])
          .listNode(epoch, "127.0.0.0", 256, 512, "tmp2p0", "p2p0")).to.be.revertedWith("Node is already registered");
    })
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

  describe("Negative test cases in Configure nodes", () => {
    it("UpdateEpoch with node address that is not whitelisted", async () => {
      const epoch = ethers.BigNumber.from(1),
        k = ethers.BigNumber.from(3),
        t = ethers.BigNumber.from(1),
        prevEpoch = 0,
        nextEpoch = 2;

      await expect(nodelistProxy.updateEpoch(epoch, n, k, t, [accounts[0].address], prevEpoch, nextEpoch)).to.be.revertedWith("Node isn't whitelisted for epoch");
    });

    it("Node that is not whitelisted can't be added to nodelist of the epoch", async() => {
      let epoch = 1;

      await expect(nodelistProxy
        .connect(accounts[4])
        .listNode(epoch, "127.0.0.4", 5 * 256, 5 * 512, "tmp2p4", "p2p4")).to.be.revertedWith("Node isn't whitelisted for epoch");
    })
    
    it("Adding listNode to a invalid epoch", async () => {
      let epoch = 4;

      const tx = await nodelistProxy.updateWhitelist(epoch, accounts[4].address, true);
      await tx.wait();

      await expect(nodelistProxy
        .connect(accounts[4])
        .listNode(epoch, "127.0.0.4", 5 * 256, 5 * 512, "tmp2p4", "p2p4")).to.be.revertedWith("Epoch already created");
    })

    it("Should not be able to update whitelist invalid Epoch",async () => {
      const epoch = ethers.BigNumber.from(4),
        k = ethers.BigNumber.from(3),
        t = ethers.BigNumber.from(1),
        prevEpoch = 0,
        nextEpoch = 2;

       await expect(nodelistProxy.updateWhitelist(epoch, accounts[0].address, true)).to.be.revertedWith("Invalid Epoch"); 
    })
  });

  describe("Set current epoch", () => {
    it("Should change current epoch", async () => {
      const epoch = ethers.BigNumber.from(2);
      const tx = await await nodelistProxy.setCurrentEpoch(epoch);
      await tx.wait();
      expect(await nodelistProxy.currentEpoch()).to.equal(epoch);
    });
  });

  describe("Update PssStatus", () => {
    it("Update PssStatus",async () => {
      const oldEpoch = ethers.BigNumber.from(1);
      const newEpoch = ethers.BigNumber.from(2);
      const status = 1;

      const tx = await nodelistProxy.updatePssStatus(oldEpoch, newEpoch, status);
      await tx.wait();
      expect(await nodelistProxy.getPssStatus(oldEpoch, newEpoch)).to.equal(status);
    })
  })

  describe("Delete all epochs", () => {
    it("Should remoave all epoch data", async () => {
      expect((await nodelistProxy.getEpochInfo(1)).n).equal(n);
      const tx = await nodelistProxy.clearAllEpoch();
      await tx.wait();
      expect((await nodelistProxy.getEpochInfo(1)).n).equal(ethers.constants.Zero);
    });
  });
});
