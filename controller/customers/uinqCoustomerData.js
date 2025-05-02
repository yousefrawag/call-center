const customerSchema = require("../../model/customerSchema");
const uinqCoustomerData = async (req, res, next) => {
  try {
    
    const Customers = await customerSchema.find({})
  
    
    res.status(200).json({ data:Customers });
  } catch (error) {
    next(error);
  }
};
module.exports = uinqCoustomerData;
