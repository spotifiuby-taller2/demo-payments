const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Wallets = database.define('wallets', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    creationDate :{
        type: Sequelize.DATE,
        allowNull: false,
        validate: {notEmpty: true},
        unique: false
    }
});

module.exports = Wallets;