const constants = require("../others/constants");
const utils = require("../others/utils");
const Logger = require("./Logger");
const Wallets = require("../data/Wallets");
const Sequelize = require("sequelize");


//const mnemonic = "vital bronze brave idle surround orchard inner edit document this hawk casino";

//const provider = new HDWalletProvider(mnemonic,
//    "http://localhost:4483");


class WalletService {
    constructor() {
    }

    defineEvents(app, web3) {
        app.post(constants.WALLET_URL,
            this.newWallet
                .bind(this));

        app.get(constants.WALLET_URL,
            this.getWallet
                .bind(this));

        this.web3 = web3;
    }

    async newWallet(req, res) {
        Logger.request(constants.WALLET_URL);

        const wallet = await this.web3
            .eth
            .accounts
            .create();

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

        utils.setBodyResponse({
            "id": saved.id, "address": saved.address,
            "privateKey": saved.privateKey
        }, 200, res);
    }

    async getWallet(req, res) {
        Logger.request(constants.WALLET_URL);
        Logger.info("Get wallet with id:"+req)

        await Wallets.create({
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
        utils.setBodyResponse({"wallet": wallet}, 200, res);
    }
}

module.exports = WalletService;