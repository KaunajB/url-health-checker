# URL Health Checker

Checks the health of all URLs provided in config.json by logging

- Response of each URL dependency
- Sending console.log output to server

## Installation

Requires [Node.js](https://nodejs.org/) and [Chromium-browser] to run.

Install the dependencies and start the server.

```sh
git clone https://github.com/KaunajB/url-health-checker.git
cd url-health-checker
npm i
```

## Setup

Make changes to config.json file.
* IP: IP Address for starting the server
* PORT: Port on which the server should listen
* OUTPUT_FILE_NAME: The name of the file where you want to store logs, without any extension
* MODE: **server** if you're running on Linux machine, **local** if running on local machine
* URLS: [Array]
  * `BASE_URL`: The base url for the app you want to test, including the NGINX route (eg. https://example.com/my-app)
  * `PATH`: The path for the app you want to test, everything after the base url (eg. /users/myUser/)
  * `BOT_HEALTH_CHECK`: **true** if the app is a chatbot, otherwise **false**

```json
{
  "IP": "127.0.0.1",
  "PORT": 9000,
  "OUTPUT_FILE_NAME": "output",
  "MODE": "server",
  "URLS": [
    {
      "BASE_URL": "https://myhappynation.in/calculators",
      "PATH": "/fullpage/souvik/my-samsung-care-plan/",
      "BOT_HEALTH_CHECK": true
    },
    {
      "BASE_URL": "https://myhappynation.in/builder",
      "PATH": "/",
      "BOT_HEALTH_CHECK": true
    },
    {
      "BASE_URL": "https://myhappynation.in/builderx",
      "PATH": "/",
      "BOT_HEALTH_CHECK": false
    }
  ]
}
```

## Deployment

_**For Development**_

```sh
npm start
```

_**For Production**_

```sh
sudo apt-get install chromium-browser
cd url-health-checker
npm i
pm2 start healthCheck.js --name url-health-checker
```

## Usage

Start the server, open browser and go to the url: http://localhost:9000/
