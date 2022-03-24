const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const queryInterface = database.getQueryInterface();

async function runMigrations() {

    await queryInterface.addColumn('wallets',
        'user', {
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
