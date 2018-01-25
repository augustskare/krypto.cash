import idb from 'idb';

class db {
  constructor() {
    this.db = idb.open('krypto-db', 2, upgradeDB => {
      console.log(upgradeDB.oldVersion)
      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore('wallet', { keyPath: 'id', autoIncrement: true });
          upgradeDB.createObjectStore('extra');
        case 1:           
          upgradeDB.createObjectStore('rates');
      }
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

  _get(id) {
    return this.db.then(db => db.transaction(id).objectStore(id).getAll());
  }

  setItem(data) {
    return this._set('wallet', data);
  }

  getItems() {
    return this._get('wallet');
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

  getRates() {
    return this.db.then(db => {
      let rates = [];
      const tx = db.transaction('rates');
      const store = tx.objectStore('rates');

      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        const key = cursor.key;
        store.get(key).then(val => {
          rates[key] = val;
          cursor.continue();
        })
      });
 
      return tx.complete.then(() => rates);
    });
  }

  setRate(key, value) {
    return this._set('rates', value, key);
  }

  initalGet() {
    return Promise.all([
      this.getRates(),
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

