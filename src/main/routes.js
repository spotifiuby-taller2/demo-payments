const constants = require("../others/constants");
const express = require('express')
const router = express.Router()
const WalletService = require('../services/WalletService');
const DepositService = require('../services/DepositService');

/**
 * @swagger
 * tags:
 *    name: Health check
 * /health-check:
 *    get:
 *      tags: [Health check]
 *      summary: health check.
 *      description: Check the status of application.
 *      responses:
 *          "200":
 *              description: Application up and running
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

/**
 * @swagger
 * tags:
 *    name: Wallet
 *    description: services of wallets
 * /wallet:
 *    post:
 *      tags: [Wallet]
 *      summary: Create wallet
 *      description: Create a new wallet.
 *      responses:
 *          "200":
 *              description: return created wallet
 *              content:
 *                  application/json
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Cannot create wallet"
 */
router.post(constants.WALLET_URL, (req, res) => {
    WalletService.newWallet(req, res);
});

/**
 * @swagger
 * /wallet/{id}:
 *    get:
 *      tags: [Wallet]
 *      summary: Get Wallet.
 *      description: Get wallet by id.
 *      parameters:
 *         - name: "id"
 *           in: path
 *           required: true
 *           description: id of wallet
 *           type: string
 *      responses:
 *          "200":
 *              description: "Get wallet"
 *          "400":
 *               description: "Could not find wallet with id {id}."
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.WALLET_URL + "/:id", (req, res) => {
    WalletService.getWalletData(req, res);
});

/**
 * @swagger
 * /wallet:
 *    get:
 *      tags: [Wallet]
 *      summary: Get Wallets.
 *      description: Get all wallets.
 *      responses:
 *          "200":
 *              description: A list of wallets
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.WALLET_URL, (req, res) => {
    WalletService.getWalletsData(req, res);
});

router.post(constants.DEPOSIT_URL, (req, res) => {
    DepositService.createDeposit(req, res);
});

router.get(constants.DEPOSIT_URL + "/:txHash", (req, res) => {
    DepositService.getDeposit(req, res);
});

router.get(constants.DEPOSITS_URL, (req, res) => {
    DepositService.getDeposits(req,
                               res);
});

module.exports = router;
