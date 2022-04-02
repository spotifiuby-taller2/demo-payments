const constants = require("../others/constants");
const express = require('express')
const router = express.Router()
const WalletService = require('../services/WalletService');
const DepositService = require('../services/DepositService');
const swaggerUi = require("swagger-ui-express");
const {swaggerConfig} = require('./swaggerConfig');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDoc = swaggerJsDoc(swaggerConfig);

router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.get('/api-docs', swaggerUi.serve,
    swaggerUi.setup(swaggerDoc));

router.post(constants.WALLET_URL, (req, res) => {
    WalletService.newWallet(req, res);
});

router.get(constants.WALLET_URL + "/:id", (req, res) => {
    WalletService.getWalletData(req, res);
});

router.get(constants.WALLET_URL, (req, res) => {
    WalletService.getWalletsData(req, res);
});

router.post(constants.DEPOSIT_URL, (req, res) => {
    DepositService.createDeposit(req, res);
});

router.get(constants.DEPOSIT_URL + ":txHash", (req, res) => {
    DepositService.getDeposit(req, res);
});

module.exports = router;
