const constants = require("../others/constants");
const fs = require('fs-extra');
const path = require('path');
const utils = require("../others/utils");

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

        this.web3 = web3;
    }

    async newWallet(req, res) {
        const wallet = await this.web3
                                 .eth
                                 .personal
                                 .newAccount('userId');

        utils.setBodyResponse({"ok":"ok"}, 200, res);
    }
}

module.exports = WalletService;