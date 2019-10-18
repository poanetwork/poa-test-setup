const fs = require('fs');
const Web3 = require('web3');
const { constants } = require('./utils/constants');

const { BN } = Web3.utils;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();

async function main() {
    const addresses = JSON.parse(fs.readFileSync(`${constants.pathToContractRepo}/contracts.json`));
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    async function getBalance() {
        const data = await web3.eth.getBalance(addresses.EMISSION_FUNDS_ADDRESS);
        return new BN(data);
    }

    const balance = await getBalance();
    if (!balance.gt(new BN(0))) {
        throw Error('Zero balance');
    }

    const blockNumber = await web3.eth.getBlockNumber();
    async function waitForNewBlock() {
        await timeout(5000);
        const currentBlockNumber = await web3.eth.getBlockNumber();
        if (currentBlockNumber > blockNumber) {
            const newBalance = await getBalance();
            if (!newBalance.gt(balance)) {
                throw Error('The balance has not changed');
            }
            return;
        }
        await waitForNewBlock();
    }
    await waitForNewBlock();

    console.log('1');
}
