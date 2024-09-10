// const {Web3} = require('web3');
// const web3 = new Web3('https://mainnet.infura.io/v3/d276a0a298dc40d68cf00e2958738eaf');

// web3.eth.net.isListening()
//   .then(() => console.log('Connected to Infura'))
//   .catch(e => console.log('Something went wrong', e));

// const mongoose = require('mongoose');
// const config = require('./config/config');
// const logger = require('./utils/logger');

// mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     logger.info('Connected to MongoDB');
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     logger.error('MongoDB connection error:', error);
//     console.error('MongoDB connection error:', error);
//   });

// const {Web3} = require('web3');

// // Replace with your Infura project ID
// const infuraUrl = 'https://mainnet.infura.io/v3/d276a0a298dc40d68cf00e2958738eaf';
// const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

// async function getRecentTransactions() {
//   try {
//     const latestBlockNumber = await web3.eth.getBlockNumber();
//     console.log('Latest Block Number:', latestBlockNumber);

//     let transactions = [];
//     let blockNumber = latestBlockNumber;

//     while (transactions.length < 5 && blockNumber >= 0) {
//       const block = await web3.eth.getBlock(blockNumber, true);
//       if (block && block.transactions) {
//         block.transactions.forEach((tx) => {
//           if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
//             transactions.push(tx);
//           }
//         });
//       }
//       blockNumber--;
//     }

//     console.log('Last 5 Transactions:');
//     transactions.slice(0, 5).forEach((tx, index) => {
//       console.log(`${index + 1}:`, tx);
//     });

//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   }
// }

// getRecentTransactions();

// const {Web3} = require('web3');

// // Replace with your Infura project ID
// const infuraUrl = 'https://mainnet.infura.io/v3/d276a0a298dc40d68cf00e2958738eaf';
// const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

// async function getRecentDeposits() {
//   try {
//     const latestBlockNumber = await web3.eth.getBlockNumber();
//     console.log('Latest Block Number:', latestBlockNumber);

//     let transactions = [];
//     let blockNumber = latestBlockNumber;

//     // Loop through blocks to find transactions to the contract
//     while (transactions.length < 5 && blockNumber >= 0) {
//       const block = await web3.eth.getBlock(blockNumber, true);
//       if (block && block.transactions) {
//         block.transactions.forEach((tx) => {
//           if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
//             transactions.push({
//               blockNumber: tx.blockNumber,
//               blockTimestamp: new Date(block.timestamp * 1000),
//               fee: web3.utils.fromWei((BigInt(tx.gasPrice) * BigInt(tx.gas)).toString(), 'ether'),
//               hash: tx.hash,
//               pubkey: tx.input // Adjust this if the input format is known
//             });
//           }
//         });
//       }
//       blockNumber--;
//     }

//     console.log('Last 5 Transactions:');
//     transactions.slice(0, 5).forEach((tx, index) => {
//       console.log(`${index + 1}:`, tx);
//     });

//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   }
// }

// getRecentDeposits();

// const { Web3 } = require('web3');

// // Replace with your Infura project ID
// const infuraUrl = 'https://mainnet.infura.io/v3/d276a0a298dc40d68cf00e2958738eaf';
// const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

// const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

// async function getRecentDeposits() {
//   try {
//     const latestBlockNumber = await web3.eth.getBlockNumber();
//     console.log('Latest Block Number:', latestBlockNumber);

//     let transactions = [];
//     let blockNumber = latestBlockNumber;

//     // Loop through blocks to find transactions to the contract
//     while (transactions.length < 5 && blockNumber >= 0) {
//       const block = await web3.eth.getBlock(blockNumber, true);
//       if (block && block.transactions) {
//         block.transactions.forEach((tx) => {
//           if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
//             const gasPrice = BigInt(tx.gasPrice); // Ensure this is BigInt
//             const gasUsed = BigInt(tx.gas); // Ensure this is BigInt
//             const fee = web3.utils.fromWei((gasPrice * gasUsed).toString(), 'ether');

//             transactions.push({
//               blockNumber: tx.blockNumber,
//               blockTimestamp: new Date(Number(block.timestamp) * 1000), // Ensure timestamp is treated as a number
//               fee: fee,
//               hash: tx.hash,
//               pubkey: tx.input.slice(0, 66) // Adjust this if the input format is known
//             });
//           }
//         });
//       }
//       blockNumber--;
//     }

//     console.log('Last 5 Transactions:');
//     transactions.slice(0, 5).forEach((tx, index) => {
//       console.log(`${index + 1}:`, tx);
//     });

//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//   }
// }

// getRecentDeposits();


//internal trxns:
const { Web3 } = require('web3');

// Replace with your Infura project ID
const infuraUrl = 'https://mainnet.infura.io/v3/d276a0a298dc40d68cf00e2958738eaf';
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

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

async function getRecentDepositsWithInternals() {
  try {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log('Latest Block Number:', latestBlockNumber);

    let transactions = [];
    let blockNumber = latestBlockNumber;

    while (transactions.length < 5 && blockNumber >= 0) {
      const block = await web3.eth.getBlock(blockNumber, true);
      if (block && block.transactions) {
        for (const tx of block.transactions) {
          if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
            const gasPrice = BigInt(tx.gasPrice);
            const gasUsed = BigInt(tx.gas);
            const fee = web3.utils.fromWei((gasPrice * gasUsed).toString(), 'ether');

            const internalTxs = await getInternalTransactions(tx.hash);

            transactions.push({
              blockNumber: tx.blockNumber,
              blockTimestamp: new Date(Number(block.timestamp) * 1000),
              fee: fee,
              hash: tx.hash,
              internalTransactions: internalTxs
            });

            if (transactions.length >= 5) break;
          }
        }
      }
      blockNumber--;
    }

    console.log('Last 5 Transactions with Internal Transactions:');
    transactions.forEach((tx, index) => {
      console.log(`${index + 1}:`, tx);
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}

getRecentDepositsWithInternals();