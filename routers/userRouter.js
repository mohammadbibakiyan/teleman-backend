const express=require("express");
const userRouter=express.Router();
const userController=require("./../controllers/userController");
const {uploadUserPhoto}=require("./../utils/uploadUserPhoto")

userRouter.route("/getOtp").post(userController.getOtp);
userRouter.route("/checkOtp").post(userController.checkOtp);
userRouter.use(userController.protect)
userRouter.route("/updateMe").patch(uploadUserPhoto.single('image'),userController.updateMe);
userRouter.route("/addContact").post(userController.addContact);
userRouter.route("/getMe").get(userController.getMe);

module.exports=userRouter;