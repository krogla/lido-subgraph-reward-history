# Using Lido Subgraph to fetch Daily Rewards History

The repository contains sample code for using Lido Subgraph to retrieve the daily rewards history for a specific address of a stETH-holding user.

In fact, the current code is a minimized and refactored version of the same logic used in the API of the Lido [Reward History Backend service](https://docs.lido.fi/integrations/api/#lido-reward-history)

## setup

### install packages

```bash
npm install
```

### configure

Copy the `.env.example` file to `.env` and if needed modify `SUBGRAPH_URL` var to point to mainnet Lido Subgraph query endpoint.

By default, the URL is The Graph-hosted Lido Subgraph mainnet endpoint:

```env
SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/lidofinance/lido
```

Feel free to change it to a more stable service, e.g. use the [decentralized version of Lido Subgraph](https://thegraph.com/explorer/subgraph?id=HXfMc1jPHfFQoccWd7VMv66km75FoxVHDMvsJj5vG5vf&view=Overview).

## usage

Command to run the script via `ts-node`:

```bash
npm run rewards-dev <address>
```

or using `mode.js` (build & run):

```bash
npm run build
npm run rewards <address>
```

where `<address>` is any `stETH` holder address. E.g. for [`Lido Agent`](https://etherscan.io/address/0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c):

```bash
npm run rewards-dev 0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c
```

### output example

![rewards history output example](stdout-exmpl.png?raw=true "Rewards History output")
