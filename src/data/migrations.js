const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const queryInterface = database.getQueryInterface();

async function runMigrations() {

    await queryInterface.addColumn('wallet',
        'address', {
            type: Sequelize.STRING(constants.MAX_STR_LEN),
            allowNull: false,
            validate: {notEmpty: true},
            unique: true
        })
        .catch(error => {
            console.log(error.toString());
        });

    await queryInterface.addColumn('wallet',
        'privateKey', {
            type: Sequelize.STRING(constants.MAX_STR_LEN),
            allowNull: false,
            validate: {notEmpty: true},
            unique: true
        })
        .catch(error => {
            console.log(error.toString());
        });

    await queryInterface.addColumn('wallet',
        'balance', {
            type: Sequelize.STRING(constants.MAX_STR_LEN),
            allowNull: false,
            validate: {notEmpty: true},
            unique: false
        })
        .catch(error => {
            console.log(error.toString());
        });
}

module.exports = {
    runMigrations
}
