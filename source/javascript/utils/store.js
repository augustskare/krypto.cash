import db from './db';

const dbStore = new db();

const store = {
  state: {
    wallet: [],
    nativeCurrency: undefined,
    rates: {},
  },

  init() {
    const data = dbStore.initalGet();
    const rates = getRates();

    data.then(state => {
      this.state = state;
      this._update();
    });
    rates.then(rates => {
      this.state.rates = rates;
      this._update();
    });
  },
    
  subscribe(fn) {
    this.subscriber = fn;
  },

  add(item) {
    if (this.state.wallet.length < 1) {
      dbStore.setExtra('nativeCurrency', item.nativeCurrency);
      this.state.nativeCurrency = item.nativeCurrency;
    }
    dbStore.setItem(item);
    item.id = this.state.wallet.length + 1;
    this.state.wallet = [...this.state.wallet, item];
    
    this._update();
  },
  
  delete(item) {
    const wallet = this.state.wallet.slice();
    const idx = wallet.indexOf(item);
    wallet.splice(idx, 1);
    this.state.wallet = wallet;
    if (this.state.wallet < 1) {
      this.state.nativeCurrency = undefined;
    }
    dbStore.deleteItem(item.id);
    this._update();
  },
    
  _update() {
    this.subscriber(this.state);
  },
}

const getRates = () => {
  const base = 'https://api.coinbase.com/v2/exchange-rates?currency=';

  return Promise.all([ 
    fetch(`${base}BTC`), fetch(`${base}ETH`), fetch(`${base}LTC`) 
  ]).then(resp => Promise.all(resp.map(r => r.json()))).then(resp => {
    const rates = { timestamp: new Date() };
    resp.forEach(({data}) => rates[data.currency] = data.rates);
    return rates;
  });
}

export default store;