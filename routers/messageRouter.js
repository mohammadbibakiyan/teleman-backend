const express=require("express");
const messageRouter=express.Router();

const messageController=require("./../controllers/messageController");
const userController=require("./../controllers/userController")

messageRouter.use(userController.protect)
messageRouter.post("/",messageController.createMessage)

module.exports=messageRouter;