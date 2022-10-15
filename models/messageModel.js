const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    gap:{
        type:mongoose.Schema.Types.objectId,
        ref:"Gap",
        required:[true,"پیام باید متعلق به یک گفتگو باشد"]
    },
    type:{
        type:String,
        enum:["message","service","file"],
        default:"message"
    },
    from:String,
    fromId:{
        type:mongoose.Schema.Types.objectId,
        ref:"User",
        required:[true,"پیام باید متعلق به یک فرد باشد"]
    },
    replyToMessageId:{
        type:mongoose.Schema.Types.objectId,
        ref:"Message"
    },
    content:String
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

const Message=mongoose.model("Message",messageSchema);
module.exports=Message;