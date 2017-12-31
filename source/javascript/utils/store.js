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
      ratesService.get().then(rates => {
        this.state.rates = rates;
        this._update();
      })
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
  url: 'https://api.coinbase.com/v2/exchange-rates?currency=',

  get() {
    return Promise.all([ 
      fetch(`${this.url}BTC`), fetch(`${this.url}ETH`), fetch(`${this.url}LTC`), fetch(`${this.url}BCH`), 
    ]).then(resp => Promise.all(resp.map(r => r.json()))).then(resp => {
      const rates = { timestamp: new Date() };
      resp.forEach(({data}) => rates[data.currency] = data.rates);
      return dbStore.setExtra('rates', rates).then(() => rates);
    });
  }
}

export default store;