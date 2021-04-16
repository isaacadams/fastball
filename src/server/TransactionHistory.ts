import { hexToNumber } from '@harmony-js/utils';
import XPrinter from './XPrinter';

export interface IBlockchainClient {
  getCurrentBlockNumber: () => Promise<number>;
  getTransactionCount: (address: string) => Promise<number>;
  getBalance: (address: string, currentBlock?: number) => Promise<number>;
  getBlock: (blockNumber: number) => Promise<IBlock>;
  getBlocks: (
    from: number,
    to: number,
    blockArgs?: {
      fullTx: boolean;
      withSigners: boolean;
    }
  ) => Promise<IBlock[]>;
}

export interface IBlock {
  number: number | string;
  transactions: ITransaction[];
}

export interface ITransaction {
  from: string;
  to: string;
  value: number;
}

export async function getTransactionHistory(
  address: string,
  client: IBlockchainClient
): Promise<ITransaction[]> {
  let currentBlock = await client.getCurrentBlockNumber();
  let transactionCount = await client.getTransactionCount(address);
  let balance = await client.getBalance(address, currentBlock);
  let transactionHistory = [];

  let runnerState = {
    block: currentBlock,
    transactionCount,
    balance,
  };
  let printer = new XPrinter();
  let numOfBlocksToProcessAtATime = 100000;
  for (
    var i = currentBlock;
    i >= 0 && (transactionCount > 0 || balance > 0);
    i - numOfBlocksToProcessAtATime
  ) {
    try {
      //var block = await client.getBlock(i); //, true);
      //var blocks = await getProcessNBlocks(i, numOfBlocksToProcessAtATime);
      var blocks = await client.getBlocks(i - numOfBlocksToProcessAtATime, i);
      blocks.forEach((block) => {
        if (typeof block.number === 'string') {
          runnerState.block = Number(hexToNumber(block.number));
        } else {
          runnerState.block = block.number;
        }
        printer.print(runnerState);

        if (block && block.transactions) {
          block.transactions.forEach(function (e) {
            if (address == e.from) {
              transactionHistory.push(e);
              if (e.from != e.to) balance += e.value;
              //console.log(i, e.from, e.to, e.value.toString(10));
              --transactionCount;
            }
            if (address == e.to) {
              transactionHistory.push(e);
              if (e.from != e.to) balance -= e.value;
              //console.log(i, e.from, e.to, e.value.toString(10));
            }

            runnerState.balance = balance;
            runnerState.transactionCount = transactionCount;
            printer.print(runnerState);
          });
        }
      });
    } catch (e) {
      console.error('error processing block batch ' + i, e);
    }
  }

  return transactionHistory;

  async function getProcessNBlocks(n0: number, n: number): Promise<IBlock[]> {
    //let n0 = await client.getCurrentBlockNumber();
    let blocksToProcess = Array.from(Array(n).keys());

    return Promise.all(
      blocksToProcess
        .map((x) => n0 - x)
        .map((x) => {
          try {
            return client.getBlock(x);
          } catch (e) {
            console.error('error requesting block ' + x, e);
          }
        })
    );
  }
}

/* var myAddr = '0xbb9bc244d798123fde783fcc1c72d3bb8c189413';
var currentBlock = eth.blockNumber;
var n = eth.getTransactionCount(myAddr, currentBlock);
var bal = eth.getBalance(myAddr, currentBlock);
for (var i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
  try {
    var block = eth.getBlock(i, true);
    if (block && block.transactions) {
      block.transactions.forEach(function (e) {
        if (myAddr == e.from) {
          if (e.from != e.to) bal = bal.plus(e.value);
          console.log(i, e.from, e.to, e.value.toString(10));
          --n;
        }
        if (myAddr == e.to) {
          if (e.from != e.to) bal = bal.minus(e.value);
          console.log(i, e.from, e.to, e.value.toString(10));
        }
      });
    }
  } catch (e) {
    console.error('Error in block ' + i, e);
  }
} */
