const fs = require("fs");
const path = require("path");
const progress = require("progress-stream");
const express = require("express");
const ss = require("socket.io-stream");
const createServer = (port = 3000) => {
  const app = express();
  const http = require("http").Server(app);
  const io = require("socket.io")(http);

  io.on("connection", (socket) => {
    console.log("[file reciever] sender connected");

    socket.on("message", (msg) => {
      console.log(`[file reciever] received '${msg}'`);
      socket.emit("message", msg);
    });

    ss(socket).on("data", (readablestream, fileName) => {
      socket.emit("message", "new file recieved");
      const str = progress({
        time: 1000,
      });

      str.on("progress", function (progress) {
        console.log(progress);
      });
      const writableStream = fs.createWriteStream(path.resolve(fileName));
      readablestream.pipe(str).pipe(writableStream);
      writableStream.on("finish", () => {
        console.log("new file recieved");
        socket.emit("message", "new file recieved");
      });
    });

    socket.on("disconnect", () => {
      console.log("[file reciever] sender disconnected");
    });
  });

  http.listen(port, () =>
    console.log(`[file reciever] listening on port ${port}`)
  );
  return {
    close: () => http.close(() => console.log("[file reciever] closed")),
  };
};

module.exports = { createServer };
