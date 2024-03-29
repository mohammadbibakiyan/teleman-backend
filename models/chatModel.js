const mongoose=require("mongoose");
const chatSchema=new mongoose.Schema({
    name:String, 
    type:{
        type:String,
        enum:["personal_chat","public_channel","public_group"],
        required:[true,"نوع گفتگو باید مشخص باشد"]
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    picture:String,
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

chatSchema.virtual("messages", {
    ref: "Message",
    foreignField: "chat",
    localField: "_id",
});

const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;