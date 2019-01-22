# sportsMMR-server

Node.js backend controller for sportsMMR React app.
Currently set up with local mongoDB test environment.

Frontend repo: https://github.com/hendrikvgl/sportsMMR-client

## Dependencies:

Node.js

```
npm i -S mongoose express body-parser morgan cors
```

## Commands:
```
node server.js
```

## Modules:

### server.js
- implements operations regarding the persistence layer.
- defines database parameters (needs refactoring into separate config file)

### data.js
- defines data models
