const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String,required:[true,"وارد کردن نام الزامی است"] },
  lastName: { type: String },
  phoneNumber: { type: Number, unique: true, required:[true,"افزودن شماره الزامی است"]},
  userName: { type: String, unique: true, lowerCase:true },
  profilePictures: [{
    date: {type:Date},
    photo: String,
  }],
  gap: [{
    type:mongoose.Schema.Types.objectId,
    ref:"Gap"
  }],
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
