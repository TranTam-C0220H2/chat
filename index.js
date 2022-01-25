var express = require('express')
const http = require("http");
var app = express();
const server = http.createServer(app);

const API_URI = 'http://apichatapp.hanbienc.com/api';

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

const fetch = require('node-fetch');

socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
    // import fetch from "node-fetch";
    console.log("New client connected" + socket.id);
    socketIo.to(socket.id).emit("getId", {data: socket.id})

    //update socket id to database
    socket.on('update_socket_id', function (data) {
        console.log('update_socket_id', data)
        fetch(`${API_URI}/user/update-socket-id`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${data._token}`,
            },
            body: { socket_id: data.socket_id }
        })
            .then(res => res.json())
            .then(function (response) {
                console.log('response__', response)
            })
            .catch(err => {
                socketIo.to(data.socket_id).emit('socket_error', err);
                console.log('Update socket id: ', err);
            })
    });

    socket.on('create_room_group', function (_token, room_key, members) {

    });

    socket.on('join_room', function (room) {
        console.log('client join room = ' + room)
        socket.join(room);
    });

    socket.on("send_data_client", function (data) { // Handle khi có sự kiện tên là sendDataClient từ phía client

        socketIo.emit("send_data_server", {data});// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server đang chay');
});