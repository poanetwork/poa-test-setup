const fs = require('fs');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const utils = require("./utils/utils");

main()

function main() {
	const pathToAddressesJSON = `${constants.pathToContractRepo}/${constants.addressesSourceFile}`;
	const addresses = JSON.parse(fs.readFileSync(pathToAddressesJSON));

	const addition = `
		const local = { 
			"METADATA_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}",
			"KEYS_MANAGER_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}",
			"POA_ADDRESS": '',
			"MOC": ''
		};
	`

	let dappAddresses = `${constants.pathToValidatorsDAppRepo}/src/contracts/addresses.js`;
	let addressesFromDapp = fs.readFileSync(dappAddresses, 'utf8');
	let lastImport = `import helpers from "./helpers"`;
	addressesFromDapp = addressesFromDapp.replace(lastImport, lastImport + addition)
	addressesFromDapp = addressesFromDapp.replace('resolve({addresses: json', 'resolve({addresses: local')

	fs.writeFileSync(dappAddresses, addressesFromDapp);

	console.log("Validators Dapp is prepared");
}