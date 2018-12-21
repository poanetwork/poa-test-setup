const keythereum = require('keythereum');
const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

const generateKeysButton = by.By.xpath("//*[@id=\"root\"]/div/section/div/div[1]/button");

let miningKey = {};
let payoutKey = {};
let votingKey = {};

class Ceremony extends page.Page {

    constructor(driver,URL){
        super(driver);
        this.URL=URL;
    }

    open() {
        this.driver.get(this.URL);
    }

    clickButtonGenerateKeys() {
        super.clickWithWait(generateKeysButton);
    }

    async getMiningKey() {
        miningKey.address = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyMiningKey\"]")), 20000).getAttribute("data-clipboard-text");
        miningKey.password = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyMiningPass\"]")), 20000).getAttribute("data-clipboard-text");
        let keyObject = await this._getKeyObject("//*[@id=\"miningKeyDownload\"]");
        miningKey.privateKey = keythereum.recover(miningKey.password, keyObject).toString("hex");
        miningKey.keyObject = keyObject;
        return miningKey;
    }

    async getPayoutKey() {
        payoutKey.address = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyPayoutKey\"]")), 20000).getAttribute("data-clipboard-text");
        payoutKey.password = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyPayoutPass\"]")), 20000).getAttribute("data-clipboard-text");
        let keyObject = await this._getKeyObject("//*[@id=\"payoutKeyDownload\"]");
        payoutKey.privateKey = keythereum.recover(payoutKey.password, keyObject).toString("hex");
        payoutKey.keyObject = keyObject;
        return payoutKey;
    }

    async getVotingKey() {
        votingKey.address = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyVotingKey\"]")), 20000).getAttribute("data-clipboard-text");
        votingKey.password = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath("//*[@id=\"copyVotingPass\"]")), 20000).getAttribute("data-clipboard-text");
        let keyObject = await this._getKeyObject("//*[@id=\"votingKeyDownload\"]");
        votingKey.privateKey = keythereum.recover(votingKey.password, keyObject).toString("hex");
        votingKey.keyObject = keyObject;
        return votingKey;
    }

    async _getKeyObject(xpath) {
        let keyStoreRaw = await this.driver.wait(webdriver.until.elementLocated(by.By.xpath(xpath)), 20000).getAttribute("href");
        keyStoreRaw = decodeURIComponent(keyStoreRaw).substr("data:application/json;charset=utf-8,".length);
        let keyObject = JSON.parse(keyStoreRaw);
        return keyObject;
    }
}

module.exports.Ceremony = Ceremony;
