import {h} from 'preact';

import Card from '../components/Card';
import TableRow from '../components/TableRow';
import {dateFormatter} from '../utils/formatter';
import {getValues} from '../utils/utils';

const Home = (props) => {
  const cards = getValues(props);

  return (
    <div>
      { props.wallet && props.wallet.length ? (
        <div>
          <dl class="cards">
            { cards.map(card => <Card title={card.title} value={card.value} />) }
          </dl>

          <table class="table">
            <thead class="table-header small">
              <tr class="table-header__row">
                <th class="table__first table-header__item">Amount</th>
                <th class="table-header__item">Price</th>
                <th class="table-header__item">Perf</th>
                <th class="table__last table-header__item"></th>
              </tr>
            </thead>
            <tbody class="table-body">
              { props.wallet.map(item => <TableRow item={item} nativeCurrency={props.nativeCurrency} rates={props.rates} />) }
            </tbody>
          </table>

          { props.rates && <small class="small small--light">Rates updated at { dateFormatter(props.rates.timestamp) }</small> }

          <a class="button-add" href="/transaction">
            <svg viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg"><path d="M23 18V2.5C23 1.12 21.88 0 20.5 0S18 1.12 18 2.5V18H2.5C1.12 18 0 19.12 0 20.5S1.12 23 2.5 23H18v15.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V23h15.5c1.38 0 2.5-1.12 2.5-2.5S39.88 18 38.5 18H23z"/></svg>
            <span class="visuallyhidden">Add transaction</span>
          </a>
        </div>
      ) : <p class="text">How is your cryptocurrency investments doing? <a href="/transaction">Add yours</a>, and find out.</p> }
    </div>
  )
}

export default Home;