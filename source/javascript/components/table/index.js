import {h} from 'preact';
import cx from 'classnames';

import styles from './styles';
import TableRow from './TableRow';

const Table = (props) => (
  <table class={styles.base}>
    <thead class="small">
      <tr>
        <th class={cx(styles.headerItem, styles.first)}>Amount</th>
        <th class={styles.headerItem}>Price</th>
        <th class={styles.headerItem}>Perf</th>
        <th class={cx(styles.headerItem, styles.last)}></th>
      </tr>
    </thead>
    <tbody class="table-body">
      { props.wallet.map(item => <TableRow item={item} nativeCurrency={props.nativeCurrency} rates={props.rates} />) }
    </tbody>
  </table>
)

export default Table