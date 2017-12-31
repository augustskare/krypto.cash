import {h} from 'preact';
import cx from 'classnames';

import styles from './styles';

const STYLES = {
  primary: cx(styles.button, styles.buttonLarge, styles.buttonPrimary),
  delete: cx(styles.button, styles.buttonDelete),
}

const Button = ({children, type = 'button', style = 'primary', ...props}) => (
  <button class={STYLES[style]} type={type} {...props}>
    {children}
  </button>
)

export default Button;