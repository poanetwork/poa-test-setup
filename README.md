# POA Network test setup

## How it works:
- [x] gets content of master branch of `poa-network-consensus-contracts` repo
- [x] compiles all POA Network contracts
- [x] gets binary code of POA Network Consensus contract
- [x] gets spec.json from `sokol` branch of `chain-spec` repo
- [x] generates custom private, public key and password of MoC and save them to `./keys/moc` folder
- [x] updates spec.json with new MoC and binary code of POA Network Consensus contracts
- [x] starts MoC Parity node
- [x] deploys secondary POA Network contracts
- [x] gets content of master branch of `poa-scripts-moc` repo
- [x] generates 1 initial key with password and copy it to `./keys/initial_keys` folder
- [x] gets content of sokol branch of `poa-dapps-keys-generation` repo
- [x] launches Ceremony DApp is locally builded from repo
- [x] runs e2e tests on Ceremony DApp
- [x] saves generated production keys with Ceremony DApp to `./keys` folder
- [x] runs validator node
- [x] gets content of sokol branch of `poa-dapps-validators` repo
- [x] launches Validators DApp is locally builded from repo
- [x] runs e2e tests on Validators DApp
- [x] gets content of sokol branch of `poa-dapps-voting` repo
- [x] launches Voting DApp is locally builded from repo
- [x] runs e2e tests on Governance DApp

## Requirements
1. Linux, Mac OS
2. Python 3.5+
3. [Solidity flattener](https://github.com/BlockCatIO/solidity-flattener)
4. Parity 1.9.2+

There are some options to start POA Network test setup depending on your needs:
- [Start MoC node](#start-moc-node) - launches only MoC node, generates initial key
- [Launch DApps](#launch-dapps) - launches Ceremony, Validators, Governance DApps
- [Launch Ceremony](#launch-ceremony) - conducts Ceremony
- [Set validator data](#set-validators-data) - set validators personal data with Validators DApp
- [Add validator from Governance](#add_validator_from_governance) - add new validator from Governance
- [Launch added validator node](#launch_added_validator_node) - start new validator's node

## Basic scenarios

### Start MoC node
1. `npm i`
2. `npm run start-moc-setup`

At the successful end of POA test setup start you'll see this message `### POA test setup is configured ###`

#### Expected results:
- RPC of Parity node with unlocked MoC account will be on `http://localhost:8545`
- Spec of the network is generated to `./spec` folder
- MoC keystore file, password, private key is generated to `./keys/moc` folder
- Parity config of MoC node is generated to `./nodes/parity-moc/moc.toml` file
- Addresses of governance smart contracts are generated to `./submodules/poa-network-consensus-contracts/contracts.json`
- ABI of smart contracts are generated to `./submodules/poa-network-consensus-contracts/build/contracts`

### Launch DApps

*Note*: can be started after [previous step is completed](#start-moc-node)

`npm run launch-dapps`

#### Expected results:
- Ceremony Dapp is started on `http://localhost:3000`
- Validators Dapp is started on `http://localhost:3001`
- Governance Dapp is started on `http://localhost:3002`

### Launch Ceremony

*Note*: can be started after [previous step is completed](#launch-dapps)

`npm run launch-ceremony`

#### Expected results:
- 3 initital key are generated
- Initial key passwords, private keys are generated to `.keys/initial_keys` folder
- e2e test of Ceremony DApp is executed
- Mining addresses, passwords and private keys are copied to `./keys/mining_keys` folder
- Payout addresses, passwords and private keys are copied to `./keys/payout_keys` folder
- Voting addresses, passwords and private keys are copied to `./keys/voting_keys` folder
- Initital keys are removed
- Most ETH from initial keys are transfered to voting keys
- Validator nodes are started at RPC ports `8550`, `8551`, `8552`

### Set Validators' personal data

*Note*: can be started after [previous step is completed](#launch-ceremony)

`npm run set-validators-data`

#### Expected results:
- 3 validators filled with mock personal data in Validator Dapp

### Add validator from Governance

*Note*: can be started after [previous step is completed](#set_validators_personal_data)

`npm run add-validator`

#### Expected results:
- New validator is added to validators' set through Governance DApp

### Launch added validator node

*Note*: can be started after [previous step is completed](#add_validator_from_governance)

`npm run start-new-validator-node`

#### Expected results:
- New validator node is started at RPC port `8553`

### Finish test POA setup
`npm run stop-test-setup`