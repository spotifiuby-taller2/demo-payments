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

    /**
     * @swagger
     * /wallet:
     *   post:
     *    summary: Create wallet
     *
     *    description: Create a new wallet.
     *
     *    parameters:
     *         - userId: "user"
     *           in: body
     *           type: "string"
     *           required: true
     *
     *    responses:
     *         "200":
     *           description: "Created wallet."
     *
     *         "400":
     *           description: "Bad request. UserId is mandatory"
     *
     *         "500":
     *           description: "Could not create wallet."
     */

    defineEvents(app, web3) {
        app.post(constants.WALLET_URL,
            this.newWallet
                .bind(this));

        this.web3 = web3;
    }

    async newWallet(req, res) {
        Logger.request(constants.WALLET_URL);
        const userId = req.body.userId;
        if (userId === undefined) {
            utils.setErrorResponse("UserId is mandatory.",
                400,
                res);
            return;
        }

        const wallet = await this.web3
                                 .eth
                                 .personal
                                 .newAccount(userId);

        Logger.info("Wallet created")
        await Wallets.create( {
            id: wallet,
            creationTime: Sequelize.NOW //FIXME
        } ).catch(error => {
            Logger.error("Cannot save wallet: " +  error.toString());
            utils.setErrorResponse("Error to try create wallet.",
                500,
                res);
        } );

        if (res.statusCode >= 400) {
            return;
        }
        utils.setBodyResponse({"wallet":wallet}, 200, res);
    }
}

module.exports = WalletService;