const paymentService = {
  load() {
    return new Promise((resolve, reject) => {
      if (typeof(StripeCheckout) === 'function') {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = "https://checkout.stripe.com/checkout.js";
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => resolve();
      script.onerror = () => reject();
    });
  },

  pay(token, amount) {
    return fetch(PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, amount }),
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      }
    
      return Promise.reject(resp);
    });
  }
}

const DONATION_AMOUNT = 200;

const STRIPE_CONFIG = {
  key: STRIPE_API_KEY,
  name: 'Krypto.cash',
  image: 'https://krypto.cash/icons/touch-icon-180.png',
  locale: 'auto',
  panelLabel: 'Donate',
  currency: 'USD',
  description: 'Donation',
}

export default paymentService;
export {paymentService, DONATION_AMOUNT, STRIPE_CONFIG}