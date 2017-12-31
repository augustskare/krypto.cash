import {h} from 'preact';

import {getValues} from '../../utils/utils';
import styles from './styles';

const Cards = (props) => {
  const values = getValues(props);

  return (
    <dl class={styles.base}>
      { values.map(({title, value}) => (
        <div class={styles.card}>
          <div class={styles.body}>
            <div class={styles.content}>
              <dt class="small">{title}</dt>
              <dd class={styles.value}>{value}</dd>
            </div>
          </div>
        </div>
      )) }
    </dl>
  )
}

export default Cards;