import {h, Component} from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';

import store from './utils/store';
import Home from './views/Home';

const Transaction = () =>  import(/* webpackChunkName: 'transaction' */ './views/Transaction').then(module => module.default);

class App extends Component {
  componentDidMount() {
    store.subscribe(state => this.setState(state));
    store.init();
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
            <AsyncRoute path="/transaction" nativeCurrency={state.nativeCurrency} getComponent={Transaction} loading={() => <p class="text">Loading...</p>} />
          </Router>
        </div>
      </div>
    )
  }
}

export default App;