// jsforce proxy server for development
const jsforceAjaxProxy = require("jsforce-ajax-proxy");
const express = require("express");
const app = express();
const port = 3050;

app.use(jsforceAjaxProxy({ enableCORS: true }));
app.listen(port, function(err) {
  if (err) return console.error(err);
  console.log(`jsforce proxy server is running at: http://localhost:${port}`);
});
