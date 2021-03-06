// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiHost: 'http://dev.texta.ee:8090',
  apiBasePath: '/api/v1',
  apiNLG: 'http://dev.texta.ee:5555',
  apiHostTK: 'https://rest-dev.texta.ee',
  apiBasePathTK: '/api/v1/',
  projectId: 247, // TK project id
  toolkitToken: '86e11a3e925d184c36adeda1d7a72505e56e8c77',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
