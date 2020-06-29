# blockstack-devtool

A simple devtool interface to help you manage different wallets and contracts on testnet.

## Features

- Project support, manage the accounts and contracts per project
- Send STX
- Receive STX in one click from faucet
- Easily deploy smart contracts
- Generate a custom 12 words Mnemonic phrase
- Derive 10 accounts (addresses and private keys) from the Mnemonic
- Display informations about the testnet (eg: current block)
- Easy access to the private key of all the accounts for testing (eg: to be reused easily with the blockstack cli)

## Screenshots

<div align="center"><img src="assets/homepage.png" width="600" ></div>

## Local Development

First you need to clone the repository:

```sh
git clone git@github.com:pradel/blockstack-devtool.git
```

Then run the following command to install dependencies:

```sh
yarn install
```

In one terminal window we need to start the webpack server, run:

```sh
yarn start
```

Then to start the app open a new terminal window and run:

```sh
yarn start-electron
```

You should see a new window with the app open 🎉.

## License

MIT © [Léo Pradel](https://www.leopradel.com/)
