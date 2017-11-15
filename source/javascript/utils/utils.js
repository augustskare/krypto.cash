import {percentageFormatter, currencyFormatter} from '../utils/formatter';

const getValues = ({wallet, rates, nativeCurrency}) => {
  let unrealized = 0;
  let realized = 0;
  let bought = 0;
  let value = 0;

  if (rates) {
    if (Object.keys(rates).length) {
      wallet.forEach(item => {
        if (item.transactionType === 'bought') {
          unrealized += (item.amount * rates[item.currency][nativeCurrency]);
          bought += item.price;
        } else {
          unrealized -= item.price;
          realized += item.price;
        }
      });
    }
    value = (((unrealized + realized) / bought) - 1) || 0;
  }

  return [
    {
      title: 'Adj. performance',
      value: percentageFormatter(value),
    },
    {
      title: 'Live value',
      value: currencyFormatter(unrealized, nativeCurrency),
    },
    {
      title: 'Realized value',
      value: currencyFormatter(realized, nativeCurrency),
    },
  ];
}

export {getValues}