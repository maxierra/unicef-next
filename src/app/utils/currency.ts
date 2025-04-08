type CountryCurrency = {
  code: string;
  locale: string;
  symbol: string;
};

const COUNTRY_CURRENCIES: Record<string, CountryCurrency> = {
  'México': {
    code: 'MXN',
    locale: 'es-MX',
    symbol: '$MXN',
  },
  'Ecuador': {
    code: 'USD',
    locale: 'es-EC',
    symbol: 'US$',
  },
  'Argentina': {
    code: 'ARS',
    locale: 'es-AR',
    symbol: 'AR$',
  },
  'Uruguay': {
    code: 'UYU',
    locale: 'es-UY',
    symbol: '$U',
  },
};

export const formatCurrency = (amount: number, country: string): string => {
  const currencyInfo = COUNTRY_CURRENCIES[country] || COUNTRY_CURRENCIES['México'];

  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number: number, country: string): string => {
  const currencyInfo = COUNTRY_CURRENCIES[country] || COUNTRY_CURRENCIES['México'];
  
  return new Intl.NumberFormat(currencyInfo.locale).format(number);
};