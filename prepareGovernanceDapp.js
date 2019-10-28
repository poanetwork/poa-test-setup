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
    "VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS": "${addresses.VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS}",
    "BALLOTS_STORAGE_ADDRESS": "${addresses.BALLOTS_STORAGE_ADDRESS}",
    "KEYS_MANAGER_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}",
    "METADATA_ADDRESS": "${addresses.METADATA_ADDRESS}",
    "PROXY_ADDRESS": "${addresses.PROXY_ADDRESS}",
    "POA_ADDRESS": "${constants.poaNetworkConsensusContractAddress}",
    "EMISSION_FUNDS_ADDRESS": "${addresses.EMISSION_FUNDS_ADDRESS}",
};
`

	let dappAddresses = `${constants.pathToGovernanceDAppRepo}/src/contracts/addresses.js`;
	let addressesFromDapp = fs.readFileSync(dappAddresses, 'utf8');
	let lastImport = `import { addressesURL, wrongRepoAlert } from './helpers'`;
	addressesFromDapp = addressesFromDapp.replace(lastImport, lastImport + addition)
	addressesFromDapp = addressesFromDapp.replace('ADDRESSES = contracts', 'ADDRESSES = local')

	fs.writeFileSync(dappAddresses, addressesFromDapp);
	
	// Hardcode ABIs into helpers.js
	const pathToKeysManagerJSON = `${constants.contractsFolder}/KeysManager.json`;
	const keysManagerABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToKeysManagerJSON)).abi).replace(/,/g, ', ');
	
	const pathToPoaNetworkConsensusJSON = `${constants.contractsFolder}/PoaNetworkConsensus.json`;
	const poaNetworkConsensusABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToPoaNetworkConsensusJSON)).abi).replace(/,/g, ', ');
	
	const pathToBallotsStorageJSON = `${constants.contractsFolder}/BallotsStorage.json`;
	const ballotsStorageABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToBallotsStorageJSON)).abi).replace(/,/g, ', ');

	const pathToEmissionFundsJSON = `${constants.contractsFolder}/EmissionFunds.json`;
	const emissionFundsABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToEmissionFundsJSON)).abi).replace(/,/g, ', ');

	const pathToProxyStorageJSON = `${constants.contractsFolder}/ProxyStorage.json`;
	const proxyStorageABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToProxyStorageJSON)).abi).replace(/,/g, ', ');
	
	const pathToValidatorMetadataJSON = `${constants.contractsFolder}/ValidatorMetadata.json`;
	const validatorMetadataABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToValidatorMetadataJSON)).abi).replace(/,/g, ', ');
	
	const pathToVotingToChangeKeysJSON = `${constants.contractsFolder}/VotingToChangeKeys.json`;
	const votingToChangeKeysABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToVotingToChangeKeysJSON)).abi).replace(/,/g, ', ');
	
	const pathToVotingToChangeMinThresholdJSON = `${constants.contractsFolder}/VotingToChangeMinThreshold.json`;
	const votingToChangeMinThresholdABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToVotingToChangeMinThresholdJSON)).abi).replace(/,/g, ', ');
	
	const pathToVotingToChangeProxyAddressJSON = `${constants.contractsFolder}/VotingToChangeProxyAddress.json`;
	const votingToChangeProxyAddressABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToVotingToChangeProxyAddressJSON)).abi).replace(/,/g, ', ');

	const pathToVotingToManageEmissionFundsJSON = `${constants.contractsFolder}/VotingToManageEmissionFunds.json`;
	const votingToManageEmissionFundsABI = JSON.stringify(JSON.parse(fs.readFileSync(pathToVotingToManageEmissionFundsJSON)).abi).replace(/,/g, ', ');

	const dappHelpers = `${constants.pathToGovernanceDAppRepo}/src/contracts/helpers.js`;
	let dappHelpersContent = fs.readFileSync(dappHelpers, 'utf8');
	const abiAddition = `
    if (contract === 'KeysManager') return ${keysManagerABI};
    else if (contract === 'PoaNetworkConsensus') return ${poaNetworkConsensusABI};
    else if (contract === 'BallotStorage') return ${ballotsStorageABI};
    else if (contract === 'EmissionFunds') return ${emissionFundsABI};
    else if (contract === 'ProxyStorage') return ${proxyStorageABI};
    else if (contract === 'ValidatorMetadata') return ${validatorMetadataABI};
    else if (contract === 'VotingToChangeKeys') return ${votingToChangeKeysABI};
    else if (contract === 'VotingToChangeMinThreshold') return ${votingToChangeMinThresholdABI};
    else if (contract === 'VotingToChangeProxyAddress') return ${votingToChangeProxyAddressABI};
    else if (contract === 'VotingToManageEmissionFunds') return ${votingToManageEmissionFundsABI};`;
	
	const lastGetABI = `function getABI(branch, contract) {`;
	dappHelpersContent = dappHelpersContent.replace(lastGetABI, lastGetABI + abiAddition);
	fs.writeFileSync(dappHelpers, dappHelpersContent);

	const dappGetWeb3 = `${constants.pathToGovernanceDAppRepo}/src/utils/getWeb3.js`;
	let dappGetWeb3Content = fs.readFileSync(dappGetWeb3, 'utf8');
	function replaceDefaultNetId(network) {
		return `const defaultNetId = helpers.netIdByBranch(constants.${network})`
	}
	dappGetWeb3Content = dappGetWeb3Content.replace(replaceDefaultNetId('CORE'), replaceDefaultNetId('SOKOL'));
	fs.writeFileSync(dappGetWeb3, dappGetWeb3Content);

	// Change some constants
	const dappConstants = `${constants.pathToGovernanceDAppRepo}/src/utils/constants.js`;
	let dappConstantsContent = fs.readFileSync(dappConstants, 'utf8');
	dappConstantsContent = dappConstantsContent.replace('constants.minBallotDurationInDays = 2', 'constants.minBallotDurationInDays = 0');
	dappConstantsContent = dappConstantsContent.replace('constants.startTimeOffsetInMinutes = 5', 'constants.startTimeOffsetInMinutes = 1');
	dappConstantsContent = dappConstantsContent.replace('constants.endTimeDefaultInMinutes = 2890', 'constants.endTimeDefaultInMinutes = 3');
	fs.writeFileSync(dappConstants, dappConstantsContent);

	console.log("Governance Repo is prepared");
}
