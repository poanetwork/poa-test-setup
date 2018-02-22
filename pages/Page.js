const webdriver = require('selenium-webdriver'),
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox'),
by = require('selenium-webdriver/lib/by');
const key = require('selenium-webdriver').Key;
const Twait=20000;

console.log(module.filename);

class Page {
  constructor(driver){
    this.driver=driver;
    this.pageID;
    this.footer;
    this.header;
  }

  async isElementPresent(element) {
   var q;
   try {
     q = await this.driver.findElement(element).isDisplayed();
   } catch (err) {
     q = false;
   }

   return q;
  }


  clearField(element){
    let field = this.driver.wait(webdriver.until.elementLocated(element), Twait);
    const c=key.chord(key.CONTROL,"a");
    const action=this.driver.actions();
    action.click(field).perform();
    //action.click(field).perform();
    this.driver.sleep(500);
    action.sendKeys(c).perform();
    action.sendKeys(key.DELETE).perform();
    action.sendKeys(key.DELETE).perform();
  }

  clickWithWait(element) {
    let button = this.driver.wait(webdriver.until.elementLocated(element), Twait);
    button.click();
  }

  fillWithWait(element,k) {
    let field = this.driver.wait(webdriver.until.elementLocated(element), Twait);
    field.sendKeys(k);
  }
  
  refresh(){
    this.driver.navigate().refresh();
  }

  switchToAnotherPage(){
    let dr=this.driver;

    dr.getWindowHandle().then(function (mainWindowHandle) {

      dr.getAllWindowHandles().then(function (windowHandles) {

        windowHandles.forEach(function(handle){

          if(!(handle===mainWindowHandle))
          {
            dr.switchTo().window(handle);

          }
        });
      });
    });
  }
}
module.exports.Page=Page;