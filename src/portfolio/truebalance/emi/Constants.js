// import 'babel-polyfill';
import moment from 'moment';
import 'moment-timezone';


export const NOT_RESPONDING = 'The server is not responding.';

export const DATE_FORMAT_KO_KR = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT_EN_IN = 'DD/MM/YYYY HH:mm';
export const DATE_FORMAT_LOAN = 'DD MMM YY';
export const DATE_FORMAT_DATE_ONLY = 'YYYYMMDD';

export const TZ_INDIA = 'Asia/Kolkata';

export const getUTCandConvertIndia = epochSecond => moment.tz(epochSecond * 1000, 'UTC').tz(TZ_INDIA);
