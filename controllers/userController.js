const jwt=require("jsonwebtoken");
const { StatusCodes} = require("http-status-codes");
const createHttpError = require("http-errors");

const catchAsync=require("../utils/catchAsync");
const User=require("../models/userModel");
const {deleteInvalidProperty}=require("./../utils/functions");

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
    user.password = undefined;
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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if(!token) return next(createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید"));
  const decode=jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(decode._id);
  if(!user) return next(createHttpError.NotFound("کاربری با این مشخصات یافت نشد"));
  req.user=user;
  next();
});

exports.getOtp=catchAsync(async(req,res,next)=>{    
  const {phone_number}=req.body;
  const user=await User.findOne({phone_number});
  const code=Math.floor(Math.random()*90000+10000);
  if(!user) await User.create({phone_number,otp:{code,expires_in:(Date.now()+120000)}});
  if(user) await User.updateOne({phone_number},{otp:{code,expires_in:Date.now()+120000}});
  res.status(StatusCodes.OK).json({code,message:"کد با موفقیت برای شما ارسال شد"});
});

exports.checkOtp=catchAsync(async(req,res,next)=>{    
  const {phone_number,code}=req.body;
  const user=await User.findOne({phone_number});
  if(!user) return next(createHttpError.NotFound("کاربری یافت نشد"));
  if(!user.otp.code===code)return  next(createHttpError.BadRequest("کد وارد شده صحیح نمی باشد"));
  if(Date.now()>user.otp.expires_in)return  next(createHttpError.BadRequest("انقضای کد به پایان رسیده است"));
  await createSendToken(user,StatusCodes.OK,res,"ورود با موفقیت انجام شد");
});

exports.updateMe=catchAsync(async(req,res,next)=>{
  let profile_pictures;
  if(req.file) profile_pictures=[req.file.path.replace("\\","/")];
  const data=deleteInvalidProperty({...req.body,profile_pictures},["first_name","last_name","username","profile_pictures"]);
  const user=await User.updateOne({id:req.user._id},data);
  res.status(StatusCodes.OK).json({message:"تغییرات با موفقیت انجام شد",user});
})