const fs = require('fs');
const utils = require("./utils/utils");
const Constants = require("./utils/constants");
const constants = Constants.constants;
const dir = require('node-dir');
const path = require('path');
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
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

let files = dir.files(constants.initialKeysFolder, {sync:true});
files = files.filter((file) => {
    let isNotGitKeep = path.basename(file) !== path.basename(`${constants.initialKeysFolder}.gitkeep`);
    let isNotDsStore = path.basename(file) !== path.basename(`${constants.initialKeysFolder}.DS_Store`);
    return isNotGitKeep && isNotDsStore;
})
let initialKeyPath = files[0];

let initialKeyContent = fs.readFileSync(initialKeyPath, "utf8");
let initialKey
let initialKeyPrivateKeyHex
try {
    let initialKeyObj = JSON.parse(initialKeyContent);
    initialKey = initialKeyObj.address;
    initialKeyPrivateKeyHex = initialKeyObj.privateKey;
} catch(e) {
    console.log(e.message);
}
//initialKey = `0x${initialKey}`;

main()

async function main() {
	let options = new chrome.Options();
    options.addExtensions('./MetaMask_v3.14.1.crx');
	options.addArguments('start-maximized');
    options.addArguments('disable-popup-blocking');
	let driver = new webdriver.Builder()
	.withCapabilities(options.toCapabilities())
	.build();

	let wallet = MetaMaskWallet.createMetaMaskWallet(initialKeyPath);

	let metaMask = new meta.MetaMask(driver, wallet);
    let ceremonyPage = await new ceremony.Ceremony(driver,ceremonyURL);

	metaMask.open();
    metaMask.activate();

    metaMask.switchToAnotherPage();

    ceremonyPage.open();
    
    driver.sleep(4000);

    ceremonyPage.clickButtonGenerateKeys();

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
        ceremonyPage.switchToAnotherPage();

        driver.sleep(7000);

        let votingKey = await getKeys(ceremonyPage);
        console.log("Productions keys are saved")
        await transferETHToVotingKey(initialKey, votingKey);
        console.log("ETH was transfered from initial key to voting key");

        driver.sleep(5000);

        let handles = await driver.getAllWindowHandles();
        for (let i = 0; i < handles.length; i++) {
            driver.switchTo().window(handles[i]);
            driver.close();
        }
    }
}

async function getKeys(ceremonyPage) {
    console.log("Productions keys saving...")
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

    fs.unlinkSync(initialKeyPath);

    await fs.readdir(constants.scriptsMocOutputFolder, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if (file != '.gitkeep' && file != '.DS_Store') {
                fs.unlinkSync(path.join(constants.scriptsMocOutputFolder, file));
            }
        }
    });

    return votingKey.address;
}

async function transferETHToVotingKey(initialKey, votingKey) {
    console.log("initialKey:", initialKey);
    console.log("votingKey:", votingKey);
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    
    var nonce = await web3.eth.getTransactionCount(initialKey);
    var nonceHex = web3.utils.toHex(nonce);

    var BN = web3.utils.BN;
    var ethToSend = web3.utils.toWei(new BN(90), "milliether");

    const rawTx = {
      nonce: nonceHex,
      gasPrice: 21000,
      gasLimit: 100000,
      to: votingKey, 
      value: ethToSend,
      data: '0x0',
      chainId: web3.utils.toHex(web3.version.network)
    };

    const initialKeyPrivateKeyBuf = Buffer.from(initialKeyPrivateKeyHex, 'hex')
    
    var tx = new EthereumTx(rawTx);
    tx.sign(initialKeyPrivateKeyBuf);

    var serializedTx = tx.serialize();

    let receipt;
    try { receipt = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex')) }
    catch (err) { return console.log(err.message); }
}