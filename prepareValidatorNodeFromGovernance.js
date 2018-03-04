const Constants = require("./utils/constants");
const constants = Constants.constants;
const fs = require('fs');
const generatePassword = require('password-generator');
const utils = require("./utils/utils");
const toml = require('toml');
const tomlJS = require('toml-js');
const dir = require('node-dir');
const path = require('path');

let args = process.argv.slice(2);
let validator_num = args[0];

main()

async function main() {
	let mocEnodeURL;
	try {
		mocEnodeURL = await getMocEnodeURL();
	} catch(e) {
		console.log(e.message);
	}

	fs.writeFileSync(`${constants.nodeFolder}reserved_peers`, mocEnodeURL);
	
	let validatorNodeFolder = `${constants.nodeFolder}parity_validator_${validator_num}/`;
	let keysFolder = `${validatorNodeFolder}keys/Sokol`;
	
	let validatorKeyPath
	let files = dir.files(keysFolder, {sync: true});
	let countKeys = 0;
	for (let i = 0; i < files.length; i++) {
		let filePath = files[i]
		let filename = path.basename(filePath)
		if (filename != ".gitkeep" && filename != ".DS_Store") {
			countKeys++;
		}
		if (countKeys == validator_num) {
			validatorKeyPath = filePath;
			break;
		}
	}

	let content = fs.readFileSync(validatorKeyPath, "utf8");
	
	let validator
	try {
		validator = JSON.parse(content).address;
	} catch(e) {
		console.log(e.message);
	}
	validator = `0x${validator}`;

	const validatorNodeExampleTomlPath = `${constants.nodeFolder}node-slave.toml`;
	let validatorNodeTomlContent = fs.readFileSync(validatorNodeExampleTomlPath, "utf8");
	let validatorNodeToml = toml.parse(validatorNodeTomlContent);

	validatorNodeToml.account.unlock = [validator];
	validatorNodeToml.account.password = [`./nodes/parity_validator_${validator_num}/node.pwd`];
	validatorNodeToml.network.port = validatorNodeToml.network.port + (validator_num - 1);
	validatorNodeToml.rpc.port = validatorNodeToml.rpc.port + (validator_num - 1);
	validatorNodeToml.websockets.port = validatorNodeToml.websockets.port + (validator_num - 1);
	validatorNodeToml.mining.engine_signer = validator;
	validatorNodeToml.parity.base_path = `./nodes/parity_validator_${validator_num}/`;
	const newToml = tomlJS.dump(validatorNodeToml);

	utils.removeFolderRecursive(`${validatorNodeFolder}cache`);
	utils.removeFolderRecursive(`${validatorNodeFolder}chains`);
	utils.removeFolderRecursive(`${validatorNodeFolder}dapps`);
	utils.removeFolderRecursive(`${validatorNodeFolder}network`);

	const validatorTomlPath = `${validatorNodeFolder}node.toml`;
	try { await utils.saveToFile(`${validatorTomlPath}`, newToml)}
	catch (err) { return console.log(err.message); }

	console.log(`Validator ${validator_num} node is prepared`);
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