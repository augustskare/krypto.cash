import idb from 'idb';

class db {
  constructor() {
    this.db = idb.open('krypto-db', 1, upgradeDB => {
      upgradeDB.createObjectStore('wallet', { keyPath: 'id', autoIncrement: true });
      upgradeDB.createObjectStore('extra');
    });
  }

  _set(store, value, key) {
    return this.db.then(db => {
      const tx = db.transaction(store, 'readwrite');
      if (!key) {
        tx.objectStore(store).add(value);
      } else {
        tx.objectStore(store).put(value, key);
      }
      return tx.complete;
    });
  }

  setItem(data) {
    return this._set('wallet', data);
  }

  getItems() {
    return this.db.then(db => db.transaction('wallet').objectStore('wallet').getAll());
  }

  deleteItem(id) {
    return this.db.then(db => db.transaction('wallet', 'readwrite').objectStore('wallet').delete(id));
  }

  setExtra(key, value) {
    return this._set('extra', value, key);
  }

  getExtra(key) {
    return this.db.then(db => db.transaction('extra').objectStore('extra').get(key));
  }

  initalGet() {
    return Promise.all([
      this.getExtra('rates'),
      this.getExtra('nativeCurrency'),
      this.getItems()
    ]).then(resp => {
      const [rates, nativeCurrency, wallet] = resp;
      return {
        rates: rates || {}, 
        nativeCurrency: nativeCurrency || undefined, 
        wallet: wallet || []
      };
    });
  }

}

export default db;

