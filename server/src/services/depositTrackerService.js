const Deposit = require('../models/Deposit');
const ethereumService = require('./ethereumService');
const logger = require('../utils/logger');
const config = require('../config/config');

async function trackDeposits() {
    try {
        const latestBlock = await ethereumService.getLatestBlockNumber();
        const startBlock = await getLastProcessedBlock();
        
        console.log(`Tracking deposits from block ${startBlock} to ${latestBlock}`);
    
        const transactions = await ethereumService.getTransactions(startBlock, latestBlock);
        console.log(`Found transactions: ${transactions.length}`);
    
        for (const txHash of transactions) {
            const depositDetails = await ethereumService.getTransactionDetails(txHash);
            console.log(`Processing deposit: ${depositDetails.hash}`);

            // Convert `BigInt` to `Number` or `String` for MongoDB
            depositDetails.blockNumber = Number(depositDetails.blockNumber);
            depositDetails.fee = depositDetails.fee.toString(); // Ensure fee is a string

            await Deposit.create(depositDetails);
            console.log('Deposit stored in MongoDB:', depositDetails);
        }
        
        await updateLastProcessedBlock(latestBlock);
    } catch (error) {
        console.error('Error tracking deposits:', error);
    }
}

async function getLastProcessedBlock() {
    // Retrieve the last processed block from the database
    const lastDeposit = await Deposit.findOne().sort({ blockNumber: -1 });
    return lastDeposit ? Number(lastDeposit.blockNumber) + 1 : Number(config.startingBlock);
}

async function updateLastProcessedBlock(blockNumber) {
    await Deposit.findOneAndUpdate(
        {},
        { $set: { lastProcessedBlock: blockNumber.toString() } }, // Store block as string
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
}

module.exports = {
    trackDeposits
};

