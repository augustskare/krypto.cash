import {h} from 'preact';

import styles from './styles';

const Notice = ({show}) =>  show ? <p class={styles.notice}>Item added</p> : null;

export default Notice