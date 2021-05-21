# gatsby-source-remote-config [![npm](https://img.shields.io/npm/v/@marcostoduto/gatsby-source-remote-config)](https://www.npmjs.com/package/@marcostoduto/gatsby-source-remote-config) ![node](https://img.shields.io/node/v/firebase-admin)

Gatsby plugin for connecting [Firebase Remote Config](https://firebase.google.com/products/remote-config)
as a data source. 

## Usage

1. Generate and download a Firebase Admin SDK private key by accessing the
   [Firebase Project Console > Settings > Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)

2. Rename and put the downloaded `.json` crendtial file somewhere in the GatsbyJS project (e.g. `./credentials.json`)

3. Add `gatsby-source-remote-config` as a dependency by running using `npm` or `yarn`:

   ```sh
   npm i @marcostoduto/gatsby-source-remote-config
   # or
   yarn add @marcostoduto/gatsby-source-remote-config
   ```

4. Configure settings at `gatsby-config.js`, for example:
```js
module.exports = {
    plugins: [
        {
            resolve: `@marcostoduto/gatsby-source-remote-config`,
            options: {
                // credential or appConfig
                credential: require(`./credentials.json`),
                appConfig: {
                    apiKey: 'api-key',
                    authDomain: 'project-id.firebaseapp.com',
                    databaseURL: 'https://project-id.firebaseio.com',
                    projectId: 'project-id',
                    storageBucket: 'project-id.appspot.com',
                    messagingSenderId: 'sender-id',
                    appID: 'app-id',
                },
                parameterGroup: "website",
                fields: [
                    "sections"
                ]
            },
        },
    ],
};
```

Example
``` graphql
{
  allRemoteConfigParam {
    nodes {
      id
      valueString
      value {
        array {
          content
          order
          title
        }
      }
    }
  }
}
```



## Configurations

| Key                    | Description                                                                                                                                                        
| ---------------------- | --------------------------------------------------------------------------------- |
| `credential`           | Credential configurations from downloaded private key                             |
| `fields`               | Array of fields to get from remote config                                         |
| `appConfig `           | Credential configurations defined inside object                                   |
| `parameterGroup`       | Name of the parameterGroup to use, if none only main folder parameters are shown  |

