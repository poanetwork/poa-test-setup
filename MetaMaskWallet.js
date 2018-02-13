const fs = require('fs');

class MetaMaskWallet {

    constructor() {
        this.privateKey;
        this.account;
        this.networkID;
    }

    static createMetaMaskWallet(fileName) {
        var c=new MetaMaskWallet();
        //by default
        //c.account="0xF16AB2EA0a7F7B28C267cbA3Ed211Ea5c6e27411";
       // c.privateKey="03c06a9fab22fe0add145e337c5a8251e140f74468d72eab17ec7419ab812cd0";
       // c.networkID=4;//1-main network by default
        c.parser(fileName);

        return c;
    }

    parser(fileName) {
        var obj=JSON.parse(fs.readFileSync(fileName,"utf8"));
        this.account=obj.account;
        this.privateKey=obj.privateKey;
        this.networkID=obj.networkID;
    }

    print() {
        console.log("account:"+this.account);
        console.log("privateKey:"+this.privateKey);
        console.log("networkID:"+this.networkID);
    }

}
module.exports={
    MetaMaskWallet:MetaMaskWallet
}