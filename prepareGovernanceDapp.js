const fs = require('fs');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const utils = require("./utils/utils");

main()

function main() {
	const pathToAddressesJSON = `${constants.pathToContractRepo}/${constants.addressesSourceFile}`;
	const addresses = JSON.parse(fs.readFileSync(pathToAddressesJSON));

	let moc = JSON.parse(fs.readFileSync(`${constants.mocKeysFolder}moc.key`, 'utf8'));

	const addition = `
		const local = { 
			"VOTING_TO_CHANGE_KEYS_ADDRESS": "${addresses.VOTING_TO_CHANGE_KEYS_ADDRESS}",
		    "VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS": "${addresses.VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS}",
		    "VOTING_TO_CHANGE_PROXY_ADDRESS": "${addresses.VOTING_TO_CHANGE_PROXY_ADDRESS}",
		    "BALLOTS_STORAGE_ADDRESS": "${addresses.BALLOTS_STORAGE_ADDRESS}",
		    "METADATA_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}",
		    "POA_ADDRESS": "${constants.poaNetworkConsensusContractAddress}",
		};
	`

	let dappAddresses = `${constants.pathToGovernanceDAppRepo}/src/contracts/addresses.js`;
	let addressesFromDapp = fs.readFileSync(dappAddresses, 'utf8');
	let lastImport = `import swal from 'sweetalert2';`;
	addressesFromDapp = addressesFromDapp.replace(lastImport, lastImport + addition)
	addressesFromDapp = addressesFromDapp.replace('SOKOL_ADDRESSES = contracts;', 'SOKOL_ADDRESSES = local;')

	fs.writeFileSync(dappAddresses, addressesFromDapp);

	console.log("Governance Repo is prepared");
}