import db from './db';

const dbStore = new db();

const store = {
  state: {
    wallet: [],
    nativeCurrency: undefined,
    rates: {},
  },

  init() {
    dbStore.initalGet().then(state => {
      this.state = Object.assign({}, this.state, state);
      this._update();
      this._getRates();
    });
  },
    
  subscribe(fn) {
    this.subscriber = fn;
  },

  add(item) {
    if (Array.isArray(item)) {
      item.forEach(i => this._add(i));
    } else {
      this._add(item);
    }

    this._update();
  },

  _add(item) {
    if (this.state.wallet.length < 1) {
      this.initialItem(item.nativeCurrency);
    }
    dbStore.setItem(item);
    item.id = this.state.wallet.length + 1;
    this.state.wallet = [...this.state.wallet, item];
    this._getRates();
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

  _getRates() {
    const currencies = this.state.wallet.map(i => i.currency).filter((i, p, w) => w.indexOf(i) == p);

    ratesService.get(currencies, this.state.nativeCurrency).then(rates => {
      this.state.rates = rates;
      this._update();
    });
  },

  initialItem(nativeCurrency) {
    dbStore.setExtra('nativeCurrency', nativeCurrency);
    this.state.nativeCurrency = nativeCurrency;

    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then(persistent => {
        if (!persistent) { navigator.storage.persist() }
      });
    }
  }
}


const currencyMap = {
  RXP: 'ripple',
  ZRX: '0x',
}

const coinbaseAPI = ['ETH', 'BTC', 'BCH', 'LTC'];

const rateUrl = (currency, nativeCurrency) => {
  if (coinbaseAPI.indexOf(currency) >= 0) {
    return `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`;
  }
  
  return `https://api.coinmarketcap.com/v1/ticker/${currencyMap[currency]}/?convert=${nativeCurrency}`;
}




const ratesService = {
  get(currencies, nativeCurrency) {
    return Promise.all(currencies.map(c => fetch(rateUrl(c, nativeCurrency))))
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(resp => {
        let rates = { timestamp: new Date() };

        resp.forEach(data => {
          if (Array.isArray(data)) {
            let d = data[0];
            rates[d.symbol] = parseFloat(d[`price_${nativeCurrency.toLowerCase()}`]);
          } else {
            let d = data.data;
            rates[d.currency] = parseFloat(d.rates[nativeCurrency]);
          }
        });

        return dbStore.setExtra('rates', rates).then(() => rates);
      });
  }
}

export default store;