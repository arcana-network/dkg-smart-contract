import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { NodeList__factory } from "../typechain";

describe("NodeList (Proxy)", () => {
  let nodelistProxy: any, accounts: SignerWithAddress[];

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
        address = [accounts[0].address, accounts[2].address],
        prevEpoch = 0,
        nextEpoch = 2;
      let tx = await nodelistProxy.updateEpoch(epoch, n, k, t, address, prevEpoch, nextEpoch);
      await tx.wait();
      const epochData = await nodelistProxy.epochInfo(epoch);

      expect(epochData.id).to.equal(epoch);
      expect(epochData.n).to.equal(n);
      expect(epochData.k).to.equal(k);
      expect(epochData.t).to.equal(t);
    });
  });
});
