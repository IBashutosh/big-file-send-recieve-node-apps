const { createServer } = require("http");
const { io: Client } = require("socket.io-client");
const { Server } = require("socket.io");
const { assert } = require("chai");
const { connectToClient, sendFile } = require("../sender");

describe("Sender tests", () => {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = connectToClient(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.close();
  });

  it("after file send should work", (done) => {
    serverSocket.on("message", (arg) => {
      assert.equal(arg, "File Send Completed");
      done();
    });
    sendFile(clientSocket, "test.txt");
  });

  it("event should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("test");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "test");
      done();
    });
  });
});
