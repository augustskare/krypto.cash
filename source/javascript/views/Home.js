import {h} from 'preact';

import Cards from '../components/cards';
import Navigation from '../components/navigation';
import Table from '../components/table';

import {dateFormatter} from '../utils/formatter';

const Home = (props) => {
  if (props.wallet === undefined) {
    return <div />
  }
  
  return (
    <div>
      { props.wallet.length ? (
        <div>
          <Cards {...props} />
          { props.rates && <small class="small small--light">Rates updated at { dateFormatter(props.rates.timestamp) }</small> }

          <Table {...props} />
        </div>
      ) : <p class="text">How is your cryptocurrency investments doing? <a href="/transaction">Add yours</a>, and find out.</p> }

      <Navigation />
    </div>
  )
}

export default Home;