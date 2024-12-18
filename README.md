# Ethereum Deposit Tracker

This project is an Ethereum deposit tracking system that monitors transactions on a specified beacon contract address. It utilizes Node.js, Express, MongoDB, and Telegram for notifications and Nextjs for frontend and Infura to access the Ethereum Mainnet
# Project Screenshots :

<img width="1466" alt="image" src="https://github.com/user-attachments/assets/e3dcefd8-a316-4c3e-805e-cc4bc9497df5">

<img width="1036" alt="image" src="https://github.com/user-attachments/assets/57a4c255-768d-4091-be0c-8f51d2393ecb">

<img width="1466" alt="image" src="https://github.com/user-attachments/assets/3a832a6e-def7-4e86-9c00-564fc8930229">

<img width="1036" alt="image" src="https://github.com/user-attachments/assets/7fcce142-9c20-4d1f-8c09-d52617573e1a">


## Project Structure
# Server Directory Structure

```bash
server
│
├── src
│   ├── config
│   │   └── config.js               # Configuration settings
│   ├── models
│   │   └── Deposit.js              # Mongoose model for deposits
│   ├── routes
│   │   └── deposits.js             # API routes for deposits
│   ├── services
│   │   ├── depositTrackerService.js # Logic for tracking deposits
│   │   ├── ethereumService.js      # Ethereum interaction logic
│   │   └── telegramService.js      # Telegram notification service
│   ├── utils
│   │   └── logger.js               # Logging utility
│   ├── server.js                   # Server setup
│   ├── app.js                      # Application logic
│   └── test.js                     # Test scripts
│
├── public                          # Public assets
├── node_modules                    # Node.js dependencies
├── .env                            # Environment variables
├── abi.json                        # ABI for Ethereum contracts
├── package.json                    # Project metadata and scripts
├── package-lock.json               # Dependency lock file
└── README.md
```

## Features

- **Ethereum Monitoring**: Tracks deposits to a specified beacon contract address.
- **MongoDB Storage**: Stores transaction details in a MongoDB database.
- **Telegram Alerts**: Sends alerts for new transactions via Telegram.
- **REST API**: Provides endpoints to access transaction data.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ethereum-deposit-tracker.git
   cd ethereum-deposit-tracker

Install Dependencies:
```bash
npm install
```
2.**Set Up Environment Variables:**

Create a .env file in the root directory.
Add the necessary environment variables:
```bash
INFURA_URL=your_infura_url
MONGO_URI=your_mongo_uri
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
BEACON_DEPOSIT_CONTRACT=your_beacon_contract_address
```
Run the Application:
```bash
npm start
```
Dockerization
To run the application in a Docker container:
Build the Docker Image:
```bash
docker build -t ethereum-deposit-tracker .
```
Run the Docker Container:
```bash
docker run -p 8000:8000 ethereum-deposit-tracker
```
Usage
Access the API: Visit http://localhost:8000/api/deposits to access the deposit data.
Monitor Transactions: Check your Telegram for alerts on new transactions.


