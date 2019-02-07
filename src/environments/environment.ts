// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

/**
 * Environment settings for development environment
 */
export const environment = {
  production: false,
  APP_NAME: 'Lymbo Dev',
  DATABASE_ENTITIES: 'lymbo-dev',
  DATABASE_SETTINGS: 'lymbo_settings-dev',
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
