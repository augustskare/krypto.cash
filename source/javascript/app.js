import {h, Component} from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';

import store from './utils/store';
import Home from './views/Home';

const About = () => import(/* webpackChunkName: 'about' */ './views/About').then(module => module.default);
const Transaction = () =>  import(/* webpackChunkName: 'transaction' */ './views/Transaction').then(module => module.default);
const Loading = () => <p class="text">Loading...</p>;;

class App extends Component {
  componentDidMount() {
    store.subscribe(state => this.setState(state));
    store.init();

    this._persistStorage();
  }

  _persistStorage() {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persisted().then(persistent => {
        if (!persistent) { navigator.storage.persist() }
      });
    }
  }

  render(props, state) {
    return (
      <div>
        <header class="site-header small">
          <div class="site-header__inner wrap content">
            <h1><a href="/">Krypto.cash</a></h1>
          </div>
        </header>
        <div class="wrap">
          <Router>
            <Home path="/" wallet={state.wallet} rates={state.rates} nativeCurrency={state.nativeCurrency} />
            <AsyncRoute path="/transaction" nativeCurrency={state.nativeCurrency} getComponent={Transaction} loading={Loading} />
            <AsyncRoute path="/about" getComponent={About} loading={Loading} />
          </Router>
        </div>
      </div>
    )
  }
}

export default App;