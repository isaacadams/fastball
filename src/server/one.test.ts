import { ONE } from '../../wallets';
import { getTransactionHistory } from './TransactionHistory';
import client from './one';

async function test() {
  client.getBalance(ONE).then(console.log);
  client.getTransactionCount(ONE).then(console.log);
  let n = await client.getCurrentBlockNumber();
  client.getBlock(n).then((b) => console.log(b.transactions.length));
}

async function testingGetBlocks() {
  let n = await client.getCurrentBlockNumber();
  let blocks = await client.getBlocks(n - 10, n);

  console.log(blocks.reverse());
}

//test();
//testingGetBlocks();
getTransactionHistory(ONE, client).then(console.log).catch(console.error);
