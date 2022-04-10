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
const utils = require("../others/utils");
const Deposits = require("../data/Deposit");
/*
async function createDeposit(req, res) {
    Logger.info(`Creating deposit`)
    const senderWalletId = req.body.senderId;
    const amountToSend = req.body.amountInEthers;
    const contract = await new web3.eth.Contract(parsedContract.abi, process.env['CONTRACT_ADDRESS']);
    const wallet = WalletService.getWallet(senderWalletId);

    if (wallet === null || wallet === undefined) {
        utils.setErrorResponse(`Cannot get wallet with id: ${senderWalletId}`,
            400,
            res);
        return;
    }
    console.log(`wallet: ${wallet}`);

    /*const tx = contract.methods.deposit(
        //{value: web3.utils.toHex(amountToSend)}
    ).call({from: wallet.address});

    //TODO
    const tx = await contract.methods.deposit().call({from: wallet.address}, function(error, result){
        if(error){
            utils.setErrorResponse(`Cannot deposit`,
                500,
                res);
        }
        return result;
    });

    Logger.info(`transaction: ${tx}`);
    console.log("Session: %j", tx);
     tx.wait(1).then( //FIXME
        receipt => {
            console.log("Transaction mined");
            const firstEvent = receipt && receipt.events && receipt.events[0];
            console.log(firstEvent);
            if (firstEvent && firstEvent.event === "DepositMade") {
                Deposits.create({
                    id: tx.hash,
                    senderAddress: firstEvent.args.sender,
                    amountSent: firstEvent.args.amount
                }).catch(error => {
                    Logger.error("Cannot save deposit transaction: " + error.toString());
                    utils.setErrorResponse("Error to try save deposit.",
                        500,
                        res);
                });
            } else {
                console.error(`Payment not created in tx ${tx.hash}`);
            }
        },
        error => {
            const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
            const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
            console.error("reasons List");
            console.error(reasonsList);

            console.error("message");
            console.error(message);
        },
    );
    utils.setBodyResponse(tx, 200, res);
}

async function getDeposit(req, res) {
    //TODO
}

module.exports = {createDeposit, getDeposit};*/