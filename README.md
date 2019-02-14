# sportsMMR-server

Node.js backend controller for sportsMMR React app.
Currently set up with local mongoDB test environment.

Frontend repo: https://github.com/hendrikvgl/sportsMMR-client

## Dependencies:

config.js file with sensible data in root dir (not included in this repo)

```
const config = {
 auth: {
   secret: 'pssst'
 }
};

module.exports = config;
```

Node.js

Everything else included in package.json

## Commands:

```
pm2 restart server (prod after pull)
node server.js
```

