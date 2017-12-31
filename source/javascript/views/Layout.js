import {h} from 'preact';

import Header from '../components/Header';

const Layout = ({children}) => (
  <div>
    <Header />
    <div class="wrap" id="app">
      { children }
    </div>
  </div>
)

export default Layout;