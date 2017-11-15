import {h} from 'preact';
import store from '../utils/store';

import {currencyFormatter, calculatedReturn} from '../utils/formatter';

const TableRow = ({item, nativeCurrency, rates}) => {
  const bought = item.transactionType === 'bought';
  return (
    <tr class="table-body__row" key={item.id}>
      <td class="table__first table-body__item">{bought ? '+' : '-'}{item.amount} {item.currency}</td>
      <td class="table-body__item">{ currencyFormatter(item.purchasePrice, nativeCurrency) }</td>
      <td class="table-body__item">{ rates && calculatedReturn(item.amount * rates[item.currency][item.nativeCurrency], item.price) }</td>
      <td class="table__last table-body__item">
        <button type="button" class="button button--delete" onClick={() => store.delete(item)}>
          <svg viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg"><path d="M23 18V2.5C23 1.12 21.88 0 20.5 0S18 1.12 18 2.5V18H2.5C1.12 18 0 19.12 0 20.5S1.12 23 2.5 23H18v15.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V23h15.5c1.38 0 2.5-1.12 2.5-2.5S39.88 18 38.5 18H23z"/></svg>
          <span class="visuallyhidden">Delete</span>
        </button>
      </td>
    </tr>
  )
}

export default TableRow;