const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

class Voting extends page.Page {
  constructor(driver,URL){
    super(driver);
    this.URL=URL;
  }

  open() {
    this.driver.get(this.URL);
  }
}

module.exports.Voting = Voting;