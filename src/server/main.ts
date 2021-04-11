import { getId } from '../shared/coin.ids';
import * as http from 'https';

function get(url) {
  http
    .get(url, (r) => {
      console.log(r.headers);
      console.log(`${r.statusCode}: ${r.statusMessage}`);
      r.on('data', function (d) {
        process.stdout.write(d);
      });
    })
    .on('error', console.error);
}

const domain = 'https://api.coingecko.com/api/v3/';
const checkPrice = `${domain}simple/price?ids=${getId(
  'BITCOIN'
)}&vs_currencies=usd`;

const getCoins = `${domain}coins/list`;

get(checkPrice);
//get(getCoins);
