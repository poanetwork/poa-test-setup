const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

const newBallotButton = by.By.xpath("//*[@id=\"root\"]/section/header/div/div[1]/a[4]");
const keysBallotType = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[1]/div[1]/div[1]");
const addKeyType = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[2]/div[2]/div[1]/div[1]/div/label");
const miningKeyType = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[2]/div[2]/div[2]/div[1]/div/label");
const activeTab = by.By.xpath("//*[@id=\"root\"]/section/header/div/div[1]/a[2]")

//validator data
const fullNameInput = by.By.xpath("//*[@id=\"full-name\"]");
const addrInput = by.By.xpath("//*[@id=\"address\"]");
const stateInput = by.By.xpath("//*[@id=\"react-select-3--value\"]/div[1]");
const stateCaliforniaInput = by.By.xpath("//*[@id=\"react-select-3--option-5\"]");
const zipCodeInput = by.By.xpath("//*[@id=\"zip-code\"]");
const licenseIdInput = by.By.xpath("//*[@id=\"license-id\"]");
const licenseExpirationInput = by.By.xpath("//*[@id=\"license-expiration\"]");

//voting data
const descriptionInput = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[2]/div[1]/div/textarea");
const endTimeInput = by.By.xpath("//*[@id=\"datetime-local\"]");
const affectedKeyInput = by.By.xpath("//*[@id=\"key\"]");
const miningKeyInput = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[2]/div[4]/div/div[2]/div/div/div");
const newMiningKeyXpath = by.By.xpath("//*[@id=\"react-select-2--option-0\"]");

const addBallotButton = by.By.xpath("//*[@id=\"root\"]/section/div/section/form/div[2]/button");
const alertOKButton = by.By.xpath("/html/body/div[2]/div/div[10]/button[1]");
const yesButton = by.By.xpath("//*[@id=\"root\"]/section/div[2]/section/div[1]/div[2]/div[2]/button");
const finalizeButton = by.By.xpath("//*[@id=\"root\"]/section/div[2]/section/div[1]/div[4]/div[1]/button");
const yesButtonOnActivePage = by.By.xpath("//*[@id=\"root\"]/section/div[2]/section/div[1]/div[2]/div[2]/button");
const finalizeButtonOnActivePage = by.By.xpath("//*[@id=\"root\"]/section/div[2]/section/div[1]/div[4]/div[1]/button");

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
    super.clickWithWait(stateInput);
    this.driver.sleep(100);
    super.clickWithWait(stateCaliforniaInput);
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

  fillDescription(description) {
    super.fillWithWait(descriptionInput, description);
  }

  fillEndTime(endTime) {
    super.fillWithWait(endTimeInput, endTime);
  }

  fillAffectedKey(affectedKey) {
    super.fillWithWait(affectedKeyInput, affectedKey);
  }

  fillNewMiningKey() {
    super.clickWithWait(miningKeyInput);
    this.driver.sleep(100);
    super.clickWithWait(newMiningKeyXpath);
  }

  addBallot() {
    super.clickWithWait(addBallotButton);
  }

  clickAlertOKButton() {
    super.clickWithWait(alertOKButton);
  }

  vote() {
    super.clickWithWait(yesButton);
  }

  voteOnActivePage() {
    super.clickWithWait(yesButtonOnActivePage);
  }

  finalize() {
    super.clickWithWait(finalizeButton);
  }

  finalizeButtonOnActivePage() {
    super.clickWithWait(finalizeButtonOnActivePage);
  }

  clickActiveTab() {
    super.clickWithWait(activeTab);
  }
}

module.exports.Voting = Voting;
