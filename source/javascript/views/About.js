import {h, Component} from 'preact';

const StripeCheckoutConfig = {
  key: STRIPE_API_KEY,
  name: 'Krypto.cash',
  image: 'https://krypto.cash/icons/touch-icon-180.png',
  locale: 'auto',
  panelLabel: 'Donate',
  currency: 'USD',
  bitcoin: true,
  token: () => {}
}

class About extends Component {
  constructor() {
    super();

    this.handlePayment = this.handlePayment.bind(this);
    this.state.disabledButton = true;
  }
  
  componentDidMount() {
    if (typeof(this.StripeHandler) !== 'object') {
      const script = document.createElement('script');
      script.src = "https://checkout.stripe.com/checkout.js";
      document.head.appendChild(script);
      script.onload = () => {
        this.setState({ disabledButton: false });
        this.StripeHandler = StripeCheckout.configure(StripeCheckoutConfig);
      };
    }
  }

  handlePayment() {
    this.StripeHandler.open({ amount: 200 });
  }
  
  render(props, state) {
    return (
      <div class="content">
        <p>
          Krypto.cash is free tool that helps you find out how your cryptocurrency investments is doing. Made by <a class="link" href="https://augustskare.no">August Skare</a> and <a class="link" href="http://www.kristianhjelle.com">Kristian Hjelle</a>.
        </p>
        <p>
          Your data is not stored on any server, only on you’r device. The code is open sourced and availble on <a class="link" href="https://github.com/augustskare/krypto.cash">GitHub</a>.
        </p>

        <p>Like using this service? Buy us a coffee!</p>
        <button class="button button--main button--default" type="button" disabled={state.disabledButton} onClick={this.handlePayment}>Donate $2</button>
      </div>
    )
  }
}

export default About;