const Constants = require("./utils/constants");
const constants = Constants.constants;
const fs = require('fs');
const keythereum = require("keythereum");
const generatePassword = require('password-generator');
const Web3 = require('web3');
const utils = require("./utils/utils");
const toml = require('toml');
const tomlJS = require('toml-js');

main()

async function main() {
	const consensusObj = JSON.parse(fs.readFileSync(constants.pathToConsensusContract));
	const consensusBytecode = consensusObj.bytecode;
	
	const mocPassword = generatePassword(20, false)
	const keyObject = await generateAddress(mocPassword)

	const moc = `0x${keyObject.address}`;
	const keyStoreFileName = `${constants.mocKeysFolder}${keyObject.address}.json`;
	const privateKeyFileName = `${constants.mocKeysFolder}moc.key`;
	const passwordFileName = `${constants.mocKeysFolder}moc.pwd`;
	const mocKeyStore = JSON.stringify(keyObject);

	const privateKey = keythereum.recover(mocPassword, keyObject).toString('hex');

	let spec
	try {
	 spec = await utils.getSpec('sokol');
	} catch (e) {
		return console.log(e.message)
	}

	delete spec.engine.authorityRound.params['blockRewardContractAddress'];
	delete spec.engine.authorityRound.params['blockRewardContractTransition'];
	delete spec.params['eip1283DisableTransition'];
	delete spec.params['eip1283ReenableTransition'];

	[
		'eip145Transition',
		'eip1014Transition',
		'eip1052Transition',
		'eip1283Transition',
		'eip1344Transition',
		'eip1706Transition',
		'eip1884Transition',
		'eip2028Transition'
	].forEach(param => {
		spec.params[param] = '0x0';
	});

	delete spec.nodes;

	const accounts = Object.keys(spec.accounts);
	for (let i = 0; i < accounts.length; i++) {
		const address = accounts[i];
		const addressTrimmed = leftTrimAddress(accounts[i]);
		if (addressTrimmed >= 1 && addressTrimmed <= 9) {
			const account = '0x' + addressTrimmed.padStart(40, '0')
			const accountObj = spec.accounts[address];
			delete spec.accounts[address];
			spec.accounts[account] = accountObj;
			spec.accounts[account].builtin['pricing'] = 
				fixSpecPricing(spec.accounts[account].builtin['pricing']);
		} else {
			delete spec.accounts[address];
		}
	}

	utils.clearFolder(constants.mocKeysFolder);

	let POAKeysFolder = `${constants.masterNodeKeysFolder}${spec.name}`;
	if (!fs.existsSync(POAKeysFolder)){
		fs.mkdirSync(POAKeysFolder);
	}
	utils.clearFolder(POAKeysFolder);
	try { await utils.saveToFile(keyStoreFileName, mocKeyStore) }
	catch (err) { return console.log(err.message); }
	console.log(`MoC keystore file ${moc} is generated to ${keyStoreFileName}`);

	const key = {
		address: moc,
		privateKey: privateKey
	}

	try { await utils.saveToFile(privateKeyFileName, JSON.stringify(key, null, 2)) }
	catch (err) { return console.log(err.message); }
	console.log(`MoC private key is generated to ${privateKeyFileName}`);


	try { await utils.saveToFile(passwordFileName, mocPassword) }
	catch (err) { return console.log(err.message); }
	console.log(`MoC password is generated to ${passwordFileName}`);

	utils.clearFolder(constants.masterNodeKeysFolder);
	const masterNodeKeyStoreFolder = `${constants.masterNodeKeysFolder}${spec.name}`;
	fs.existsSync(masterNodeKeyStoreFolder) || fs.mkdirSync(masterNodeKeyStoreFolder);
	const masterNodeParentKeyStorePath = `${masterNodeKeyStoreFolder}/moc_${moc}.json`;
	try { await utils.saveToFile(masterNodeParentKeyStorePath, mocKeyStore) }
	catch (err) { return console.log(err.message); }
	console.log(`Keystore file is copied to ${masterNodeParentKeyStorePath}`);

	web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'));
	const mocABIEncoded = web3.eth.abi.encodeParameters(['address', `address[]`], [moc, []]).substr(2);
	const newConsensusBytecode = consensusBytecode + mocABIEncoded;

	spec.accounts[moc] = {
		balance: '252460800000000000000000000'
	};

	spec.accounts[constants.poaNetworkConsensusContractAddress] = {
		balance: '1',
        constructor: newConsensusBytecode
	};
	spec.engine.authorityRound.params.validators.multi = {
		"0": {
        	"safeContract": constants.poaNetworkConsensusContractAddress
        }
	};
	
	utils.clearFolder(constants.specFolder);
	try { await utils.saveToFile(`${constants.specFolder}spec.json`, JSON.stringify(spec, null, 2)) }
	catch (err) { return console.log(err.message); }

	console.log(`spec.json is generated to ${constants.specFolder}`);

	const masterNodeExampleTomlPath = `${constants.nodeFolder}node-master.toml`;
	const masterNodeTomlContent = fs.readFileSync(masterNodeExampleTomlPath, "utf8");
	const masterNodeToml = toml.parse(masterNodeTomlContent);

	masterNodeToml.account.unlock = [moc];
	masterNodeToml.mining.engine_signer = moc;
	const newToml = tomlJS.dump(masterNodeToml);

	utils.removeFolderRecursive(`${constants.masterNodeFolder}cache`);
	utils.removeFolderRecursive(`${constants.masterNodeFolder}chains`);
	utils.removeFolderRecursive(`${constants.masterNodeFolder}dapps`);
	utils.removeFolderRecursive(`${constants.masterNodeFolder}network`);

	const mocTomlPath = `${constants.masterNodeFolder}moc.toml`;
	try { await utils.saveToFile(`${mocTomlPath}`, newToml)}
	catch (err) { return console.log(err.message); }

	console.log("MoC node is prepared");
}

function fixSpecPricing(pricing) {
	const keys = Object.keys(pricing);
	const lastKey = keys[keys.length - 1];
	delete pricing[lastKey]['info'];
	return { "0" : pricing[lastKey] };
}

function leftTrimAddress(address) {
	return address.replace(/^[0|x]+/, '');
}

//generates initial key keystore file
function generateAddress(password) {
	return new Promise((resolve, reject) => {
		let params = { keyBytes: 32, ivBytes: 16 };

	  	let dk = keythereum.create(params);

	  	keythereum.create(params, function (dk) {
		    let options = {};
		    keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
		    	resolve(keyObject);
		    });
	  	});
	})
}
