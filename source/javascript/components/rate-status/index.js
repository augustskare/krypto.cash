import {h} from 'preact';
import cx from 'classnames';

import {dateFormatter} from '../../utils/formatter';
import styles from './styles';

const RateStatus = ({rates}) => {
  const summary = rates.meta.loading ? 'Updating rates ⌛️' : 'Rates are up to date';

  return (
    <details>
      <summary class={cx(styles.summary, 'small', 'small--light')}>{summary}</summary>

      <ul>
        { Object.keys(rates).map(r => {
          if (r === 'meta') { return; }
          return <li>{r} updated at {dateFormatter(rates[r].timestamp)}</li>
        }) }
      </ul>
    </details>
  )
}

export default RateStatus;