import {h} from 'preact';
import cx from 'classnames';

import styles from './styles';

const Input = ({label, id, ...props}) => (
  <div class={styles.numberInput}>
    <label class="visuallyhidden" for={id}>{label}</label>
    <input class={cx(styles.numberInputField, styles.input)} id={id} name={id} placeholder={label} type="number" {...props} step="any" />
  </div>
)

const Select = ({label, name, options, ...props}) => (
  <div class={styles.inputAside}>
    <label class="visuallyhidden" for={name}>{label}</label>
    <select class={cx(styles.select, styles.input)} name={name} id={name} {...props}>
      { options.map(option => <option value={option}>{option}</option>) }
    </select>
    <svg class={styles.selectIcon} width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l4 4 4-4" stroke-width="1.5" stroke="currentColor" fill="none" fill-rule="evenodd"/>
    </svg>
  </div>
)

const Radio = ({label, id, name, ...props}) => (
  <label class={styles.switchToggle} for={id}>
    <input class={cx(styles.switchInput, 'visuallyhidden')} type="radio" value={id} id={id} name={name} {...props} />
    <span class={styles.switchIndicator} />
    <span class={styles.switchLabel}>{label}</span>
  </label>
)

const Switch = ({options, selected, ...props}) => (
  <div class={styles.switch}>
    { options.map(option => {
      const id = option.toLowerCase();
      return <Radio label={option} id={id} checked={selected === id} {...props} />
    }) }
  </div>
)

const InputGroup = ({children}) => (
  <div class={styles.inputGroup}>
    { children }
  </div>
)

const InputAside = ({children}) => <span class={cx(styles.inputAside, styles.input)}>{children}</span>

export {Input, Select, Radio, Switch, InputGroup, InputAside}