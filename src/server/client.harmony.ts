import { Harmony } from '@harmony-js/core';
import {
  ChainID,
  ChainType,
  hexToNumber,
  numberToHex,
  fromWei,
  Units,
  Unit,
} from '@harmony-js/utils';
//import { Messenger } from '@harmony-js/network';
import { URL_MAINNET } from '../../harmony.globals';

const harmonyClient = new Harmony(URL_MAINNET, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyMainnet,
});

export async function getBlocks({
  from,
  to,
  blockArgs = {
    fullTx: false,
    withSigners: false,
  },
  shardID = harmonyClient.messenger.currentShard,
}: {
  from: string;
  to: string;
  blockArgs?: {
    fullTx: boolean;
    withSigners: boolean;
  };
  shardID?: number;
}) {
  const result = await harmonyClient.messenger.send(
    'hmy_getBlocks',
    [from, to, blockArgs],
    harmonyClient.messenger.chainPrefix,
    shardID
  );
  return result;
}

export default harmonyClient;
