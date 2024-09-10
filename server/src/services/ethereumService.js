const { Web3 } = require('web3');
const Deposit = require('../models/Deposit');
const config = require('../config/config');
const { sendAlert } = require('./telegramService');

// Initialize Web3 with Infura URL
const web3 = new Web3(config.infuraUrl);
const MAX_RESULTS_PER_REQUEST = 10000n; // Use BigInt for the limit

async function getRecentDeposits() {
  try {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log('Latest Block Number:', latestBlockNumber);

    let transactions = [];
    let blockNumber = BigInt(latestBlockNumber);

    // Loop through blocks to find transactions to the contract
    while (transactions.length < 5 && blockNumber >= 0n) {
      const fromBlockLimit = blockNumber > MAX_RESULTS_PER_REQUEST ? blockNumber - MAX_RESULTS_PER_REQUEST : 0n;

      console.log(`Fetching logs from block ${fromBlockLimit} to ${blockNumber}`);

      const events = await web3.eth.getPastLogs({
        fromBlock: web3.utils.toHex(fromBlockLimit),
        toBlock: web3.utils.toHex(blockNumber),
        address: config.beaconDepositContract
      });

      if (events && events.length > 0) {
        const filteredTransactions = events
          .filter((event) => event.address.toLowerCase() === config.beaconDepositContract.toLowerCase())
          .map((event) => event.transactionHash);

        for (const txHash of filteredTransactions) {
          const exists = await Deposit.exists({ hash: txHash });
          if (!exists) {
            const txDetails = await getTransactionDetails(txHash);
            const deposit = new Deposit(txDetails);
            await deposit.save();
            transactions.push(txHash);

            // Send alert for new transaction
            sendAlert(`Hi, A new transaction has been detected: ${txHash}`);
          }
        }
      }

      // Break if we have enough transactions
      if (transactions.length >= 5) break;

      blockNumber = fromBlockLimit - 1n;
    }

    console.log('Last 5 Transactions:');
    transactions.slice(0, 5).forEach((tx, index) => {
      console.log(`${index + 1}:`, tx);
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}

async function getTransactionDetails(txHash) {
  const tx = await web3.eth.getTransaction(txHash);
  const receipt = await web3.eth.getTransactionReceipt(txHash);
  const block = await web3.eth.getBlock(tx.blockNumber);

  return {
    blockNumber: tx.blockNumber,
    blockTimestamp: new Date(Number(block.timestamp) * 1000),
    fee: web3.utils.fromWei((BigInt(tx.gasPrice) * BigInt(receipt.gasUsed)).toString(), 'ether'),
    hash: tx.hash,
    pubkey: extractPubKey(tx.input)
  };
}

async function getLatestBlockNumber() {
  return await web3.eth.getBlockNumber();
}

async function getTransactions(fromBlock, toBlock) {
  const transactions = [];
  let currentFromBlock = BigInt(fromBlock);

  while (currentFromBlock <= BigInt(toBlock)) {
    const currentToBlock = currentFromBlock + MAX_RESULTS_PER_REQUEST - 1n;
    const toBlockLimit = currentToBlock < BigInt(toBlock) ? currentToBlock : BigInt(toBlock);

    try {
      const events = await web3.eth.getPastLogs({
        fromBlock: web3.utils.toHex(currentFromBlock),
        toBlock: web3.utils.toHex(toBlockLimit),
        address: config.beaconDepositContract
      });

      transactions.push(...events.map(event => event.transactionHash));
    } catch (error) {
      console.error(`Error fetching logs from block ${currentFromBlock} to ${toBlockLimit}:`, error);
    }

    currentFromBlock = toBlockLimit + 1n;
  }

  return transactions;
}

function extractPubKey(input) {
  return '0x' + input.slice(10, 74);
}

async function getInternalTransactions(txHash) {
  try {
    const trace = await web3.eth.call({
      to: null,
      data: web3.eth.abi.encodeFunctionCall({
        name: 'debug_traceTransaction',
        type: 'function',
        inputs: [{
          type: 'bytes32',
          name: 'txHash'
        }, {
          type: 'object',
          name: 'options'
        }]
      }, [txHash, { tracer: 'callTracer' }])
    });

    const decodedTrace = web3.eth.abi.decodeParameters(['object'], trace)[0];
    return parseInternalTransactions(decodedTrace);
  } catch (error) {
    console.error('Error tracing transaction:', error);
    return [];
  }
}

function parseInternalTransactions(trace, parentAddress = null) {
  let internalTxs = [];
  if (trace.calls) {
    for (const call of trace.calls) {
      if (call.type === 'CALL' && call.value !== '0x0') {
        internalTxs.push({
          from: parentAddress || trace.from,
          to: call.to,
          value: web3.utils.fromWei(call.value, 'ether')
        });
      }
      internalTxs = internalTxs.concat(parseInternalTransactions(call, call.to));
    }
  }
  return internalTxs;
}

async function getTransactionWithInternals(txHash) {
  try {
    const tx = await web3.eth.getTransaction(txHash);
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    const block = await web3.eth.getBlock(tx.blockNumber);
    const internalTxs = await getInternalTransactions(txHash);

    return {
      blockNumber: tx.blockNumber,
      blockTimestamp: new Date(Number(block.timestamp) * 1000),
      fee: web3.utils.fromWei((BigInt(tx.gasPrice) * BigInt(receipt.gasUsed)).toString(), 'ether'),
      hash: tx.hash,
      pubkey: extractPubKey(tx.input),
      internalTransactions: internalTxs
    };
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
}

module.exports = {
  getRecentDeposits,
  getLatestBlockNumber,
  getTransactions,
  getTransactionDetails,
  getTransactionWithInternals
};