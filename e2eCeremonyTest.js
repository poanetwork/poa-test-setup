const fs = require('fs');
const utils = require("./utils/utils");
const Constants = require("./utils/constants");
const constants = Constants.constants;
const dir = require('node-dir');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');
require("chromedriver");

const metaMaskWallet = require('./MetaMaskWallet.js');
const MetaMaskWallet = metaMaskWallet.MetaMaskWallet;
const meta = require('./pages/MetaMask.js');
const buttonSubmit = require('./pages/MetaMask.js');
const ceremony = require('./pages/Ceremony.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const ceremonyURL = 'http://localhost:3000'

let args = process.argv.slice(2);
let validator_num = args[0];

main()

async function main() {
	let options = new chrome.Options();
    options.addExtensions('./MetaMask_v3.14.1.crx');
	options.addArguments('start-maximized');
    options.addArguments('disable-popup-blocking');
	let driver = new webdriver.Builder()
	.withCapabilities(options.toCapabilities())
	.build();

	var files = dir.files(constants.initialKeysFolder, {sync:true});

	var wallet = MetaMaskWallet.createMetaMaskWallet(files[1]);

	var metaMask = new meta.MetaMask(driver, wallet);
    var ceremonyPage = await new ceremony.Ceremony(driver,ceremonyURL);

	metaMask.open();
    metaMask.activate();

    metaMask.switchToAnotherPage();

    ceremonyPage.open();
    //ceremonyPage.clickButtonGenerateKeys();

    driver.sleep(2000);

    ceremonyPage.clickButtonGenerateKeys();

    driver.sleep(2000);

    metaMask.switchToAnotherPage();
    driver.sleep(2000);
    metaMask.refresh();
    driver.sleep(1000);
    if ( await metaMask.isElementPresent(buttonSubmit.buttonSubmit)) {
        metaMask.submitTransaction();
        ceremonyPage.switchToAnotherPage();

        await getKeys(ceremonyPage);
    }
}

async function getKeys(ceremonyPage) {
    let miningKey = await ceremonyPage.getMiningKey();
    let payoutKey = await ceremonyPage.getPayoutKey();
    let votingKey = await ceremonyPage.getVotingKey();
    
    fs.writeFileSync(`${constants.miningKeysFolder}/${miningKey.address}.key`, JSON.stringify(miningKey));
    fs.writeFileSync(`${constants.payoutKeysFolder}/${payoutKey.address}.key`, JSON.stringify(payoutKey));
    fs.writeFileSync(`${constants.votingKeysFolder}/${votingKey.address}.key`, JSON.stringify(votingKey));

    let validator_path = `${constants.nodeFolder}/parity_validator_${validator_num}`;

    if (!fs.existsSync(validator_path)) {
        fs.mkdirSync(validator_path);
    }

    if (!fs.existsSync(`${validator_path}/keys`)) {
        fs.mkdirSync(`${validator_path}/keys`);
    }
    
    if (!fs.existsSync(`${validator_path}/keys/Sokol`)) {
        fs.mkdirSync(`${validator_path}/keys/Sokol`);
    }

    fs.writeFileSync(`${validator_path}/keys/Sokol/${miningKey.address}`, JSON.stringify(miningKey.keyObject));
    fs.writeFileSync(`${validator_path}/node.pwd`, miningKey.password);
}