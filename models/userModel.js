const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  phone_number: { type: String, unique: true, required:[true,"افزودن شماره الزامی است"]},
  username: { type: String, unique: true, lowerCase:true },
  profile_pictures: [{
    date: {type:Date,default:Date.now()},
    photo: String,
  }],
  contacts:[
    {
      user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      first_name: { type: String},
      last_name: { type: String },
      phone_number: { type: String},
    },
  ], 
  // chats: [{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"Chat"
  // }],
  otp : {
    code : String,
    expires_in : Date
  },
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
