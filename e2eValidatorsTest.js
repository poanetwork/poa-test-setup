const fs = require('fs');
const utils = require("./utils/utils");
const Constants = require("./utils/constants");
const constants = Constants.constants;
const dir = require('node-dir');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome');
require("chromedriver");
let faker = require('faker/locale/en');

const metaMaskWallet = require('./MetaMaskWallet.js');
const MetaMaskWallet = metaMaskWallet.MetaMaskWallet;
const meta = require('./pages/MetaMask.js');
const buttonSubmit = require('./pages/MetaMask.js');
const validators = require('./pages/Validators.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const validatorsURL = 'http://localhost:3001'

const validatorMetaData = {
	full_name: faker.name.findName(),
	address: `${faker.address.streetAddress()} ${faker.address.streetName()} ${faker.address.city()}`,
	us_state: faker.address.state(),
	zip_code: faker.address.zipCode(),
	license_id: faker.date.future(),
	license_expiration: faker.random.alphaNumeric(),
};

main()

async function main() {

}