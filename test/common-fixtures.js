/*
const {deployments, ethers, getNamedAccounts, waffle} = require('hardhat');
const {loadFixture} = waffle;

async function fixtureDeployedBasicPayments() {
    await deployments.fixture();
    const {deployer} = await getNamedAccounts();
    return await ethers.getContract("BasicPayments", deployer);
}

function fixtureDepositMade(amountToBeSent) {
    return async function fixtureProjectCreated(_w, _p,) {
        const {deployer: deployerAddress, sender: senderAddress} = await getNamedAccounts();
        const deployer = await ethers.getSigner(deployerAddress);
        const sender = await ethers.getSigner(senderAddress);
        const basicPayments = await loadFixture(fixtureDeployedBasicPayments);
        const paymentTx = await basicPayments.deposit({value: amountToBeSent});
        return {
            paymentTx,
            basicPayments,
            deployer,
            sender,
        };
    };
}

module.exports = {
    fixtureDepositMade, fixtureDeployedBasicPayments
}
*/
