import {h} from 'preact';

const Card = ({title, value}) => (
  <div class="card">
    <div class="card__body">
      <div class="card__content">
        <dt class="small">{title}</dt>
        <dd class="card__title">{value}</dd>
      </div>
    </div>
  </div>
)

export default Card;