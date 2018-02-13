const fs = require('fs');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const utils = require("./utils/utils");

main()

function main() {
	const generateInitialKeyConfig = JSON.parse(fs.readFileSync(constants.scriptsMocConfigPath));
	const keysManagerObj = JSON.parse(fs.readFileSync(constants.pathToKeysManagerContract));

	const pathToAddressesJSON = `${constants.pathToContractRepo}/${constants.addressesSourceFile}`;

	const addresses = JSON.parse(fs.readFileSync(pathToAddressesJSON));

	generateInitialKeyConfig.Ethereum.contracts.KeysManager.addr = addresses.KEYS_MANAGER_ADDRESS;
	generateInitialKeyConfig.Ethereum.contracts.KeysManager.abi = keysManagerObj.abi;

	utils.saveToFile(constants.scriptsMocConfigPath, JSON.stringify(generateInitialKeyConfig, null, 2));

	console.log("MoC script is prepared");
}