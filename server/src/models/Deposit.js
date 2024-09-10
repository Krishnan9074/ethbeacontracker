const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  blockNumber: Number,
  blockTimestamp: Date,
  fee: String,
  hash: { type: String, unique: true }, // Ensure unique transaction hashes
  pubkey: String,
  from: String,
  to: String,
  value: String,
  isInternal: { type: Boolean, default: false }
});

module.exports = mongoose.model('Deposit', depositSchema);