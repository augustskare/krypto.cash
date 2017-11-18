import {h, Component} from 'preact';
import {Input, Select, Radio} from '../components/Inputs';
import store from '../utils/store';

class Transaction extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      transactionType: 'bought',
      nativeCurrency: 'USD',
      currency: 'ETH',
    }
  }

  handleChange({target}) {
    this.setState({ [target.name]: target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = Object.assign({}, this.state);
    data.fee = parseFloat(data.fee || 0) / 100;
    data.amount = parseFloat(data.amount);
    data.price = parseFloat(data.price);
    data.purchasePrice = (data.price - (data.price * data.fee)) / data.amount;

    store.add(data);
    this.setState({price: null, fee: null, amount: null})
  }
  
  render(props, state) {
    return (
      <div class="content">
        <form class="form" onSubmit={this.handleSubmit}>
          <div class="heading grid">
            <header>
              <h2 class="heading__title">Add transaction</h2>
            </header>
    
            <div class="switch">
              <Radio label="Bought" id="bought" name="transactionType" onChange={this.handleChange} checked={state.transactionType === 'bought'} />
              <Radio label="Sold" id="sold" name="transactionType" onChange={this.handleChange} checked={state.transactionType === 'sold'} />
            </div>
          </div>
          
          <div class="input-group">
            <Input label="Total price" id="price" value={state.price} onChange={this.handleChange} required />
            <Select label="Native currency" name="nativeCurrency" disabled={props.nativeCurrency !== undefined} onChange={this.handleChange} value={props.nativeCurrency || state.nativeCurrency}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="NOK">NOK</option>
            </Select>
          </div>
          
          <div class="input-group">
            <Input label="Purchase fee" id="fee" value={state.fee} onChange={this.handleChange} />
            <span class="input__aside input">%</span>
          </div>
          <div class="input-group">
            <Input label="Amount" id="amount" value={state.amount} onChange={this.handleChange} required />
            <Select label="Currency" name="currency" value={state.currency} onChange={this.handleChange}>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
              <option value="LTC">LTC</option>
            </Select>
          </div>
    
          <div class="grid">
            <span />
            <input class="button button--default button--main" disabled={state.loading} type="submit" value="Add transaction"/>
          </div>
        </form>
      </div>
    )
  }
}

export default Transaction;