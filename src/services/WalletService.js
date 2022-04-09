const utils = require("../others/utils");
const Logger = require("./Logger");
const Wallets = require("../data/Wallet");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());


//const mnemonic = "vital bronze brave idle surround orchard inner edit document this hawk casino";

//const provider = new HDWalletProvider(mnemonic,
//    "http://localhost:4483");

async function newWallet(req, res) {
    Logger.request("Create new wallet.");
    const wallet = await web3
        .eth
        .accounts
        .create();

    if (wallet === null) {
        Logger.error("Error to try create wallet.");
        utils.setErrorResponse("Error to try create wallet.",
            500,
            res);
        return;
    }

    Logger.info("Wallet created")

    const saved = await Wallets.create({
        address: wallet.address,
        privateKey: wallet.privateKey
    }).catch(error => {
        Logger.error("Cannot save wallet: " + error.toString());
        utils.setErrorResponse("Error to try create wallet.",
            500,
            res);
    });

    if (res.statusCode >= 400) {
        return;
    }

    Logger.info("Wallet saved")
    utils.setBodyResponse({"id": saved.id, "address": saved.address, "privateKey": saved.privateKey}, 200, res);
}

async function getWalletData(req, res) {
    Logger.info("Get wallet data with id:" + req.params.id)

    const wallet = await Wallets.findOne({
        attributes: ['id', 'address', 'privateKey'],
        where: {
            id: req.params.id
        }
    }).catch(error => {
        Logger.error("Error in access to database" + error.toString());
        utils.setErrorResponse("Internal Server error",
            500,
            res);
    });

    if (wallet === null || wallet === undefined) {
        Logger.error("Cannot get wallet with id:" + req.params.id);
        utils.setErrorResponse("Cannot find wallet with id: " + req.params.id,
            400,
            res);
    }
    if (res.statusCode >= 400) {
        return;
    }
    Logger.info(`Wallet founded`);
    utils.setBodyResponse(wallet, 200, res);
}

async function getWalletsData(req, res) {
    Logger.info("Get all wallets")

    const wallets = await Wallets.findAll(
        {attributes: ['id', 'address', 'privateKey']}
    ).catch(error => {
        Logger.error("Error in access to database" + error.toString());
        utils.setErrorResponse("Internal Server error",
            500,
            res);
    });

    if (wallets === null || wallets === undefined) {
        Logger.error("Cannot get all wallets");
        utils.setErrorResponse("Cannot get all wallets",
            500,
            res);
    }
    if (res.statusCode >= 400) {
        return;
    }
    Logger.info("wallets founded: " + wallets.length)
    utils.setBodyResponse(wallets, 200, res);
    return wallets;
}

async function getWallet(walletId) {
    Logger.info(`Get wallet with id: ${walletId}`)

    const savedWallet = await Wallets.findOne({
        attributes: ['id', 'privateKey'],
        where: {
            id: walletId
        }
    }).catch(error => {
        Logger.error("Error in access to database" + error.toString());
        return null;
    });

    if (savedWallet === null || savedWallet === undefined) {
        Logger.error(`Cannot get wallet with id: ${walletId}`);
        return null;
    }

    const wallet = web3.eth.accounts.privateKeyToAccount(savedWallet.privateKey)
    Logger.info("Wallet founded")
    return wallet
}

module.exports = {newWallet, getWalletData, getWalletsData, getWallet};