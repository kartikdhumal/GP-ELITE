import currencyFormatter from 'currency-formatter';

const MyCurrencyFormatter = (value) => {
    return currencyFormatter.format(value, { code: 'INR', precision: 0 }).replace("₹", "₹ ");
};

export default MyCurrencyFormatter;