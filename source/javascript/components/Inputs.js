import {h} from 'preact';

const Input = ({label, id, ...props}) => (
  <div class="number-input">
    <label class="visuallyhidden" for={id}>{label}</label>
    <input class="number-input__field input" id={id} name={id} placeholder={label} type="number" {...props} step="any" />
  </div>
)

const Select = ({label, name, children, ...props}) => (
  <div class="select input__aside">
    <label class="visuallyhidden" for={name}>{label}</label>
    <select class="select__field input" name={name} id={name} {...props}>
      {children}
    </select>
    <svg class="select__icon" width="10" height="6" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l4 4 4-4" stroke-width="1.5" stroke="currentColor" fill="none" fill-rule="evenodd"/>
    </svg>
  </div>
)

const Radio = ({label, id, name, ...props}) => (
  <label class="switch__toggle" for={id}>
    <input class="switch__input visuallyhidden" type="radio" value={id} id={id} name={name} {...props} />
    <span class="switch__indicator" />
    <span class="switch__label">{label}</span>
  </label>
)

export {Input, Select, Radio}