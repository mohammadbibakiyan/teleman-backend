const Joi=require("joi");
const AppError=require("./../utils/appError");

const addContact=Joi.object({
  phone_number:Joi.string().required().length(13).error(new AppError("فرمت شماره تلفن اشتباه است",400)),
  first_name:Joi.string().min(3).required().error(new AppError("فیلد نام مخاطب اشتباه است",400)),
  last_name:Joi.allow()
});

module.exports={
  addContact
}