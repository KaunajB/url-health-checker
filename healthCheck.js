const fs = require("fs");
const express = require("express");
const puppeteer = require("puppeteer");
const config = require("./config.json");
const util = require("util");
const log_file = fs.createWriteStream(
  __dirname + `/${config.OUTPUT_FILE_NAME}.log`,
  { flags: "w" }
);

const log = function (d) {
  log_file.write(util.format(d) + "\n");
};

const app = express();
const port = config.PORT || 3000;
const ipaddress = config.IP || "127.0.0.1";

const endLine =
  "\n\n=====================================================================================================================\n";

const puppeteerOptions = {
  devtools: true,
  headless: true
};
if (config.MODE === "server") {
  puppeteerOptions.args = ["--no-sandbox"];
  puppeteerOptions.executablePath = "/usr/bin/chromium-browser";
}

app.get("/", (req, res) => {
  let logOutput = `[ ${new Date().toLocaleString()} ]\n`;
  Promise.all(config.URLS.map((url) => checkUrl(url)))
    .then((results) => {
      logOutput += results.join("\n");
      logOutput += endLine;
      log(logOutput);
      return res.send(`<pre>${logOutput}</pre>`);
    })
    .catch((e) => {
      console.log("error", e);
      try {
        JSON.parse(e);
        logOutput += "\n" + JSON.stringify(e);
      } catch (err) {
        logOutput += "\n" + e;
      }
      logOutput += endLine;
      log(logOutput);
      return res.send(`<pre>${logOutput}</pre>`);
    });
});

function checkUrl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("URL", url);
      let output = `\nURL :\n${url.BASE_URL + url.PATH}\nBACKEND :`;
      const browser = await puppeteer.launch(puppeteerOptions);
      const page = await browser.newPage();

      page
        .on(
          "console",
          (message) =>
          (output +=
            "\n" +
            `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
        )
        .on("pageerror", ({ message }) => (output += "\n" + message))
        .on("response", async (response) => {
          output +=
            "\n" +
            `${response.status()} ${response.url()}${response.url().endsWith("/healthCheck")
              ? "\n" + JSON.stringify(await response.json()) + "\nFRONTEND :"
              : ""
            }`;
        })
        .on(
          "requestfailed",
          (request) =>
          (output +=
            "\n" + `${request.failure().errorText} ${request.url()} `)
        );

      if (url.BOT_HEALTH_CHECK) {
        await page.goto(url.BASE_URL + "/healthCheck");
      }
      await page.goto(url.BASE_URL + url.PATH);
      return resolve(output);
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  });
}

const server = app.listen(port, ipaddress, () => {
  console.log(`Server started on ${ipaddress}:${port}`);
});
