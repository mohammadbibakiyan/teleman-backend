const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `نامعتبر است${err.path}:${err.value} مسیر`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyValue)[0];
  const message = `مقدار ${err.keyValue[`${value}`]} از قبل وجود دارد.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${errors.join("، ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("توکن نامعتبر است، لطفا مجدد وارد شوید", 401);

const handleJWTExpiredError = () =>
  new AppError("توکن منقضی شده است، لطفا مجدد وارد شوید", 401);

const sendErrorDev = (err, req, res) => {
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  }
  return res.status(500).json({
    status: "error",
    message: "مشکلی پیش آمده لطفا مجددا تلاش کنید",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  if (error.name === "CastError") error = handleCastErrorDB(error);//invalid path
  if (error.name === "ValidationError") error = handleValidationErrorDB(error); //validation error in database
  if (error.code === 11000) error = handleDuplicateFieldsDB(error); //duplicate for uniqe data in database
  if (error.name === "JsonWebTokenError") error = handleJWTError(); //token is invalid error
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError(); //expired token error
  sendErrorDev(error, req, res);
};
