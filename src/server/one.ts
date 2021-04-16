import {
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,
  isBlockNumber,
} from '@harmony-js/utils';
import { IBlockchainClient } from './TransactionHistory';
import harmonyClient, { getBlocks } from './client.harmony';

const verbose = false;

const client: IBlockchainClient = {
  getBalance: async (address: string, currentBlock?: number) => {
    let response = await harmonyClient.blockchain.getBalance({ address });
    return Number(fromWei(hexToNumber(response.result), Units.one));
  },
  getBlock: async (blockNumber: number) => {
    let hex = numberToHex(blockNumber);

    if (!isBlockNumber(hex))
      throw Error(
        `block number is invalid:\ninput: ${blockNumber}\nhex: ${hex}`
      );

    if (verbose) {
      console.info(
        `requesting block: ${JSON.stringify(
          { number: blockNumber, hex },
          null,
          2
        )}`
      );
    }

    let response = await harmonyClient.blockchain.getBlockByNumber({
      blockNumber: hex,
    });

    if (!(response && response.result)) {
      console.info('block was not found');
      return { number: undefined, transactions: [] };
    }

    let block = response.result;
    return {
      number: Number(hexToNumber(block.number)),
      transactions: response.result.transactions,
    };
  },
  getBlocks: async (from, to, blockArgs) => {
    let response = await getBlocks({
      from: numberToHex(from),
      to: numberToHex(to),
      blockArgs,
    });
    return response.result;
  },
  getCurrentBlockNumber: async () => {
    let response = await harmonyClient.blockchain.getBlockNumber();
    return Number(hexToNumber(response.result));
  },
  getTransactionCount: async (address: string) => {
    let response = await harmonyClient.blockchain.getTransactionCount({
      address,
    });

    return Number(hexToNumber(response.result));
  },
};

export default client;
