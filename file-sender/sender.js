const io = require("Socket.io-client");
const fs = require("fs");
const path = require("path");
const ss = require("Socket.io-stream");
const progress = require("progress-stream");
const connectToClient = (socketUrl = "http://127.0.0.1:3000") => {
  let clientSocket = io(socketUrl);
  clientSocket.on("connect", () => {
    console.log(
      "Sockect id at sender side when connected with reciever,",
      clientSocket.id
    );
  });

  clientSocket.on("message", (arg) => {
    console.log("message,", arg);
  });

  clientSocket.on("disconnect", (reason) => {
    console.log(
      "Sockect id at sender side when disconnected with reciever,",
      clientSocket.id
    );
    console.log("Is clientSocket connected", clientSocket.connected);
    if (reason === "io server disconnect") {
      clientSocket.connect();
    }
  });

  clientSocket.on("reconnect_attempt", () => {
    // ...
    console.log("Reconnect Event attempt");
  });

  clientSocket.on("reconnect", () => {
    // ...
    console.log("Reconnect Event");
  });

  clientSocket.on("error", (err) => {
    console.log("Socket error ", err);
  });
  return clientSocket;
};
const sendFile = (clientSocket, fileName) => {
  const stat = fs.statSync(fileName);
  console.log("File name: ", fileName);
  var str = progress({
    length: stat.size,
    time: 100 /* ms */,
  });

  str.on("progress", function (progress) {
    console.log(progress);
  });
  const readablestream = fs.createReadStream(path.resolve(fileName));
  const stream = ss.createStream();
  ss(clientSocket).emit("data", stream, fileName);
  readablestream.pipe(str).pipe(stream);
  readablestream.on("end", () => {
    console.log("File Send Completed");
    clientSocket.emit("message", "File Send Completed");
  });
};
module.exports = { connectToClient, sendFile };
