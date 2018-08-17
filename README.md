# POA Network test setup

## How it works:
- [x] gets content of `master` branch of `poa-network-consensus-contracts` repo
- [x] compiles all POA Network contracts
- [x] gets binary code of POA Network Consensus contract
- [x] gets spec.json from `sokol` branch of `chain-spec` repo
- [x] generates custom private, public key and password of MoC and save them to `./keys/moc` folder
- [x] updates spec.json with new MoC and binary code of POA Network Consensus contracts
- [x] starts MoC Parity node
- [x] deploys secondary POA Network contracts
- [x] gets content of `master` branch of `poa-scripts-moc` repo
- [x] generates one initial key with password and copies it to `./keys/initial_keys` folder
- [x] gets content of `core` branch of `poa-dapps-keys-generation` repo
- [x] launches Ceremony DApp locally built from the repo
- [x] runs e2e tests on Ceremony DApp
- [x] saves generated production keys with Ceremony DApp to `./keys` folder
- [x] runs validator node
- [x] gets content of `core` branch of `poa-dapps-validators` repo
- [x] launches Validators DApp locally built from the repo
- [x] runs e2e tests on Validators DApp
- [x] gets content of `core` branch of `poa-dapps-voting` repo
- [x] launches Voting DApp locally built from the repo
- [x] runs e2e tests on Governance DApp

## Requirements
1. Linux, Mac OS
2. Parity 1.9.2+
3. Google Chrome

## Basic scenarios

There are some options to start POA Network test setup depending on your needs:
- [Start MoC node](#start-moc-node) - launches only MoC node, generates initial key
- [Launch DApps](#launch-dapps) - launches Ceremony, Validators, Governance DApps
- [Launch Ceremony](#launch-ceremony) - conducts Ceremony
- [Set validator data](#set-validators-personal-data) - set validators personal data with Validators DApp
- [Add validator from Governance](#add-validator-from-governance) - add new validator from Governance
- [Launch added validator node](#launch-added-validator-node) - start new validator's node

### Start MoC node
1. `npm i`
2. `npm run start-moc-setup`

At the successful end of POA test setup start you'll see this message: `### POA test setup is configured ###`

#### Expected results:
- RPC of Parity node with unlocked MoC account will be on `http://localhost:8545`
- Spec of the network is generated to `./spec` folder
- MoC keystore file, password, private key are generated to `./keys/moc` folder
- Parity config of MoC node is generated to `./nodes/parity-moc/moc.toml` file
- Addresses of governance smart contracts are generated to `./submodules/poa-network-consensus-contracts/contracts.json`
- ABI of smart contracts are generated to `./submodules/poa-network-consensus-contracts/build/contracts`

### Launch DApps

*Note*: can be started after [the previous step is completed](#start-moc-node)

`npm run launch-dapps`

For Ubuntu users: if you encounter any errors during DApps launching, try to increase `max_user_watches` limit and repeat steps:

```bash
$ npm run stop-test-setup
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -p
$ npm run start-moc-setup
$ npm run launch-dapps
```

#### Expected results:
- Ceremony DApp is started on `http://localhost:3000`
- Validators DApp is started on `http://localhost:3001`
- Governance DApp is started on `http://localhost:3002`

### Launch Ceremony

*Note*: can be started after [the previous step is completed](#launch-dapps)

For Ubuntu users: you should first install and use *X virtual framebuffer* if you want to move all graphical operations to the virtual memory without showing any screen output.
```
sudo apt-get -y install xvfb
export DISPLAY=:99.0
sudo start-stop-daemon --start --quiet --pidfile /var/run/xvfb.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset
```

`npm run launch-ceremony-light`

#### Expected results:
- one initial key is generated
- initial key password, private key are generated to `.keys/initial_keys` folder
- e2e test of Ceremony DApp is executed
- mining address, password, and private key are copied to `./keys/mining_keys` folder
- payout address, password, and private key are copied to `./keys/payout_keys` folder
- voting address, password, and private key are copied to `./keys/voting_keys` folder
- initial key is removed
- most ETH from initial key is transferred to voting keys
- validator node is started at RPC port `8550`

### Set Validator's personal data

*Note*: can be started after [the previous step is completed](#launch-ceremony)

`npm run set-validators-data-light`

#### Expected results:
- one validator filled the form with mock personal data in Validator DApp

### Add validator from Governance

*Note*: can be started after [the previous step is completed](#set_validators_personal_data)

`npm run add-validator`

#### Expected results:
- New validator is added to validators' set through Governance DApp

### Launch added validator node

*Note*: can be started after [the previous step is completed](#add-validator-from-governance)

`npm run start-new-validator-node`

#### Expected results:
- New validator node is started at RPC port `8553`

### Finish test POA setup
`npm run stop-test-setup`

For Ubuntu users: you should also stop virtual framebuffer if you started it before.<br />
`sudo start-stop-daemon --stop --quiet --pidfile /var/run/xvfb.pid --remove-pidfile`
