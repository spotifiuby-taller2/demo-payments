const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Wallets = database.define('wallets', {
    /*id: {                                         //se autocrea un id secuencial
        primaryKey: true,
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },*/

    address: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    },

    privateKey: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: {notEmpty: true},
        unique: true
    }

    /*creationDate :{               //ya tiene fecha de creacion y modificacion (createdAt - updatedAt)
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        validate: {notEmpty: true},
        unique: false
    }*/
});

module.exports = Wallets;