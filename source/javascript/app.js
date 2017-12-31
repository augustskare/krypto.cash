import {h, Component} from 'preact';
import Router from 'preact-router';

import store from './utils/store';
import Layout from './views/Layout';
import View from './components/View';

const Home = () => import(/* webpackChunkName: 'home' */ './views/Home');
const About = () => import(/* webpackChunkName: 'about' */ './views/About')
const Sync = () => import(/* webpackChunkName: 'sync' */ './views/Sync');
const Transaction = () =>  import(/* webpackChunkName: 'transaction' */ './views/Transaction');

class App extends Component {
  constructor() {
    super();

    this.handleRouteChange = this.handleRouteChange.bind(this);
  }
  
  componentDidMount() {
    store.subscribe(state => this.setState(state));
    store.init();

    if (PRODUCTION) {
      import(/* webpackChunkName: 'ganalytics' */ 'ganalytics').then(module => {
        const GAnalytics = module.default;
        this.ga = new GAnalytics('UA-109745092-1', { aip: 1 });
      });
    }
  }

  handleRouteChange({url}) {
    if (this.ga !== undefined) {
      ga.send('pageview', { dl: url });
    }
  }

  render(props, state) {
    return (
      <Layout>
        <Router onChange={this.handleRouteChange}>
          <View path="/" component={Home} wallet={state.wallet} rates={state.rates} nativeCurrency={state.nativeCurrency} />
          <View path="/transaction" component={Transaction} nativeCurrency={state.nativeCurrency}  />
          <View path="/about" component={About} />
          <View path="/sync" component={Sync} wallet={state.wallet} />
        </Router>
      </Layout>
    )
  }
}

export default App;