const dir = require('node-dir');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const keythereum = require("keythereum");
const path = require('path');
const fs = require('fs');

main()

function main() {
	let initial_keys = {};
	dir.readFiles(constants.scriptsMocOutputFolder,
	    function(err, content, filepath, next) {
	    	let filename = path.basename(filepath)
	    	
	    	if (filename == '.gitkeep') {
	    		return next();
	    	}

	    	let key = path.parse(filename).name;
    		if (!initial_keys[key])
	    		initial_keys[key] = {};
	    	if (filename.includes(".json")) {
	    		let keyStore = content;
	    		initial_keys[key].keyStore = keyStore;
	    	} else if (filename.includes(".key")) {
	    		initial_keys[key].password = content
	    	}

	    	if (initial_keys[key].password && initial_keys[key].keyStore)
	    			initial_keys[key].privateKey = keythereum.recover(initial_keys[key].password, JSON.parse(initial_keys[key].keyStore)).toString('hex');
	        if (err) throw err;
	        next();
	    },
	    function(err, files){
	    	for (let initial_key in initial_keys) {
	    		let keyObj = {
	    			address: `0x${initial_key}`,
	    			privateKey: initial_keys[initial_key].privateKey
	    		}
	    		fs.writeFileSync(`${constants.initialKeysFolder}${keyObj.address}`, JSON.stringify(keyObj, null, 2));
	    	}
	    }
	);
}