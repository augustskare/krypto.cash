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
    this.state.rates.meta = { loading: true };
    this._update();

    ratesService.get(currencies, this.state.nativeCurrency, rates => {
      let data = {};
      let key = '';

      if (rates !== 'all done') {
        const {currency, price, timestamp} = rates; 
        key = currency;
        data = {price, timestamp};
      } else {
        key = 'meta';
        data = {timestamp: new Date(), loading: false};
      }

      dbStore.setRate(key, data)
      this.state.rates = Object.assign({}, this.state.rates, {[key]: data});
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



const ratesService = {
  useCoinbaseApi: ['ETH', 'BTC', 'BCH', 'LTC'],
  coinmarketcapMap: {
    RXP: 'ripple',
    ZRX: '0x',
  },
  nativeCurrency: null,

  get(currencies, nativeCurrency, fn) {
    this.nativeCurrency = nativeCurrency;

    const req = currencies.map(c => this._getData(c).then(fn))
    Promise.all(req).then(e => fn('all done'));
  },

  _normalizeData(data, currency) {
    return data.json().then(data => {
      if (this.isCoinbase(currency)) {
        let d = data.data;
        return parseFloat(d.rates[this.nativeCurrency]);
      } else {
        let d = data[0];
        return parseFloat(d[`price_${this.nativeCurrency.toLowerCase()}`]);
      }
    }).then(price => ({ currency, price, timestamp: new Date() }));
  },

  _getUrl(currency) {
    if (this.isCoinbase(currency)) {
      return `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`;
    }
    
    return `https://api.coinmarketcap.com/v1/ticker/${this.coinmarketcapMap[currency]}/?convert=${this.nativeCurrency}`;
  },

  _getData(currency) {
    return fetch(this._getUrl(currency)).then(resp => this._normalizeData(resp, currency));
  },

  isCoinbase(currency) {
    return this.useCoinbaseApi.includes(currency);
  },

}

ratesService._getData = ratesService._getData.bind(ratesService);

export default store;