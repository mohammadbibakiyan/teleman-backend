exports.deleteInvalidProperty=(data = {}, whiteList = [])=>{
  let nullishData = ["", " ", "0", 0, null, undefined]
  Object.keys(data).forEach(key => {
      if (!whiteList.includes(key)) delete data[key]
      if (nullishData.includes(data[key])) delete data[key];
  });
  return data;
}