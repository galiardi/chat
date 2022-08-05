const events = require("events");
const fs = require("fs");
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 8000;

const chatEmitter = new events.EventEmitter();

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
/*
app.get("/static/*", (req, res) => {
  
  // res.sendFile(path.join(__dirname, "public", req.params[0]));
  
  const fileName = `${__dirname}/public/${req.params[0]}`;
  fs.createReadStream(fileName)
    .on("error", () => {
      res.end("Not Found");
    })
    .pipe(res);
});
*/
app.get("/chat", (req, res) => {
  const { message } = req.query;
  chatEmitter.emit("message", message);
  res.end();
});

app.get("/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on("message", onMessage);

  res.on("close", () => chatEmitter.off("message", onMessage));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
