const Web3 = require('web3');

const web = new Web3('https://cloudflare-eth.com');

let balance = web.eth
  .getBalance('0x15Add3d6D70aE05132Dda8fEA3798998d23A183D')
  .then(console.log);

//console.log(balance);
