import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import enCommon from './locales/en/common.json';
import roCommon from './locales/ro/common.json';
// other languages imported similarly could be auto, but not necessary for placeholder

const resources = {
  en: { common: enCommon },
  ro: { common: roCommon },
  // ...other languages
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: RNLocalize.getLocales()[0].languageCode,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;
