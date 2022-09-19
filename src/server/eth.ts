import Web3 from 'web3';

const web = new Web3('https://cloudflare-eth.com');

let balance = web.eth
  .getBalance('0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5')
  .then((result) => {
    console.log(web.utils.fromWei(result, 'ether') + ' ETH');
  }, console.error);

//console.log(balance);
//web3.eth.getCoinbase((e, a) => {});
