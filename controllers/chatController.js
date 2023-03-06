const {StatusCodes}=require("http-status-codes")

const catchAsync=require("./../utils/catchAsync")
const {deleteInvalidProperty} =require("./../utils/functions")
const Chat=require("./../models/chatModel")

exports.createChat=catchAsync(async(req,res,next)=>{
  const data=deleteInvalidProperty({...req.body},["name","type","users"]);
  const chat=await Chat.create({...data,admin:req.user._id});
  res.status(StatusCodes.OK).json({status:"success",data:chat});
});
 
exports.getChat=(catchAsync(async(req,res,next)=>{
  const {id}=req.params;
  const chat=await Chat.findById(id).populate("messages");
  res.status(StatusCodes.OK).json({status:"success",data:{...chat._doc,messages:chat.messages}})
}));

exports.getAllChats=catchAsync(async(req,res,next)=>{
  const chats=await Chat.find({users:{"$in": [req.user._id]}},["name","type","picture"])
  res.status(StatusCodes.OK).json({status:"success",chats})
})