const express=require("express");
const chatRouter=express.Router();
const userController=require("./../controllers/userController");
const chatController=require("./../controllers/chatController");

chatRouter.use(userController.protect);
chatRouter.post("/",chatController.createChat);
// chatRouter.post("/:id",chatController.getAllMessages)


module.exports=chatRouter;