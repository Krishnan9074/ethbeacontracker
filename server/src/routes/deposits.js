const express = require('express');
const Deposit = require('../models/Deposit');
const { getTransactionWithInternals } = require('../services/ethereumService');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log('GET /api/deposits called');
  try {
    const deposits = await Deposit.find()
      .sort({ blockNumber: -1 })
      .limit(5)
      .exec();

    console.log('Recent deposits:', deposits);

    const count = await Deposit.countDocuments();

    res.json({
      deposits,
      totalPages: Math.ceil(count / 2),
      currentPage: 1
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: error.message });
  }
});



router.get('/stats', async (req, res) => {
  console.log('GET /api/deposits/stats called');
  try {
    const totalDeposits = await Deposit.countDocuments();
    const latestDeposit = await Deposit.findOne().sort({ blockNumber: -1 });
    const oldestDeposit = await Deposit.findOne().sort({ blockNumber: 1 });

    console.log('Latest deposit:', latestDeposit);
    console.log('Oldest deposit:', oldestDeposit);

    res.json({
      totalDeposits,
      latestBlockNumber: latestDeposit ? latestDeposit.blockNumber : null,
      oldestBlockNumber: oldestDeposit ? oldestDeposit.blockNumber : null
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// New route for internal transactions
router.get('/internal/:txHash', async (req, res) => {
  console.log('GET /api/deposits/internal/:txHash called');
  try {
    const { txHash } = req.params;
    const transactionDetails = await getTransactionWithInternals(txHash);

    res.json(transactionDetails);
  } catch (error) {
    console.error('Error fetching internal transactions:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;