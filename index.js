var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  }); 

socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id); 

  socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server đang chay');
});