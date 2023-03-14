const jwt=require("jsonwebtoken");
const { StatusCodes} = require("http-status-codes");

const catchAsync=require("../utils/catchAsync");
const User=require("../models/userModel");
const AppError=require("./../utils/appError")
const {deleteInvalidProperty}=require("./../utils/functions");
const {addContact} =require("./../validation/userValidation");

const signToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
  
const createSendToken = (user, statusCode, res,message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure:true,
    httpOnly: true,
    sameSite: "none",
    // secure:false
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({ status: "success", data: user ,message:message||"ورود با موفقیت انجام شد",token });
};

exports.protect=catchAsync(async(req,res,next)=>{
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if(!token) return next(new AppError("لطفا وارد حساب کاربری خود شوید",401));
  const decode=jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(decode._id);
  if(!user) return next(new AppError("کاربری با این مشخصات یافت نشد",404));
  req.user=user;
  next();
});

exports.getOtp=catchAsync(async(req,res,next)=>{    
  const {phone_number}=req.body;
  const user=await User.findOne({phone_number});
  const code=Math.floor(Math.random()*90000+10000);
  if(!user) await User.create({phone_number,otp:{code,expires_in:(Date.now()+120000)}});
  if(user) await User.updateOne({phone_number},{otp:{code,expires_in:Date.now()+120000}});
  res.status(StatusCodes.OK).json({status:"success",code,message:"کد با موفقیت برای شما ارسال شد"});
});

exports.checkOtp=catchAsync(async(req,res,next)=>{    
  const {phone_number,code}=req.body;
  const user=await User.findOne({phone_number});
  if(!user) return next(new AppError("کاربری یافت نشد",404));
  if(!(user.otp.code===code))return next(new AppError("کد وارد شده صحیح نمی باشد",400));
  if(Date.now()>user.otp.expires_in)return  next(new AppError("انقضای کد به پایان رسیده است",400));
  await createSendToken(user,StatusCodes.OK,res,"ورود با موفقیت انجام شد");
});

exports.updateMe=catchAsync(async(req,res,next)=>{
  let profile_pictures;
  if(req.file) profile_pictures=[{photo:`/img/users/${req.file.filename}`}];
  const data=deleteInvalidProperty({...req.body,profile_pictures},["first_name","last_name","username","profile_pictures"]);
  await User.findByIdAndUpdate(req.user._id,data);
  res.status(StatusCodes.OK).json({status:"success",message:"تغییرات با موفقیت انجام شد"});
});

exports.addContact=catchAsync(async(req,res,next)=>{
  const data=deleteInvalidProperty(req.body,["first_name","last_name","phone_number"]);
  await addContact.validateAsync(data);
  if(req.user.phone_number===data.phone_number) return next(new AppError("امکان افزودن شماره خودتان به عنوان مخاطب وجود ندارد",400))
  const user=await User.findOne({phone_number:data.phone_number});
  if(!user) return next(new AppError("کاربر مورد نظر در تل من حسابی ندارد",400));
  const contact=await User.findOne({_id:req.user._id,"contacts.phone_number":data.phone_number});
  if(contact) return next(new AppError("کاربر در لیست مخاطبین شما وجود دارد",400))
  await User.findByIdAndUpdate(req.user._id,{$push:{contacts:{...data,user:user._id}}});
  res.status(StatusCodes.OK).json({status:"success",message:"کاربر مورد نظر به لیست مخاطبین تان افزوده شد"})
});

exports.getMe=catchAsync(async(req,res,next)=>{
  const user=await User.findById(req.user._id).populate("contacts.user","profile_pictures");
  if(!user) return next(new AppError("کاربری یافت نشد"));
  res.status(StatusCodes.OK).json({status:"success",data:user});
});