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
  let transactionHistory = [];
  let currentBlock = await client.getCurrentBlockNumber();
  let transactionCount = await client.getTransactionCount(address);
  let balance = await client.getBalance(address, currentBlock);

  let numOfBlocksToProcessAtATime = 100000;
  let begin = currentBlock;
  let runnerState = {
    block: begin,
    transactionCount,
    balance,
  };
  let printer = new XPrinter();

  for (
    var i = begin;
    i >= 0 && (transactionCount > 0 || balance > 0);
    i -= numOfBlocksToProcessAtATime
  ) {
    try {
      //var blocks = await getProcessNBlocks(i, numOfBlocksToProcessAtATime);
      var blocks = await client.getBlocks(i - numOfBlocksToProcessAtATime, i);
      blocks.reverse().forEach((block) => {
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
