const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io"); //Socket
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, { //server initialization as io variable
  cors: { //to solve cors issue
    origin: "http://localhost:3002/chat", // frontend server
    methods: ["GET", "POST"], //accepts GET and POST requests
  },
});

io.on("connection", (socket) => { //we listen on event with this id 
  console.log(`User Connected: ${socket.id}`);   // shows whenever frontend is refreshed

  socket.on("join_room", (data) => { //data from frontend, like room id
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`); //socket.id is user id, data: data that has been sent from frontend
  });

  socket.on("send_message", (data) => {
   // console.log(data) //event Send Message receives data sent from frontend
    socket.to(data.room).emit("receive_message", data); //emits event to be listened in frontend
  }); /// data.room: restricts emit event to room that was passed in as data

  socket.on("disconnect", () => {  //disconnects from server
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3002, () => {
  console.log("SERVER RUNNING");
});
