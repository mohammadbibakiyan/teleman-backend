const express=require("express");
const http=require("http");
const cors=require("cors");
const app=express();
const path=require("path")
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const socketIo=require("socket.io");
const cookieParser = require('cookie-parser')

const userRouter=require("./routers/userRouter");
const messageRouter=require("./routers/messageRouter");
const chatRouter=require("./routers/chatRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: "./config.env" });
app.use(cors({credentials:true,origin:"http://127.0.0.1:3000"}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DATABASE).then(()=>console.log("connect to database successfully")).catch(e=>console.log("connect to database failed"));

const server=http.createServer(app)
const io = socketIo(server,{ cors:{ origin:'http://localhost:3000', methods: ['GET','POST']} });

app.use("/api/v1/users",userRouter);
app.use("/api/v1/chats",chatRouter);
app.use("/api/v1/messages",messageRouter);
app.use("*",(req,res,next)=>next(new AppError("مسیری یافت نشد",404)))
app.use(globalErrorHandler)
io.on("connection",(socket)=>{
    console.log("connect to soket "+socket.id);
    socket.on("sendMessage",(message)=>{
        socket.broadcast.emit("sendMessage",message);
    })
});

server.listen(4000,()=>{
    console.log("connect to server");
});