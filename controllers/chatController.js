exports.createChat=catchAsync(async(req,res,next)=>{
  const {name,type}=req.body
  await Message.create({name,type,admin:req.user._id});
  res.status(StatusCodes.OK).json({status:"success"});
})
 