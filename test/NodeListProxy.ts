import { expect, should } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NodeList__factory } from "../typechain";

describe("NodeList (Proxy)", () => {
  let nodelistProxy: any, accounts: SignerWithAddress[], whitelist: string[];

  beforeEach("Deploy Contracts", async () => {
    const NodeListFactory: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
    nodelistProxy = await upgrades.deployProxy(NodeListFactory);
    await nodelistProxy.deployed();
    accounts = await ethers.getSigners();
  });

  describe("After Deploy", () => {
    it("should have valid address", async () => {
      expect(nodelistProxy.address).to.not.equal(ethers.constants.AddressZero);
    });
  });

  describe("Configure whitelist", () => {
    it("Should updateEpoch", async () => {
      const epoch = ethers.BigNumber.from(1),
        n = ethers.BigNumber.from(5),
        k = ethers.BigNumber.from(3),
        t = ethers.BigNumber.from(1),
        prevEpoch = 0,
        nextEpoch = 2;
      whitelist = [accounts[0].address, accounts[2].address];
      let tx = await nodelistProxy.updateEpoch(epoch, n, k, t, whitelist, prevEpoch, nextEpoch);
      await tx.wait();
      const epochData = await nodelistProxy.getEpochInfo(epoch);

      expect(epochData.id).to.equal(epoch);
      expect(epochData.n).to.equal(n);
      expect(epochData.k).to.equal(k);
      expect(epochData.t).to.equal(t);
      for (let i = 0; i < whitelist.length; i++) {
        expect(epochData.nodeList[i]).to.equal(whitelist[i]);
      }
      expect(epochData.prevEpoch).to.equal(prevEpoch);
      expect(epochData.nextEpoch).to.equal(nextEpoch);
    });

    it("Should update whitelist", async()=>{
        let epoch = 1;
        whitelist.forEach(async(acc)=>{
            const tx = await nodelistProxy.updateWhitelist(epoch, acc, true);
            await tx.wait();
            expect(await nodelistProxy.isWhitelisted(epoch, acc)).to.be.true;
        })
    })
  });
});
