
const page=require('./Page.js');
const webdriver = require('selenium-webdriver'),
      chrome = require('selenium-webdriver/chrome'),
      firefox = require('selenium-webdriver/firefox'),
      by = require('selenium-webdriver/lib/by');

const generateKeysButton = by.By.xpath("//*[@id=\"root\"]/div/section/div/div");

class Ceremony extends page.Page{

    constructor(driver,URL){
        super(driver);
        this.URL=URL;

    }

    open() {
        this.driver.get(this.URL);
    }

    clickButtonGenerateKeys(){
        super.clickWithWait(generateKeysButton);
    }

    open() {
        this.driver.get(this.URL);
    }
}
module.exports.Ceremony=Ceremony;
