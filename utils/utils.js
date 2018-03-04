const keythereum = require("keythereum");
const Constants = require("./constants");
const constants = Constants.constants;
const fetch = require('node-fetch');
const fs = require('fs');

function ABIURL(branch, contract) {
    const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.chainSpecRepoName}/${branch}/abis/${constants.ABIsSources[contract]}`;
    return URL;
}

function specURL(branch) {
    const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.chainSpecRepoName}/${branch}/spec.json`;
    return URL;
}

function getABI(branch, contract) {
    let addr = ABIURL(branch, contract);
    return fetch(addr).then(function(response) {
        return response.json();
    })
}

function getSpec(branch) {
    let addr = specURL(branch);
    return fetch(addr).then(function(response) {
        return response.json();
    })
}

let clearFolder = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (!fs.lstatSync(curPath).isDirectory()) {
      	if (file != '.gitkeep') {
      		fs.unlinkSync(curPath);
      	}
      }
    });
  }
};

let removeFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        removeFolderRecursive(curPath);
      } else { // delete file
      	if (file != '.gitkeep') {
        	fs.unlinkSync(curPath);
    	  }
      }
    });
    fs.rmdirSync(path);
  }
};

function saveToFile(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function generateAddress(password) {
  return new Promise((resolve, reject) => {
    let params = { keyBytes: 32, ivBytes: 16 };

      keythereum.create(params, function (dk) {
        let options = {};
        keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
          resolve(keyObject);
        });
      });
  })
}

module.exports = {
	getSpec,
	getABI,
	clearFolder,
	removeFolderRecursive,
  saveToFile,
  generateAddress
}