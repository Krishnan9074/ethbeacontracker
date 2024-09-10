require('dotenv').config();

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  infuraUrl: process.env.INFURA_URL,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  beaconDepositContract: process.env.BEACON_DEPOSIT_CONTRACT,
  startingBlock: parseInt(process.env.STARTING_BLOCK, 10)
};