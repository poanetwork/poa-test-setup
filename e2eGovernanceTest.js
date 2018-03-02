const fs = require('fs');
const utils = require("./utils/utils");
const Constants = require("./utils/constants");
const constants = Constants.constants;
const dir = require('node-dir');
const path = require('path');
let faker = require('faker/locale/en');
let moment = require('moment');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');
require("chromedriver");

const metaMaskWallet = require('./MetaMaskWallet.js');
const MetaMaskWallet = metaMaskWallet.MetaMaskWallet;
const meta = require('./pages/MetaMask.js');
const buttonSubmit = require('./pages/MetaMask.js');
const voting = require('./pages/Voting.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const votingURL = 'http://localhost:3002'

let args = process.argv.slice(2);
let validator_num = args[0];

let files = dir.files(constants.votingKeysFolder, {sync:true});
files = files.filter((file) => {
	let isNotGitKeep = path.basename(file) !== path.basename(`${constants.votingKeysFolder}.gitkeep`);
	let isNotDsStore = path.basename(file) !== path.basename(`${constants.votingKeysFolder}.DS_Store`);
	return isNotGitKeep && isNotDsStore;
})
const votingKeyPath = files[validator_num - 1];

main()

async function main() {
	let options = new chrome.Options();
    options.addExtensions('./MetaMask_v3.14.1.crx');
	options.addArguments('start-maximized');
    options.addArguments('disable-popup-blocking');
	let driver = new webdriver.Builder()
	.withCapabilities(options.toCapabilities())
	.build();

	let wallet = MetaMaskWallet.createMetaMaskWallet(votingKeyPath);

	let metaMask = new meta.MetaMask(driver, wallet);
    let votingPage = await new voting.Voting(driver,votingURL);

    metaMask.open();
    metaMask.activate();

    metaMask.switchToAnotherPage();

    votingPage.open();

    /*driver.sleep(4000);

    votingPage.clickSetMetadataTab();

    driver.sleep(1000);

    let votingMetaData = generateVotingMetadata();

    driver.sleep(2000);

    votingPage.clickSetMetadataButton();

    driver.sleep(2000);

    metaMask.switchToAnotherPage();
    driver.sleep(3000);
    metaMask.refresh();
    driver.sleep(2000);
    let el = await metaMask.isElementPresent(buttonSubmit.buttonSubmit)
    if (el) {
        confirmTx(el)
    } else {
        console.log("Something went wrong. Let's try once more...")
        driver.sleep(2000);
        let el = await metaMask.isElementPresent(buttonSubmit.buttonSubmit)
        confirmTx(el)
    }

    async function confirmTx(el) {
        metaMask.submitTransaction();
        votingPage.switchToAnotherPage();

        driver.sleep(5000);

        let handles = await driver.getAllWindowHandles();
        for (let i = 0; i < handles.length; i++) {
            driver.switchTo().window(handles[i]);
            driver.close();
        }
    }*/
}

function generateBallotMetadata() {
	const ballotMetaData = {};

	return ballotMetaData;
}