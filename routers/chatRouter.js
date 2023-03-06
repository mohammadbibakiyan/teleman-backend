const express=require("express");
const chatRouter=express.Router();
const userController=require("./../controllers/userController");
const chatController=require("./../controllers/chatController");

chatRouter.use(userController.protect);
chatRouter.get("/",chatController.getAllChats);
chatRouter.post("/",chatController.createChat);
chatRouter.get("/:id",chatController.getChat)


module.exports=chatRouter;