const WalletService = require('../services/WalletService');
const Logger = require("./Logger");
const utils = require("../others/utils");
const Deposits = require("../data/Deposit");
const ethers = require("ethers");
const config = require("../main/config");

const getContract = (senderWallet) => {
    return new ethers.Contract(config.contractAddress, config.contractAbi, senderWallet);
};

async function createDeposit(req,
                             res) {
    Logger.info(`Creating deposit`)
    const amountToSend = req.body.amountInEthers;
    const senderWalletId = req.body.senderId;
    const senderWallet = await WalletService.getWallet(senderWalletId);
    if (senderWallet === null || senderWallet === undefined) {
        utils.setErrorResponse(`Cannot get wallet with id: ${senderWalletId}`, 400, res);
        return;
    }
    const basicPayments = await getContract(senderWallet);
    const tx = await basicPayments.deposit({
        value: await ethers.utils.parseEther(amountToSend).toHexString(),
    }).catch(error => {
        Logger.error(error.reason);
        utils.setErrorResponse(error.reason, 400, res);
    });

    if(tx === undefined) return;
    const txToPrint = JSON.stringify(tx);

    Logger.info(`transaction: ${txToPrint}`);
    tx.wait(1).then(
        async receipt => {
            console.log("Transaction mined");
            const firstEvent = receipt && receipt.events && receipt.events[0];
            console.log(firstEvent);
            if (firstEvent && firstEvent.event == "DepositMade") {
                await Deposits.create({
                    id: tx.hash,
                    senderAddress: firstEvent.args.sender,
                    amountSent: ethers.utils.formatEther(firstEvent.args.amount)
                }).catch(error => {
                    Logger.error("Cannot save deposit: " + error.toString());
                    utils.setErrorResponse("Error to try create deposit.", 500, res);
                });
                utils.setBodyResponse(tx, 200, res);
            } else {
                Logger.error(`Payment not created in tx ${tx.hash}`);
                utils.setErrorResponse("Error to try create deposit.", 500, res);
            }
        },
        error => {
            const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
            const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
            Logger.error("reasons List");
            Logger.error(reasonsList);

            Logger.error("message");
            Logger.error(message);
        },
    );
}

async function getDeposit(req,
                          res) {
    Logger.info("Get deposit with txHash:" + req.params.txHash)

    const deposit = await Deposits.findOne({
        where: {
            id: req.params.txHash
        }
    }).catch(error => {
        Logger.error("Error in access to database" + error.toString());

        utils.setErrorResponse("Cannot find deposit with txHash: " + req.params.txHash,
                                400,
                                res)
    });

    if (deposit === null || deposit === undefined
                         || res.statusCode >= 400) {
        Logger.error("Cannot get deposit with txHash:" + req.params.txHash);

        return;
    }

    Logger.info(`Deposit founded`);

    utils.setBodyResponse(deposit, 200, res);
}

async function getDeposits(req,
                           res) {
    Logger.info("Get deposits");

    const deposits = await Deposits.findAll({})
        .catch(error => {
            Logger.error("Error accessing to database.");

            return utils.setErrorResponse("No se pudieron obtener las transacciones)",
                                          400,
                                          res);
        } );

    if (deposits === null || deposits === undefined
                          || res.statusCode >= 400) {
        Logger.error("Cannot get deposits");

        return;
    }

    utils.setBodyResponse(deposits,
                          200,
                          res);
}

module.exports = {
    createDeposit, getDeposit, getDeposits
};
