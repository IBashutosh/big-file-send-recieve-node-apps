const clientUrl = "http://127.0.0.1:3000";
const { sendFile, connectToClient } = require("./sender.js");
sendFile(connectToClient(clientUrl), "test.txt");
