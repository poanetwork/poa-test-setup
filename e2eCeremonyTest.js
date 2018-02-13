const utils = require("./utils/utils");
const downloadRepo = require("./utils/downloadRepo");
const Constants = require("./utils/constants");
const constants = Constants.constants;
const dir = require('node-dir');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');
require("chromedriver");

const metaMaskWallet=require('./MetaMaskWallet.js');
const MetaMaskWallet=metaMaskWallet.MetaMaskWallet;
const meta=require('./pages/MetaMask.js');
const buttonSubmit=require('./pages/MetaMask.js');
const ceremony=require('./pages/Ceremony.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const ceremonyURL = 'http://localhost:3000'

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

    ceremonyPage.open();
    //ceremonyPage.clickButtonGenerateKeys();

    driver.sleep(2000);

    ceremonyPage.clickButtonGenerateKeys();

    driver.sleep(2000);

    metaMask.switchToAnotherPage();
    driver.sleep(2000);
    if ( await metaMask.isElementPresent(buttonSubmit.buttonSubmit)) {
        metaMask.submitTransaction();
        ceremonyPage.switchToAnotherPage();
    }
}