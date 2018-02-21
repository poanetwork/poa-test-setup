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
- [ ] runs e2e tests on Validators DApp
- [ ] gets content of sokol branch of `poa-dapps-voting` repo
- [ ] launches Voting DApp is locally builded from repo
- [ ] runs e2e tests on Governance DApp

## Requirements
1. Linux, Mac OS
2. Python 3.5+
3. [Solidity flattener](https://github.com/BlockCatIO/solidity-flattener)
4. Parity 1.9.2+

There are some options to start POA Network test setup depending on your needs:
- [Start MoC node](#start-moc-node) - launches only MoC node, generates initial key, launches Ceremony Dapp
- [Start MoC node + e2e Ceremony test](#start-moc-node--e2e-ceremony-test) - launches only MoC node, generates initial key, launches Ceremony Dapp and generates production keys from it
- [Start MoC + 1 validator nodes + e2e Ceremony test](#start-moc-one-validator-nodes--e2e-ceremony-test) - launches MoC node, generates initial key, launches Ceremony Dapp and generates production keys from it, launches 1 validator node, launches Validators Dapp

## Start MoC node
1. `npm i`
2. `npm run start-test-setup`

At the successful end of POA test setup start you'll see this message `### POA test setup is configured ###`

### Expected result:
- RPC of Parity node with unlocked MoC account will be on `http://localhost:8545`
- Spec of the network is generated to `./spec` folder
- MoC keystore file, password, private key is generated to `./keys/moc` folder
- Initial key password, private key is generated to `.keys/initial_keys` folder
- Parity config of MoC node is generated to `./nodes/parity-moc/moc.toml` file
- Addresses of governance smart contracts are generated to `./submodules/poa-network-consensus-contracts/contracts.json`
- ABI of smart contracts are generated to `./submodules/poa-network-consensus-contracts/build/contracts`
- Ceremony Dapp is started on `http://localhost:3000`

## Start MoC node + e2e Ceremony test
1. `npm i`
2. `npm run start-test-setup-e2e-ceremony-test`

### Expected result:
- All expected results from [Start MoC node script](#start-moc-node)
- e2e test of Ceremony DApp was executed
- Mining address, password and private key is copied to `./keys/mining_keys` folder
- Payout address, password and private key is copied to `./keys/payout_keys` folder
- Voting address, password and private key is copied to `./keys/voting_keys` folder

If you have already started test POA setup before with [Start MoC node script](#start-moc-node)  you can run e2e ceremony test with `npm run e2e-ceremony-test` 

## Start MoC, one validator nodes + e2e Ceremony test
1. `npm i`
2. `npm run start-moc-validator-setup`

### Expected result:
- All expected results from [Start MoC node + e2e Ceremony test](#start-moc-node--e2e-ceremony-test)
- RPC of Parity node with unlocked validator account will be on `http://localhost:8554`
- Validators Dapp is started on `http://localhost:3001`

## Finish test POA setup
`npm run stop-test-setup`