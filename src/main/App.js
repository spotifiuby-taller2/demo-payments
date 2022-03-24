const database = require('../data/database');
const WalletService = require('../services/WalletService');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const {runMigrations} = require("../data/migrations");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {swaggerConfig} = require('./swaggerConfig');

const Web3 = require("web3");
const fs = require('fs-extra');
const path = require('path');
const ganache = require("ganache");

const web3 = new Web3(ganache.provider());

const contractFile = path.resolve(__dirname,
    "artifacts/contracts/BasicPayments.sol/BasicPayments.json");

const source = fs.readFileSync(contractFile,
    'utf8');

const parsedContract = JSON.parse(source);

const swaggerDoc = swaggerJsDoc(swaggerConfig);

class App {
    constructor() {
        this.app = express();

        this.app
            .use(cors());

        this.app
            .use(bodyParser.json());

        this.app.use

        this.app.use('/api-docs',
            swaggerUi.serve,
            swaggerUi.setup(swaggerDoc));

        this.WalletService = new WalletService();
    }

    async syncDB() {
        if (!constants.isDevelopment) {
            await runMigrations();
        }

        // "sync()" creates the database table for our model(s),
        // if we make .sync({force: true}),
        // the db is dropped first if it is already existed
        await database.sync({
            force: constants.RESET_DATABASE
        });

        this.app
            .listen(constants.nodePort, () => {
                console.log(`Listening on port ${constants.nodePort}`);
            });
    }

    defineLogLevel() {
        Logger.setLevel(constants.LOG_LEVEL);
    }

    defineEvents() {
        this.WalletService
            .defineEvents(this.app, web3);
    }

    async deployContract() {
        const myContract = new web3.eth.Contract(parsedContract.abi);

        // Wallet (address) used for the deployment is non deterministic
        const currentAccounts = await web3.eth.getAccounts();
        const address = currentAccounts[0];

        const parameter = {
            from: address,
            gas: web3.utils.toHex(800000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
        }

        let payload = {
            data: parsedContract.bytecode
        }

        await myContract.deploy(payload)
            .send(parameter, (err, transactionHash) => {
                console.log('Transaction Hash :' + transactionHash);
            }).on('confirmation', () => {
            })
            .then((newContractInstance) => {
                console.log('Deployed Contract Address');
            });
    }
}

const main = new App();

main.syncDB()
    .then(() => {
        main.defineLogLevel();
        main.defineEvents();
        main.deployContract();
    })
    .catch((error) => {
        console.log(error);
    });
