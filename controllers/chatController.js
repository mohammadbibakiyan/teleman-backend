const {StatusCodes}=require("http-status-codes");

const catchAsync=require("./../utils/catchAsync");
const {deleteInvalidProperty} =require("./../utils/functions");
const Chat=require("./../models/chatModel");
const User=require("./../models/userModel");
const Message=require("./../models/messageModel")

exports.createChat=catchAsync(async(req,res,next)=>{
  const data=deleteInvalidProperty({...req.body},["name","type","users"]);
  data.users.push(req.user._id);
  let chat=await Chat.findOne({users:{$all:data.users}});
  if(!chat) chat=await Chat.create({...data,admin:req.user._id});
  res.status(StatusCodes.OK).json({status:"success",data:chat});
});
 
exports.getChat=catchAsync(async(req,res,next)=>{
  const {id}=req.params;
  let chat=await Chat.findById(id).populate("messages").lean();
  chat.messages=chat.messages.map(e=>{return{...e,owner:req.user._id.equals(e.from_id)}});
  if(chat.type==="personal_chat"){
    const [userId]=chat.users.filter(e=>!e._id.equals(req.user._id));
    const user=await User.findById(userId,["first_name","last_name","profile_pictures"]);
    chat={...chat,name:user.first_name+" "+user.last_name,picture:user.profile_pictures[0]?.photo}
  }
  res.status(StatusCodes.OK).json({status:"success",data:chat})
});

exports.getAllChats=catchAsync(async(req,res,next)=>{
  let chats=await Chat.find({users:{"$in": [req.user._id]}},["name","type","picture","users"]).lean();
  chats=await Promise.all(chats.map(async e=>{
    if(e.type==="personal_chat"){
      const [userId]=e.users.filter(e=>!e._id.equals(req.user._id));
      const user=await User.findById(userId,["first_name","last_name","profile_pictures"]).lean();
      const last_message=await Message.findOne({chat:e._id},["createdAt","text"],{ sort: { 'createdAt' : -1 }}).lean();
      return{...e,name:user.first_name+" "+user.last_name,picture:user.profile_pictures[0]?.photo,last_message}
    }
    return e;
  }))
  res.status(StatusCodes.OK).json({status:"success",data:chats})
});