const rewire = require('rewire');
const sinon = require('sinon');
const assert = require('assert');
const WalletService = rewire('../src/services/WalletService');

describe('WalletService', function () {
    describe('newWallet - ok', function () {
        it('create a new wallet', async function () {
            const setBodyResponseMock = sinon.fake();
            const balanceMock = sinon.fake.returns(Promise.resolve(50));
            const createDbMock = sinon.fake.returns(Promise.resolve({
                id: "walletId1",
                address: "address1",
                privateKey: "privateKey1"
            }));
            const createWebMock = sinon.fake.returns(Promise.resolve({
                address: "address1",
                privateKey: "privateKey1"
            }));
            const revertRewire = WalletService.__set__({
                web3EthAccounts: {create: createWebMock},
                Wallets: {create: createDbMock},
                utils: {setBodyResponse: setBodyResponseMock},
                eth: {getBalance: balanceMock}
            });

            const req = {};
            const res = {};
            await WalletService.newWallet(req, res);
            assert(createDbMock.calledOnce);
            assert(createWebMock.calledOnce);
            assert(setBodyResponseMock.calledOnce);
            assert(setBodyResponseMock.calledWith({
                id: "walletId1",
                address: "address1",
                privateKey: "privateKey1"
            }, 200, res));
            revertRewire();
        });
    });

    describe('newWallet - Error in web3', function () {
        it('failed create a new wallet', async function () {
            const setErrorResponseMock = sinon.fake();
            const setBodyResponseMock = sinon.fake();
            const createWebMock = sinon.fake.returns(undefined);
            const revertRewire = WalletService.__set__({
                web3EthAccounts: {create: createWebMock},
                utils: {setErrorResponse: setErrorResponseMock, setBodyResponse: setBodyResponseMock},
            });
            const req = {};
            const res = {};
            await WalletService.newWallet(req, res);
            assert(createWebMock.calledOnce);
            assert(setBodyResponseMock.notCalled);
            assert(setErrorResponseMock.calledOnce);
            assert(setErrorResponseMock.calledWith("Error to try create wallet.", 500, res));
            revertRewire();
        });
    });

    describe('getWallet', function () {
        it('return saved wallet', async function () {
            const setBodyResponseMock = sinon.fake();
            const findOneMock = sinon.fake.returns(Promise.resolve({
                id: "walletId2",
                address: "address2",
                privateKey: "privateKey2",
                balance: "50"
            }));
            const revertRewire = WalletService.__set__({
                Wallets: {findOne: findOneMock},
                utils: {setBodyResponse: setBodyResponseMock},
            });

            const req = {params: {id: "walletId2"}};
            const res = {};

            await WalletService.getWalletData(req, res);

            assert(findOneMock.calledOnce);
            assert(setBodyResponseMock.calledOnce);
            assert(setBodyResponseMock.calledWith({
                id: "walletId2",
                address: "address2",
                privateKey: "privateKey2",
                balance: "50"
            }, 200, res));
            revertRewire();
        });
    });

    describe('getWallets', function () {
        it('return all saved wallet', async function () {
            const setBodyResponseMock = sinon.fake();
            const findAllMock = sinon.fake.returns(Promise.resolve([
                {
                    id: "walletId3",
                    address: "address3",
                    privateKey: "privateKey3"
                }, {
                    id: "walletId4",
                    address: "address4",
                    privateKey: "privateKey4"
                }
            ]));
            let revertRewire = WalletService.__set__({
                Wallets: {findAll: findAllMock},
                utils: {setBodyResponse: setBodyResponseMock}
            });

            const req = {};
            const res = {};

            await WalletService.getWalletsData(req, res);

            assert(findAllMock.calledOnce);
            assert(setBodyResponseMock.calledOnce);
            assert(setBodyResponseMock.calledWith([
                {
                    id: "walletId3",
                    address: "address3",
                    privateKey: "privateKey3"
                }, {
                    id: "walletId4",
                    address: "address4",
                    privateKey: "privateKey4"
                }
            ], 200, res));
            revertRewire();
        });
    });
});
