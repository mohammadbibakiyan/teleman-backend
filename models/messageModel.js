const mongoose=require("mongoose");
 
const messageSchema=new mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:[true,"پیام باید متعلق به یک گفتگو باشد"]
    },
    type:{
        type:String,
        enum:["message","service"],
        default:"message"
    },
    from:String,
    from_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"پیام باید متعلق به یک فرد باشد"]
    },
    forwarded_from:String, //"کانال سیب"
    reply_to_message_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    file:String,//file path
    mime_type:String,//"video/mp4", "application/pdf", "image/png"
    text:String
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

const Message=mongoose.model("Message",messageSchema);
module.exports=Message;