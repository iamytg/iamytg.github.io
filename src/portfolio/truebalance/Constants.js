import moment from 'moment';
import 'moment-timezone';


export const NOT_RESPONDING = 'The server is not responding.';

export const DATE_FORMAT_KO_KR = 'YYYY-MM-DD HH:mm';
export const DATE_FORMAT_EN_IN = 'DD/MM/YYYY HH:mm';

export const TZ_INDIA = 'Asia/Kolkata';

export const rewardTypes = [
    {code: 'PROBABILITY', label: 'Percentage'},
    {code: 'FIXED', label: 'Number of users'},
    {code: 'FAIL', label: 'Fail'},
    // {code: 'AD', label: 'AD'},
];
const enum_rewardTypes = {};
rewardTypes.forEach((type) => {
    enum_rewardTypes[type.code] = type.code;
});

export const exceptiveConditionTypes = [
    {code: 'FIRST_5', label: 'Initial winning pattern'},
];
const enum_exceptiveConditionTypes = {};
exceptiveConditionTypes.forEach((type) => {
    enum_exceptiveConditionTypes[type.code] = type.code;
});

export {enum_rewardTypes, enum_exceptiveConditionTypes};

export const exceptiveConditionFirst5 = [
    {code: '', label: 'None'}, {code: true, label: 'Win'}, {code: false, label: 'Fail'},
];

export const goSignin = () => {
    alert('Your session has expired.');
    window.location.href = `/auth/login?redirect=${window.encodeURIComponent(window.location.pathname)}`;
};

export const getUTCandConvertIndia = epochSecond => moment.tz(epochSecond * 1000, 'UTC').tz(TZ_INDIA);