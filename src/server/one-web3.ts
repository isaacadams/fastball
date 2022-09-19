import Web3 from 'web3';
import { ONE_AS_ETH } from '../../wallets.js';

const eth = new Web3('https://cloudflare-eth.com').eth;

eth
  .getPastLogs({
    fromBlock: '0x0',
    address: ONE_AS_ETH,
  })
  .then((res) => {
    res.forEach((rec) => {
      console.log(rec.blockNumber, rec.transactionHash, rec.topics);
    });
  })
  .catch((err) => console.log('getPastLogs failed', err));
