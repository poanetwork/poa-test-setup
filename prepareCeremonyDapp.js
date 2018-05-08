const fs = require('fs');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const utils = require("./utils/utils");

main()

function main() {
	const pathToAddressesJSON = `${constants.pathToContractRepo}/${constants.addressesSourceFile}`;
	const addresses = JSON.parse(fs.readFileSync(pathToAddressesJSON));

	const addition = `const local = { "KEYS_MANAGER_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}" };`

	let addressesFromDapp = fs.readFileSync(`${constants.pathToCeremonyDAppRepo}/src/addresses.js`, 'utf8');
	
	let lastImport = `import helpers from "./helpers";`;
	let lines = addressesFromDapp.split('\n');
	lines = lines.map((line) => {
		if (line.includes(lastImport)) {
			return lastImport + addition
		} else {
			return line
		}
	})
	addressesFromDapp = lines.join(`\n`);
	addressesFromDapp = addressesFromDapp.replace('resolve({addresses: json', 'resolve({addresses: local')

	fs.writeFileSync(`${constants.pathToCeremonyDAppRepo}/src/addresses.js`, addressesFromDapp);
	
	// Hardcode ABIs into helpers.js
	const pathToKeysManagerJSON = `${constants.contractsFolder}/KeysManager.json`;
	const keysManagerABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToKeysManagerJSON)).abi).replace(/,/g, ', ');
	
	const dappHelpers = `${constants.pathToCeremonyDAppRepo}/src/helpers.js`;
	let dappHelpersContent = fs.readFileSync(dappHelpers, 'utf8');
	const abiAddition = `
    if (contract == 'KeysManager') return ${keysManagerABI};`;
	
	const lastGetABI = `function getABI(branch, contract) {`;
	dappHelpersContent = dappHelpersContent.replace(lastGetABI, lastGetABI + abiAddition);
	fs.writeFileSync(dappHelpers, dappHelpersContent);

	console.log("Ceremony Repo is prepared");
}
