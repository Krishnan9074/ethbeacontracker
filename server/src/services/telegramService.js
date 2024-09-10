const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

function sendAlert(message) {
  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
}

module.exports = {
  sendAlert
};