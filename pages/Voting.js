const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

const newBallotButton = by.By.xpath("//*[@id=\"root\"]/div/header/div/a[2]");
const keysBallotType = by.By.xpath("//*[@id=\"ballot-for-validators\"]");
const addKeyType = by.By.xpath("//*[@id=\"add-key\"]");
const miningKeyType = by.By.xpath("//*[@id=\"mining-key\"]");

const fullNameInput = by.By.xpath("//*[@id=\"full-name\"]");
const addrInput = by.By.xpath("//*[@id=\"address\"]");
const stateInput = by.By.xpath("//*[@id=\"us_state\"]");
const zipCodeInput = by.By.xpath("//*[@id=\"zip-code\"]");
const licenseIdInput = by.By.xpath("//*[@id=\"license-id\"]");
const licenseExpirationInput = by.By.xpath("//*[@id=\"license-expiration\"]");

class Voting extends page.Page {
  constructor(driver,URL){
    super(driver);
    this.URL=URL;
  }

  open() {
    this.driver.get(this.URL);
  }

  clickNewBallot() {
    super.clickWithWait(newBallotButton);
  }

  chooseKeysVotingType() {
    super.clickWithWait(keysBallotType);
  }

  chooseAddKeyVotingType() {
    super.clickWithWait(addKeyType);
  }

  chooseMiningKeyType() {
    super.clickWithWait(miningKeyType);
  }

  fillFullName(fullName) {
    super.fillWithWait(fullNameInput, fullName);
  }

  fillAddress(addr) {
    super.fillWithWait(addrInput, addr);
  }

  fillState(state) {
    super.fillWithWait(stateInput, state);
  }

  fillZipCode(zip_code) {
    super.fillWithWait(zipCodeInput, zip_code);
  }

  fillLicenseID(license_id) {
    super.fillWithWait(licenseIdInput, license_id);
  }

  fillLicenseExpiration(license_expiration) {
    super.fillWithWait(licenseExpirationInput, license_expiration);
  }
}

module.exports.Voting = Voting;