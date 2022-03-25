const Web3 = require("web3");
const ganache = require("ganache");
const web3 = new Web3(ganache.provider());
const fs = require('fs-extra');
const path = require('path');
const contractFile = path.resolve(__dirname, "../main/artifacts/contracts/BasicPayments.sol/BasicPayments.json");
const source = fs.readFileSync(contractFile, 'utf8');
const parsedContract = JSON.parse(source);
const WalletService = require('../services/WalletService');
const Logger = require("./Logger");

async function createDeposit(req, res) {
    const senderWallet = req.body.senderId;
    const amountToSend = req.body.amountInEthers;
    const contract = new web3.eth.Contract(parsedContract.abi);
    const wallet = WalletService.getWallet(req.body.senderId)
}


async function getDeposit(req, res) {
    const txHash = req.params.txHash;
    tx = web3.eth.getTransaction(txHash)
    Logger.info(tx)
    //TODO
}

module.exports = {createDeposit, getDeposit};