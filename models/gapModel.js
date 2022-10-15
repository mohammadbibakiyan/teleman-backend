const mongoose=require("mongoose");
const gapSchema=new mongoose.Schema({
    name:String,
    type:{
        type:String,
        enum:["personal_chat","public_channel","public_supergroup"],
        required:[true,"نوع گفتگو باید مشخص باشد"]
    },
    users:[{
        type:mongoose.Schema.Types.objectId,
        ref:"User"
    }]
},{
    toJson: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true 
});

const Gap=mongoose.model("Gap",gapSchema);
module.exports=Gap;