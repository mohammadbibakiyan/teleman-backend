const { StatusCodes} = require("http-status-codes");

const catchAsync=require("./../utils/catchAsync");
const Message=require("./../models/messageModel")


exports.createMessage=catchAsync(async(req,res,next)=>{
  const {chat,from,text,reply_to_message_id,forwarded_from}=req.body
  await Message.create({chat,from:req.user.first_name,from_id:req.user._id,text,reply_to_message_id,forwarded_from});
  res.status(StatusCodes.OK).json({status:"success"});
})

