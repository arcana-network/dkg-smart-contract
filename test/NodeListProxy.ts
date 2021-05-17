import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { NodeList, NodeList__factory } from "../typechain";

describe("NodeList (Proxy)", () => {
  let nodelistProxy: any, signers: SignerWithAddress[];

  beforeEach("Deploy Contracts", async () => {
    const NodeListFactory: NodeList__factory = (await ethers.getContractFactory("NodeList")) as NodeList__factory;
    nodelistProxy = await upgrades.deployProxy(NodeListFactory);
  });

  describe("After Deploy", () => {
    it("should have valid address", async () => {
      expect(nodelistProxy.address).to.not.equal(ethers.constants.AddressZero);
    });
  });
});
