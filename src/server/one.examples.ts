import {
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,
} from '@harmony-js/utils';
import { ONE } from '../../wallets';
import harmonyClient from './client.harmony';

harmonyClient.blockchain
  .getBalance({ address: ONE })
  .then((response) => {
    console.log(
      'balance in ONEs: ' + fromWei(hexToNumber(response.result), Units.one)
    );
  })
  .catch(console.error);

harmonyClient.blockchain
  .getTransactionCount({
    address: ONE,
  })
  .then((response) => {
    console.log(hexToNumber(response.result));
  });

console.log(harmonyClient.wallet.getAccount(ONE));

let contract = harmonyClient.contracts.createContract([], ONE);

//console.log(address)
console.log(contract.events);

/* harmonyClient.blockchain
  .getCode({
    address: ONE,
    blockNumber: 'latest',
  })
  .then((r) => console.log(r.result));

harmonyClient.blockchain.getBlockNumber().then((value) => {
  console.log(value.result);
  harmonyClient.blockchain
    .getTransactionByBlockNumberAndIndex({
      //blockNumber: '0x2403C',
      blockNumber: value.result,
      index: '0x0',
    })
    .then((value) => {
      console.log(value);
    });
}); */
