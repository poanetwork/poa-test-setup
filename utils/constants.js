let constants = {};
constants.organization = 'poanetwork';
constants.chainSpecRepoName = 'poa-chain-spec';
constants.contractsRepoName = 'poa-network-consensus-contracts';
constants.pathToContractRepo = `./submodules/${constants.contractsRepoName}`;
constants.scriptsMocRepoName = 'poa-scripts-moc';
constants.pathToScriptsMocRepo = `./submodules/${constants.scriptsMocRepoName}`;
constants.CeremonyDAppRepoName = 'poa-dapps-keys-generation';
constants.ValidatorsDAppRepoName = 'poa-dapps-validators';
constants.GovernanceDAppRepoName = 'poa-dapps-voting';
constants.pathToCeremonyDAppRepo = `./node_modules/${constants.CeremonyDAppRepoName}`;
constants.pathToValidatorsDAppRepo = `./node_modules/${constants.ValidatorsDAppRepoName}`;
constants.pathToGovernanceDAppRepo = `./node_modules/${constants.GovernanceDAppRepoName}`;
constants.scriptsMocConfigPath = `${constants.pathToScriptsMocRepo}/config.json`;
constants.scriptsMocOutputFolder = `${constants.pathToScriptsMocRepo}/generateInitialKey/output`;
constants.addressesSourceFile = 'contracts.json';
constants.contractsFolder = `${constants.pathToContractRepo}/build/contracts`;
constants.pathToConsensusContract = `${constants.contractsFolder}/PoaNetworkConsensus.json`;
constants.pathToKeysManagerContract = `${constants.contractsFolder}/KeysManager.json`;
constants.keysFolder = `./keys/`;
constants.nodeFolder = `./nodes/`;
constants.masterNodeFolder = `./nodes/parity-moc/`;
constants.masterNodeKeysFolder = `${constants.masterNodeFolder}keys/`;
constants.specFolder = `./spec/`;
constants.mocKeysFolder = `${constants.keysFolder}moc/`;
constants.initialKeysFolder = `${constants.keysFolder}initial_keys/`;
constants.miningKeysFolder = `${constants.keysFolder}mining_keys/`;
constants.votingKeysFolder = `${constants.keysFolder}voting_keys/`;
constants.payoutKeysFolder = `${constants.keysFolder}payout_keys/`;
constants.poaNetworkConsensusContractAddress = '0x8bf38d4764929064f2d4d3a56520a76ab3df415b';
constants.ABIsSources = {
	'KeysManager': 'KeysManager.abi.json',
	'PoaNetworkConsensus': 'PoaNetworkConsensus.abi.json',
	'BallotStorage': 'BallotsStorage.abi.json',
	'ValidatorMetadata': 'ValidatorMetadata.abi.json',
	'VotingToChangeKeys': 'VotingToChangeKeys.abi.json',
	'VotingToChangeMinThreshold': 'VotingToChangeMinThreshold.abi.json',
	'VotingToChangeProxyAddress': 'VotingToChangeProxyAddress.abi.json'
};
module.exports = {
  constants
}
