const express=require("express");
const messageRouter=express.Router();

const messageController=require("./../controllers/messageController");
const userController=require("./../controllers/userController")


module.exports=messageRouter;