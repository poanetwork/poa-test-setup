const fs = require('fs');
const Web3 = require('web3');
const { constants } = require('./utils/constants');

const { BN } = Web3.utils;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();

async function main() {
    const spec = JSON.parse(fs.readFileSync(`${constants.specFolder}/spec.json`));
    const emissionFundsAddress = JSON.parse(fs.readFileSync(`${constants.pathToContractRepo}/contracts.json`)).EMISSION_FUNDS_ADDRESS;
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const stepDurationMs = spec.engine.authorityRound.params.stepDuration * 1000;

    let blockNumber = Number(await web3.eth.getBlockNumber());

    while (blockNumber <= Number(spec.engine.authorityRound.params.blockRewardContractTransition) + 2) {
        console.log('Waiting for blockRewardContractTransition...');
        await timeout(stepDurationMs);
        blockNumber = Number(await web3.eth.getBlockNumber());
    }

    const prevBalance = new BN(await web3.eth.getBalance(emissionFundsAddress, blockNumber - 1));
    const balance = new BN(await web3.eth.getBalance(emissionFundsAddress, blockNumber));

    if (!balance.gt(prevBalance)) {
        throw Error('EmissionFunds contract balance hasn\'t been increased');
    }

    console.log('OK');
}
