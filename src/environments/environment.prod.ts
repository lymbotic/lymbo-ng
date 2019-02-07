/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  APP_NAME: 'Lymbo',
  DATABASE_ENTITIES: 'lymbo',
  DATABASE_SETTINGS: 'lymbo_settings',
  LIMIT_TAGS: 500,

  TRANSLATE_DEBOUNCE_TIME: 500,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,

  firebase: {
    apiKey: 'AIzaSyDAu6wK98_4WovhHMISLnWChED47kj9hpY',
    authDomain: 'lymbo-975a9.firebaseapp.com',
    databaseURL: 'https://lymbo-975a9.firebaseio.com',
    projectId: 'lymbo-975a9',
    storageBucket: 'lymbo-975a9.appspot.com',
    messagingSenderId: '597937213109'
  }
};
