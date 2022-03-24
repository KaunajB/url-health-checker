# URL Health Checker

Checks the health of all URLs provided in config.json by logging

- Response of each URL dependency
- Sending console.log output to server

## Installation

Requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and start the server.

```sh
cd url-health-checker
npm i
npm start
```

_**For Production**_

```sh
cd url-health-checker
npm i
pm2 start healthCheck.js
```
