const database = require('../data/database');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const routes = require('./routes')
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const {runMigrations} = require("../data/migrations");
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

class App {
    constructor() {
        this.app = express();

        this.app
            .use(cors());

        this.app
            .use(bodyParser.json());
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
        this.app.use('/', routes);
    }

    async deployContract() {
        const myContract = new web3.eth.Contract(parsedContract.abi);

        // Wallet (address) used for the deployment is non deterministic
        const currentAccounts = await web3.eth.getAccounts(); // list of 10 accounts
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
                console.log(`Transaction Hash : ${transactionHash}`);
            }).on('confirmation', () => {
            })
            .then((newContractInstance) => {
                console.log(`Deployed Contract Address: ${newContractInstance.options.address}`);
                process.env['CONTRACT_ADDRESS'] = newContractInstance.options.address;
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
