const express=require("express");
const userRouter=express.Router();
const userController=require("./../controllers/userController");
const {uploadUserPhoto}=require("./../utils/uploadUserPhoto")

userRouter.route("/getOtp").post(userController.getOtp);
userRouter.route("/checkOtp").post(userController.checkOtp);
userRouter.route("/updateMe").patch(userController.protect,uploadUserPhoto.single('image'),userController.updateMe);

module.exports=userRouter;