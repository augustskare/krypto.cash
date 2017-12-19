import {h, Component} from 'preact';
import {paymentService, STRIPE_CONFIG} from '../utils/paymentService';

class DonationButton extends Component {
  constructor() {
    super();

    this.handleToken = this.handleToken.bind(this);
  }
  
  componentDidMount() {
    paymentService.load().then(() => {
      this.setState({ disabled: false });
      this.StripeHandler = StripeCheckout.configure({...STRIPE_CONFIG, token: this.token});
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleToken(token) {
    this.setState({ label: 'Loading', disabled: true });
    paymentService.pay(token, this.props.amount).then(resp => {
      this.setState({ label: 'Thanks!' });
      this.timeout = setTimeout(() => this.setState({ label: undefined, disabled: false }), 1000);
    }).catch(error => {
      this.setState({ label: error.message, disabled: false });
    });
  }
  
  render({amount}, {disabled = true, ...state}) {
    const label = state.label || `Donate $${amount / 100}`;

    return (
      <button class="button button--main button--default" type="button" disabled={disabled} onClick={() => this.StripeHandler.open({ amount })}>
        {label}
      </button>
    )
  }
}

export default DonationButton;