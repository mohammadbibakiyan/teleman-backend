const AppError=require("./../utils/appError");
const multer =require("multer");

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/img/users');
  },
  filename:(req,file,cb)=>{
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const fileFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    cb(new AppError("لطفا یک عکس وارد کنید",400))
  }
}

exports.uploadUserPhoto=multer({
  storage,
  fileFilter
})
