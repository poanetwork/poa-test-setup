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
			"METADATA_ADDRESS": "${addresses.METADATA_ADDRESS}",
			"KEYS_MANAGER_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}",
			"POA_ADDRESS": '${constants.poaNetworkConsensusContractAddress}',
			"MOC": '${moc.address}'
		};
	`

	let dappAddresses = `${constants.pathToValidatorsDAppRepo}/src/contracts/addresses.js`;
	let addressesFromDapp = fs.readFileSync(dappAddresses, 'utf8');
	let lastImport = `import messages from '../utils/messages'`;
	addressesFromDapp = addressesFromDapp.replace(lastImport, lastImport + addition)
	addressesFromDapp = addressesFromDapp.replace('resolve({ addresses: json', 'resolve({ addresses: local')

	fs.writeFileSync(dappAddresses, addressesFromDapp);
	
	// Hardcode ABIs into helpers.js
	const pathToKeysManagerJSON = `${constants.contractsFolder}/KeysManager.json`;
	const keysManagerABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToKeysManagerJSON)).abi).replace(/,/g, ', ');
	
	const pathToPoaNetworkConsensusJSON = `${constants.contractsFolder}/PoaNetworkConsensus.json`;
	const poaNetworkConsensusABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToPoaNetworkConsensusJSON)).abi).replace(/,/g, ', ');
	
	const pathToValidatorMetadataJSON = `${constants.contractsFolder}/ValidatorMetadata.json`;
	const validatorMetadataABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToValidatorMetadataJSON)).abi).replace(/,/g, ', ');
	
	const dappHelpers = `${constants.pathToValidatorsDAppRepo}/src/contracts/helpers.js`;
	let dappHelpersContent = fs.readFileSync(dappHelpers, 'utf8');
	const abiAddition = `
    if (contract === 'KeysManager') return ${keysManagerABI};
    else if (contract === 'PoaNetworkConsensus') return ${poaNetworkConsensusABI};
    else if (contract === 'ValidatorMetadata') return ${validatorMetadataABI};`;
	
	const lastGetABI = `function getABI(branch, contract) {`;
	dappHelpersContent = dappHelpersContent.replace(lastGetABI, lastGetABI + abiAddition);
	fs.writeFileSync(dappHelpers, dappHelpersContent);

	const dappGetWeb3 = `${constants.pathToValidatorsDAppRepo}/src/utils/getWeb3.js`;
	let dappGetWeb3Content = fs.readFileSync(dappGetWeb3, 'utf8');
	function replaceDefaultNetId(network) {
		return `const defaultNetId = helpers.netIdByName(constants.branches.${network})`
	}
	dappGetWeb3Content = dappGetWeb3Content.replace(replaceDefaultNetId('CORE'), replaceDefaultNetId('SOKOL'));
	fs.writeFileSync(dappGetWeb3, dappGetWeb3Content);

	// Fix Metadata.contract.js for using new ValidatorMetadata contract
	// in local Sokol Network (instead of live xDai Network)
	const metadataContractPath = `${constants.pathToValidatorsDAppRepo}/src/contracts/Metadata.contract.js`;
	let metadataContractText = fs.readFileSync(metadataContractPath, 'utf8');
	metadataContractText = metadataContractText.replace('if (helpersGlobal.isCompanyAllowed(this.netId)) {', 'if (true) {');
	fs.writeFileSync(metadataContractPath, metadataContractText);

	console.log("Validators Repo is prepared");
}
