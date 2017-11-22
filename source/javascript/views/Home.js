import {h} from 'preact';

import Card from '../components/Card';
import TableRow from '../components/TableRow';
import {dateFormatter} from '../utils/formatter';
import {getValues} from '../utils/utils';

const navItems = [
  { title: 'Add transaction', href: '/transaction' },
];

const Home = (props) => {
  const cards = getValues(props);

  if (props.wallet === undefined) {
    return <div />
  }
  
  return (
    <div>
      { props.wallet.length ? (
        <div>
          <dl class="cards">
            { cards.map(card => <Card title={card.title} value={card.value} />) }
          </dl>
          
          { props.rates && <small class="small small--light">Rates updated at { dateFormatter(props.rates.timestamp) }</small> }

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
        </div>
      ) : <p class="text">How is your cryptocurrency investments doing? <a href="/transaction">Add yours</a>, and find out.</p> }

      <nav class="navigation">
        <ul class="navigation__list">
          { navItems.map(item => (
            <li class="navigation__list-item">
              <a class="navigation__list-link" href={item.href}>{item.title}</a>
            </li>
          )) }
        </ul>
      </nav>
    </div>
  )
}

export default Home;