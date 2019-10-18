const fs = require('fs');
const Web3 = require('web3');
const Constants = require('./utils/constants');
const constants = Constants.constants;

main();

async function main() {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const addresses = JSON.parse(fs.readFileSync(`${constants.pathToContractRepo}/contracts.json`));
    const balance = await web3.eth.getBalance(addresses.EMISSION_FUNDS_ADDRESS);
    if (balance === 0) {
        throw Error('Zero balance');
    }
    console.log('1');
}

