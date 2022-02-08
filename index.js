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
    socketIo.to(socket.id).emit("get_id", socket.id)

    //update socket id to database
    socket.on('update_socket_id', function (data) {
        fetch(`${API_URI}/user/update-socket-id`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${data._token}`,
            },
            body: JSON.stringify({ socket_id: data.socket_id }),
        })
            .then(res => res.json())
            .then(function (response) {
                socketIo.to(data.socket_id).emit('update_socket_id_success', response.data);
            })
            .catch(err => {
                socketIo.to(data.socket_id).emit('socket_error', err);
                console.log('Update socket id: ', err);
            })
    });

    socket.on('send_friend_request', function (data) {
        socketIo.to(data.receiver_socket_id).emit('receive_friend_request', data.sender_info);
    });

    socket.on('update_history_chat_list_client', function (data) {
        socket.to(data.room).emit('update_history_chat_list_server', 'Call api get history chat list');
    });

    socket.on('join_room', function (room) {
        socket.join(room);
    });

    socket.on("send_message_client", function (data) {
        socket.to(data.room_key).emit('send_message_server', data.message);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server đang chay');
});