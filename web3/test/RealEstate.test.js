const { expect } = require("chai");
const { ethers } = require("hardhat");

const SAMPLE_INPUTS = {
  price: ethers.parseEther("10"),
  title: "Dummy House",
  description: "2BHK Fully Furnished Housing",
  category: "Residential",
  propertyAddress: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore consequatur iusto, ea iste voluptatem commodi saepe molestias. Exercitationem cumque illum tempore harum possimus aliquam veniam voluptatibus, officiis odio iste itaque.",
  images: "https://some-image.jpg",
};

describe("RealEstate", function () {
  let realEstate, owner, buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    const RealEstate = await ethers.getContractFactory("RealEstateContract");
    realEstate = await RealEstate.deploy();
    await realEstate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      expect(realEstate.target).to.be.properAddress;
    });
  });

  describe("Property Listing", function () {
    it("Should allow a real estate owner to register a property", async function () {
      await realEstate
        .connect(owner)
        .registerProperty(
          SAMPLE_INPUTS.title,
          SAMPLE_INPUTS.description,
          SAMPLE_INPUTS.category,
          SAMPLE_INPUTS.propertyAddress,
          SAMPLE_INPUTS.images,
          SAMPLE_INPUTS.price
        );

      const property = await realEstate.getProperty(1);
      expect(property.owner).to.equal(owner.address);
      expect(property.price).to.equal(SAMPLE_INPUTS.price);
      expect(property.isListed).to.be.false;
    });

    it("Should allow an owner to list a property for sale", async function () {
      // Register the property first
      await realEstate
        .connect(owner)
        .registerProperty(
          SAMPLE_INPUTS.title,
          SAMPLE_INPUTS.description,
          SAMPLE_INPUTS.category,
          SAMPLE_INPUTS.propertyAddress,
          SAMPLE_INPUTS.images,
          SAMPLE_INPUTS.price
        );

      // Then list the property
      await realEstate.connect(owner).listProperty(1, SAMPLE_INPUTS.price);

      const property = await realEstate.getProperty(1);
      expect(property.owner).to.equal(owner.address);
      expect(property.price).to.equal(SAMPLE_INPUTS.price);
      expect(property.isListed).to.be.true;
    });
  });

  describe("Property Purchase", function () {
    it("Should allow a buyer to purchase a listed property", async function () {
      // Register and list the property
      await realEstate
        .connect(owner)
        .registerProperty(
          SAMPLE_INPUTS.title,
          SAMPLE_INPUTS.description,
          SAMPLE_INPUTS.category,
          SAMPLE_INPUTS.propertyAddress,
          SAMPLE_INPUTS.images,
          SAMPLE_INPUTS.price
        );
      await realEstate.connect(owner).listProperty(1, SAMPLE_INPUTS.price);

      // Buyer purchases the property
      await realEstate
        .connect(buyer)
        .buyProperty(1, { value: SAMPLE_INPUTS.price });

      const property = await realEstate.getProperty(1);
      expect(property.owner).to.equal(buyer.address);
      expect(property.isListed).to.be.false;
    });

    it("Should fail if the property is not listed", async function () {
      await expect(
        realEstate.connect(buyer).buyProperty(1, { value: SAMPLE_INPUTS.price })
      ).to.be.revertedWithCustomError(realEstate, "PropertyIsNotUpForSale");
    });

    it("Should fail if the buyer sends insufficient funds", async function () {
      // Register and list the property
      await realEstate
        .connect(owner)
        .registerProperty(
          SAMPLE_INPUTS.title,
          SAMPLE_INPUTS.description,
          SAMPLE_INPUTS.category,
          SAMPLE_INPUTS.propertyAddress,
          SAMPLE_INPUTS.images,
          SAMPLE_INPUTS.price
        );
      await realEstate.connect(owner).listProperty(1, SAMPLE_INPUTS.price);

      // Buyer tries to purchase the property with insufficient funds
      const insufficientPrice = ethers.parseEther("5");
      await expect(
        realEstate.connect(buyer).buyProperty(1, { value: insufficientPrice })
      ).to.be.revertedWithCustomError(realEstate, "SentEthIsLessThanRequiredAmount");
    });
  });

  describe("Ownership Query", function () {
    it("Should return the correct owner for a property", async function () {
      // Register and list the property, then buyer purchases it
      await realEstate
        .connect(owner)
        .registerProperty(
          SAMPLE_INPUTS.title,
          SAMPLE_INPUTS.description,
          SAMPLE_INPUTS.category,
          SAMPLE_INPUTS.propertyAddress,
          SAMPLE_INPUTS.images,
          SAMPLE_INPUTS.price
        );
      await realEstate.connect(owner).listProperty(1, SAMPLE_INPUTS.price);
      await realEstate
        .connect(buyer)
        .buyProperty(1, { value: SAMPLE_INPUTS.price });

      const property = await realEstate.getProperty(1);
      expect(property.owner).to.equal(buyer.address);
    });
  });
});
