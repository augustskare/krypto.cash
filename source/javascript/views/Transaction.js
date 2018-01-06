import {h, Component} from 'preact';
import {Input, Select, InputGroup, Switch, InputAside} from '../components/inputs';
import Notice from '../components/notice';
import Button from '../components/button';
import store from '../utils/store';

const CRYPTOCURRENCIES = ['ETH', 'BTC', 'BCH', 'LTC', 'ZRX', 'RXP'];
const NATIVE_CURRENIES = ['USD', 'EUR', 'NOK'];

class Transaction extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      transactionType: 'bought',
      nativeCurrency: NATIVE_CURRENIES[0],
      currency: CRYPTOCURRENCIES[0],
    }
  }

  handleChange({target}) {
    this.setState({ [target.name]: target.value, added: false });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = Object.assign({}, this.state);
    data.nativeCurrency = this.props.nativeCurrency || data.nativeCurrency;
    data.fee = parseFloat(data.fee || 0) / 100;
    data.amount = parseFloat(data.amount);
    data.price = parseFloat(data.price);
    data.purchasePrice = (data.price - (data.price * data.fee)) / data.amount;

    store.add(data);
    this.setState({price: null, fee: null, amount: null, added: true });
  }
  
  render(props, state) {
    return (
      <div class="content">
        <Notice show={state.added} />

        <form class="form" onSubmit={this.handleSubmit}>
          <div class="heading grid">
            <header>
              <h2>Add transaction</h2>
            </header>
    
            <Switch options={['Bought', 'Sold']} name="transactionType" selected={state.transactionType} onChange={this.handleChange}/>
          </div>
          
          <InputGroup>
            <Input label="Total price" id="price" value={state.price} onChange={this.handleChange} required />
            <Select label="Native currency" name="nativeCurrency" options={NATIVE_CURRENIES} disabled={props.nativeCurrency !== undefined} onChange={this.handleChange} value={props.nativeCurrency || state.nativeCurrency} />
          </InputGroup>
          
          <InputGroup>
            <Input label="Purchase fee" id="fee" value={state.fee} onChange={this.handleChange} />
            <InputAside>%</InputAside>
          </InputGroup>

          <InputGroup>
            <Input label="Amount" id="amount" value={state.amount} onChange={this.handleChange} required />
            <Select label="Currency" name="currency" options={CRYPTOCURRENCIES} onChange={this.handleChange} value={state.currency} />
          </InputGroup>
    
          <div class="grid">
            <span />
            <Button type="submit" disabled={state.loading}>Add transaction</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default Transaction;