const fs = require('fs');

class MetaMaskWallet {

    constructor() {
        this.privateKey;
        this.account;
        this.networkID;
    }

    static createMetaMaskWallet(fileName) {
        var c=new MetaMaskWallet();
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