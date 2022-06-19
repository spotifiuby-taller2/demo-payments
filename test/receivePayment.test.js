/*
import {fixtureDeployedBasicPayments} from './common-fixtures';
const {ethers, getNamedAccounts, waffle} = require('hardhat');
const chai = require('chai');
const {BigNumber} = require('@ethersproject/bignumber/lib/bignumber');

const {loadFixture} = waffle;
const {expect} = chai;

describe(`BasicPayments - Send payments to contract through deposit`, function () {
    describe(`GIVEN the Smart Contract was deployed`, () => {
        const deposit = (contractWithSigner, amountToBeSent) => {
            return contractWithSigner.deposit({value: amountToBeSent});
        };
        let basicPayments;
        before(async function () {
            basicPayments = await loadFixture(fixtureDeployedBasicPayments);
        });
        const testPaymentReceiving = (amountToBeSentInEthers) => {
            describe(`WHEN a user sends a payment of 3 ethers`, function () {
                let paymentTx;
                let sender;
                let amountToBeSentPreviously;
                const amountToBeSent = ethers.utils.parseEther(amountToBeSentInEthers);
                before(async function () {
                    const {sender: senderAddress} = await getNamedAccounts();
                    sender = await ethers.getSigner(senderAddress);
                    amountToBeSentPreviously = await basicPayments.sentPayments(sender.address);
                    paymentTx = await deposit(basicPayments.connect(sender), amountToBeSent);
                });
                it(`THEN the sender decreases its balance in ${amountToBeSentInEthers} ethers`, async function () {
                    return expect(paymentTx).to.changeEtherBalance(sender, amountToBeSent.mul(-1));
                });

                it(`THEN the contract increases its balance in ${amountToBeSentInEthers} ethers`, async function () {
                    return expect(paymentTx).to.changeEtherBalance(basicPayments, amountToBeSent);
                });

                it(`THEN the contract emits a DepositMade event`, async function () {
                    return expect(paymentTx).to.emit(basicPayments, "DepositMade").withArgs(sender.address, amountToBeSent);
                });

                it(`THEN the contract marks that the user has sent the funds`, async function () {
                    return expect(await basicPayments.sentPayments(sender.address)).to.be.eq(
                        amountToBeSentPreviously.add(amountToBeSent),
                    );
                });
            });
        };

        testPaymentReceiving("3");
        testPaymentReceiving("5");
        testPaymentReceiving("100");
        testPaymentReceiving("0.0001");

        describe(`WHEN a user sends a payment of 0 ethers`, function () {
            let paymentTx;
            let sender;
            const amountToBeSentInEthers = "0";
            const amountToBeSent = ethers.utils.parseEther(amountToBeSentInEthers);
            it(`THEN the tx fails`, async function () {
                const {sender: senderAddress} = await getNamedAccounts();
                sender = await ethers.getSigner(senderAddress);
                paymentTx = deposit(basicPayments.connect(sender), amountToBeSent);
                return expect(paymentTx).to.be.revertedWith("did not send any value");
            });
        });
    });
});

describe(`BasicPayments - Send payments to contract through receiveFallback`, function () {
    describe(`GIVEN the Smart Contract was deployed`, () => {
        const receiveFallback = (contractWithSigner, amountToBeSent) => {
            return contractWithSigner.signer.sendTransaction({
                to: contractWithSigner.address,
                value: BigNumber.from(amountToBeSent).toHexString(),
            });
        };
        let basicPayments;
        before(async function () {
            basicPayments = await loadFixture(fixtureDeployedBasicPayments);
        });
        const testPaymentReceiving = (amountToBeSentInEthers) => {
            describe(`WHEN a user sends a payment of 3 ethers`, function () {
                let paymentTx;
                let sender;
                let amountToBeSentPreviously;
                const amountToBeSent = ethers.utils.parseEther(amountToBeSentInEthers);
                before(async function () {
                    const {sender: senderAddress} = await getNamedAccounts();
                    sender = await ethers.getSigner(senderAddress);
                    amountToBeSentPreviously = await basicPayments.sentPayments(sender.address);
                    paymentTx = await receiveFallback(basicPayments.connect(sender), amountToBeSent);
                });
                it(`THEN the sender decreases its balance in ${amountToBeSentInEthers} ethers`, async function () {
                    return expect(paymentTx).to.changeEtherBalance(sender, amountToBeSent.mul(-1));
                });

                it(`THEN the contract increases its balance in ${amountToBeSentInEthers} ethers`, async function () {
                    return expect(paymentTx).to.changeEtherBalance(basicPayments, amountToBeSent);
                });

                it(`THEN the contract emits a DepositMade event`, async function () {
                    return expect(paymentTx).to.emit(basicPayments, "DepositMade").withArgs(sender.address, amountToBeSent);
                });

                it(`THEN the contract marks that the user has sent the funds`, async function () {
                    return expect(await basicPayments.sentPayments(sender.address)).to.be.eq(
                        amountToBeSentPreviously.add(amountToBeSent),
                    );
                });
            });
        };

        testPaymentReceiving("3");
        testPaymentReceiving("5");
        testPaymentReceiving("100");
        testPaymentReceiving("0.0001");

        describe(`WHEN a user sends a payment of 0 ethers`, function () {
            let paymentTx;
            let sender;
            const amountToBeSentInEthers = "0";
            const amountToBeSent = ethers.utils.parseEther(amountToBeSentInEthers);
            it(`THEN the tx fails`, async function () {
                const {sender: senderAddress} = await getNamedAccounts();
                sender = await ethers.getSigner(senderAddress);
                paymentTx = receiveFallback(basicPayments.connect(sender), amountToBeSent);
                return expect(paymentTx).to.be.revertedWith("did not send any value");
            });
        });
    });
});*/
