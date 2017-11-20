const percentageFormatter = new Intl.NumberFormat(undefined, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format;

const currencyFormatter = (num, nativeCurrency) => nativeCurrency ? new Intl.NumberFormat(undefined, { style: 'currency', currency: nativeCurrency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num) : 0;

const dateFormatter = (date) => date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric' }) : null;

export {percentageFormatter, currencyFormatter, dateFormatter}