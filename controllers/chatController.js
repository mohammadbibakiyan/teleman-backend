const {StatusCodes}=require("http-status-codes")

const catchAsync=require("./../utils/catchAsync")
const {deleteInvalidProperty} =require("./../utils/functions")
const Chat=require("./../models/chatModel")

exports.createChat=catchAsync(async(req,res,next)=>{
  const data=deleteInvalidProperty({...req.body},["name","type","users"]);
  await Chat.create({...data,admin:req.user._id});
  res.status(StatusCodes.OK).json({status:"success"});
})
 
// exports.getAllMessages=(catchAsync(async(req,res,next)=>{
//   const {id}=req.params;
//   const messages=await Message.findById(id).populate("messages");
//   res.status(StatusCodes.OK).json({status:"success",data:{...messages._doc}})
// }))