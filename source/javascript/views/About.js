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
        <p>Krypto.cash is a free tool that helps you figure out how your cryptocurrency investments are actually doing. Made by <a class="link" rel="noopener" href="https://augustskare.no">August Skare</a> and <a class="link" rel="noopener" href="http://www.kristianhjelle.com">Kristian Hjelle</a>.</p>
        <p>The data you enter in Krypto.cash is only stored on your device.</p>
        <p>We've open sourced the code for this project on <a class="link" rel="noopener" href="https://github.com/augustskare/krypto.cash">GitHub</a>.</p>
        <p>Enjoy using this service? Buy us a coffee!</p>
        <button class="button button--main button--default" type="button" disabled={state.disabledButton} onClick={this.handlePayment}>Donate $2</button>
      </div>
    )
  }
}

export default About;