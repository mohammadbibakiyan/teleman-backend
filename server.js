const express=require("express");
const socketIo=require("socket.io");
const http=require("http");
const app=express();
const cors=require("cors");

app.use(express.json());
app.use(cors());
const server=http.createServer(app)
const io = socketIo(server,{ cors:{ origin:'http://localhost:3000', methods: ['GET','POST']} });

io.on("connection",(socket)=>{
    console.log("connect to soket "+socket.id);
    socket.on("sendMessage",(message)=>{
        socket.broadcast.emit("sendMessage",message);
    })
});

server.listen(4000,()=>{
    console.log("connect to server");
});