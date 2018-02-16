const Constants = require("./utils/constants");
const constants = Constants.constants;
const fs = require('fs');
const keythereum = require("keythereum");
const generatePassword = require('password-generator');
const Web3 = require('web3');
const utils = require("./utils/utils");
const toml = require('toml');
const tomlJS = require('toml-js');
const dir = require('node-dir');

main()

async function main() {
	let mocEnodeURL;
	try {
		mocEnodeURL = await getMocEnodeURL();
	} catch(e) {
		console.log(e.message);
	}

	fs.writeFileSync(`${constants.nodeFolder}reserved_peers`, mocEnodeURL);
	
	let keysFolder = `${constants.nodeFolder}parity_validator_1/keys/Sokol`;
	let files = dir.files(keysFolder, {sync: true});
	let content = fs.readFileSync(files[0], "utf8");
	let validator
	try {
		validator = JSON.parse(content).address;
	} catch(e) {
		console.log(e.message);
	}
	validator = `0x${validator}`;

	const validatorNodeExampleTomlPath = `${constants.nodeFolder}node-slave.toml`;
	const validatorNodeTomlContent = fs.readFileSync(validatorNodeExampleTomlPath, "utf8");
	const validatorNodeToml = toml.parse(validatorNodeTomlContent);

	validatorNodeToml.account.unlock = [validator];
	validatorNodeToml.mining.engine_signer = validator;
	const newToml = tomlJS.dump(validatorNodeToml);

	utils.removeFolderRecursive(`${constants.validator1NodeFolder}cache`);
	utils.removeFolderRecursive(`${constants.validator1NodeFolder}chains`);
	utils.removeFolderRecursive(`${constants.validator1NodeFolder}dapps`);
	utils.removeFolderRecursive(`${constants.validator1NodeFolder}network`);

	const validator1TomlPath = `${constants.validator1NodeFolder}node.toml`;
	try { await utils.saveToFile(`${validator1TomlPath}`, newToml)}
	catch (err) { return console.log(err.message); }

	console.log("Validator 1 node is prepared");
}

function getMocEnodeURL() {
	return new Promise((resolve, reject) => {
		var exec = require('child_process').exec;
		const cmd = `curl --data '{"method":"parity_enode","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 2>/dev/null`;
		exec(cmd, function (error, stdout, stderr) {
			if (error !== null) {
		    	reject(error);
		    }
		    let resp
		    try {
		    	resp = JSON.parse(stdout);
		    } catch(e) {
		    	reject(e);
		    }
		    resolve(resp.result); 
	    });
	})
}