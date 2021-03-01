var express = require("express");
var fs = require("fs");
var app = express();
var port = 3000;

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

app.listen(port, () => {
  console.log("Server Start, Port: " + port);
});

app.get("/", (_req, res) => {
  fs.readFile("index.html", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});
