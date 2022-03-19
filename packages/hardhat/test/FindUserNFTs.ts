import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from '@ethersproject/contracts';
import { 
    pictures, goodPrice, gasLimit, originalListingPrice,
} from './_data';

describe("Finding all user NFTs", () => {
    let nftMarketContract: any;

    before(async () => {
        const NFTMarketContractFactory: ContractFactory = await ethers.getContractFactory("NFTMarket");
        let NFTMarketContract: Contract = await NFTMarketContractFactory.deploy();        
        nftMarketContract = await NFTMarketContract.deployed();
    });

    it ('should return all user nfts for sale', async () => {
        const signers = await ethers.getSigners();
        const creator = signers[1];
        const buyer = signers[2];
        
        // CREATE
        // console.log(`Creating NFT 1 with ${creator.address}`);
        await nftMarketContract.connect(creator).createToken(
            pictures[0].name,
            pictures[0].description,
            pictures[0].url,
            goodPrice,
            { gasLimit, value: originalListingPrice }
        );

        // SALE
        // console.log(`Purchasing NFT 1 with ${buyer.address}`);
        await nftMarketContract.connect(buyer).createMarketSale(1, { value: goodPrice, gasLimit });
        const items = await nftMarketContract.connect(buyer).fetchMyNFTs();
        expect(items.length).to.equal(1);

        // CREATE
        // console.log(`Creating NFT 2 with ${creator.address}`);
        await nftMarketContract.connect(creator).createToken(
            pictures[1].name,
            pictures[1].description,
            pictures[1].url,
            goodPrice,
            { gasLimit, value: originalListingPrice }
        );

        // SALE
        // console.log(`Purchasing NFT 2 with ${buyer.address}`);
        await nftMarketContract.connect(buyer).createMarketSale(2, { value: goodPrice, gasLimit });
        const updatedItems = await nftMarketContract.connect(buyer).fetchMyNFTs();
        expect(updatedItems.length).to.equal(2);
    });
});
