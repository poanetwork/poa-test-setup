const fs = require('fs');
const Web3 = require('web3');
const Constants = require('./utils/constants');
const constants = Constants.constants;
const utils = require('./utils/utils');

main();

async function main() {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const currentBlock = await web3.eth.getBlockNumber();
    const specPath = `${constants.specFolder}spec.json`;
    const spec = JSON.parse(fs.readFileSync(specPath));
    const addresses = JSON.parse(fs.readFileSync(`${constants.pathToContractRepo}/contracts.json`));
    spec.engine.authorityRound.params['blockRewardContractAddress'] = addresses.REWARD_BY_BLOCK_ADDRESS;
    spec.engine.authorityRound.params['blockRewardContractTransition'] = currentBlock + 5;
    try {
        await utils.saveToFile(specPath, JSON.stringify(spec, null, 2));
    } catch (err) {
        return console.log(err.message);
    }
}

