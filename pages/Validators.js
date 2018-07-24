const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

const setMetadataTab = by.By.xpath("//*[@id=\"header\"]/div/div[1]/a[2]");
const setMetadataButton = by.By.xpath("//*[@id=\"root\"]/section/div/div/div[2]/button");
const firstNameInput = by.By.xpath("//*[@id=\"firstName\"]");
const lastNameInput = by.By.xpath("//*[@id=\"lastName\"]");
const addrInput = by.By.xpath("//*[@id=\"address\"]");
const stateInput = by.By.xpath("//*[@id=\"us_state\"]");
const zipCodeInput = by.By.xpath("//*[@id=\"postal_code\"]");
const licenseIdInput = by.By.xpath("//*[@id=\"licenseId\"]");
const licenseExpirationInput = by.By.xpath("//*[@id=\"expirationDate\"]");

class Validators extends page.Page {
  constructor(driver,URL){
    super(driver);
    this.URL=URL;
  }

  open() {
    this.driver.get(this.URL);
  }

  clickSetMetadataTab() {
    super.clickWithWait(setMetadataTab);
  }

  clickSetMetadataButton() {
    super.clickWithWait(setMetadataButton);
  }

  fillFirstName(firstName) {
    super.fillWithWait(firstNameInput, firstName);
  }

  fillLastName(lastName) {
    super.fillWithWait(lastNameInput, lastName);
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

module.exports.Validators = Validators;