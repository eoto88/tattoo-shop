import moment from 'moment';
import 'moment/locale/fr-ca'  // without this line it didn't work
moment.locale('fr-ca')

export const dateFormat = 'YYYY-MM-DD';

export const formatDate = (date, format = dateFormat) => {
    return moment(date).format(format);
};

export const localeDate = (date) => {
    return moment(date).format('LL');
};

export const dateNow = () => {
    return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
};
