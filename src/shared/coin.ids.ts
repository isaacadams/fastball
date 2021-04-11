type CoinList = {
  BITCOIN: Coin;
  ETHEREUM: Coin;
  HARMONY: Coin;
};

type Coin = {
  id: string;
  symbol: string;
  name: string;
};

const BITCOIN = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
};

const ETHEREUM = {
  id: 'ethereum',
  symbol: 'eth',
  name: 'Ethereum',
};

const HARMONY = {
  id: 'harmony',
  symbol: 'one',
  name: 'Harmony',
};

const COINS = { BITCOIN, ETHEREUM, HARMONY };

export function getId(coin: keyof CoinList): string {
  return COINS[coin].id;
}
