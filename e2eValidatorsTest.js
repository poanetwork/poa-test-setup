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
const validators = require('./pages/Validators.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const validatorsURL = 'http://localhost:3001'

let args = process.argv.slice(2);
let validator_num = args[0];

let files = dir.files(constants.votingKeysFolder, {sync:true});
files = files.filter((file) => {
	let isNotGitKeep = path.basename(file) !== path.basename(`${constants.votingKeysFolder}.gitkeep`);
	let isNotDsStore = path.basename(file) !== path.basename(`${constants.votingKeysFolder}.DS_Store`);
	return isNotGitKeep && isNotDsStore;
})
const votingKeyPath = files[validator_num - 1];

let votingKeyContent = fs.readFileSync(votingKeyPath, 'utf8');
let votingKey;
try {
	votingKey = JSON.parse(votingKeyContent);
} catch(e) {
	console.log(e.message);
}

//console.log(votingKey)

main()

async function main() {
	let validatorMetaData = generateValidatorMetadata();

	let options = new chrome.Options();
    options.addExtensions('./MetaMask_v3.14.1.crx');
	options.addArguments('start-maximized');
    options.addArguments('disable-popup-blocking');
	let driver = new webdriver.Builder()
	.withCapabilities(options.toCapabilities())
	.build();

	let wallet = MetaMaskWallet.createMetaMaskWallet(votingKeyPath);

	let metaMask = new meta.MetaMask(driver, wallet);
    let validatorsPage = await new validators.Validators(driver,validatorsURL);

    metaMask.open();
    metaMask.activate();

    driver.sleep(4000);

    metaMask.switchToAnotherPage();

    driver.sleep(4000);

    validatorsPage.open();

    driver.sleep(4000);

    validatorsPage.clickSetMetadataTab();

    driver.sleep(1000);

    validatorsPage.fillFirstName(validatorMetaData.first_name);
    validatorsPage.fillLastName(validatorMetaData.last_name);
    validatorsPage.fillAddress(validatorMetaData.address);
    validatorsPage.fillState(validatorMetaData.us_state);
    validatorsPage.fillZipCode(validatorMetaData.zip_code);
    validatorsPage.fillLicenseID(validatorMetaData.license_id);
    validatorsPage.fillLicenseExpiration(validatorMetaData.license_expiration);

    driver.sleep(2000);

    /*let isPageAtindex = await validatorsPage.isPageAtIndex(2);

    if (isPageAtindex) {
    	validatorsPage.switchToAnotherPageByIndex(1);
    	//driver.close();
    	driver.sleep(3000);
    	//validatorsPage.switchToAnotherPageByIndex(1);
    }*/

    validatorsPage.switchToAnotherPageByIndex(1);

    driver.sleep(2000);

    validatorsPage.clickSetMetadataButton();

    //driver.sleep(2000);

    /*metaMask.switchToAnotherPage();
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
        validatorsPage.switchToAnotherPage();

        driver.sleep(5000);

        let handles = await driver.getAllWindowHandles();
        for (let i = 0; i < handles.length; i++) {
            driver.switchTo().window(handles[i]);
            driver.close();
        }
    }*/
}

function generateValidatorMetadata() {
	let license_expiration = moment(new Date(faker.date.future())).format('DD/MM/YYYY');
	const validatorMetaData = {
		first_name: faker.name.firstName(),
		last_name: faker.name.lastName(),
		address: `${faker.address.streetAddress()} ${faker.address.streetName()} ${faker.address.city()}`,
		us_state: faker.address.state(),
		zip_code: faker.address.zipCode().split('-')[0],
		license_id: faker.random.alphaNumeric(10),
		license_expiration: license_expiration
	};

	return validatorMetaData;
}