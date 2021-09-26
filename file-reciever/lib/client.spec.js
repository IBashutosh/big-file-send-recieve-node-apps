const { expect } = require("chai");
const io = require("socket.io-client");
const { createServer } = require("../client.js");
const socketUrl = "http://localhost:3000";

describe("File reciever test", function () {
  this.timeout(3000);
  const fs = require("fs");
  const path = require("path");
  var progress = require("progress-stream");
  const ss = require("socket.io-stream");
  const fileName = "test.txt";
  let server;
  let sockets;
  beforeEach(() => {
    sockets = [];
    server = createServer();
  });
  afterEach(() => {
    sockets.forEach((e) => e.disconnect());
    server.close();
  });

  const makeSocket = (id = 0) => {
    const socket = io.connect(socketUrl, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log(`[client ${id}] connected`);
    });
    socket.on("disconnect", () => {
      console.log(`[client ${id}] disconnected`);
    });
    sockets.push(socket);
    return socket;
  };

  const makeFileReadableStream = () => {
    console.log(path.resolve(fileName));
    const readablestream = fs.createReadStream(path.resolve(fileName));
    return readablestream;
  };

  const makeStream = () => {
    const stream = ss.createStream();
    return stream;
  };

  it("should echo a message to a client", (done) => {
    const socket = makeSocket();
    socket.emit("message", "hello world");
    socket.on("message", (msg) => {
      console.log(`[client] received '${msg}'`);
      expect(msg).to.equal("hello world");
      done();
    });
  });

  it("should recieve file to a client", (done) => {
    const socket = makeSocket();
    const readablestream = makeFileReadableStream();
    const stream = makeStream();
    var str = progress({
      time: 1000,
    });

    str.on("progress", function (progress) {
      console.log(progress);
    });
    ss(socket).emit("data", stream, fileName);
    readablestream.pipe(str).pipe(stream);
    readablestream.on("end", () => {
      console.log("File Send Completed");
    });
    socket.on("message", (msg) => {
      console.log(`[client] received '${msg}'`);
      expect(msg).to.equal("new file recieved");
      done();
    });
  });

  it("should echo messages to multiple clients", () => {
    const sockets = [...Array(5)].map((_, i) => makeSocket(i));

    return Promise.all(
      sockets.map(
        (socket, id) =>
          new Promise((resolve, reject) => {
            const msgs = [..."abcd"].map((e) => e + id);
            msgs.slice().forEach((e) => socket.emit("message", e));

            socket.on("message", (msg) => {
              console.log(`[client ${id}] received '${msg}'`);
              expect(msg).to.equal(msgs.shift());

              if (msgs.length === 0) {
                resolve();
              }
            });
          })
      )
    );
  });
});
