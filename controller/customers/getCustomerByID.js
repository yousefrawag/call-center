const customerSchema = require("../../model/customerSchema");
const getCustomerByID = async (req, res , next) => {
  try {
    const { id } = req.params;
    const customer = await customerSchema.findById(id).populate("customer").populate("addedBy")
  
    if (!customer) {
    return  res.status(404).json({ message: "Customer desn't exist" });
    }
  return  res.status(200).json({data: customer });
  } catch (error) {
    next(error);
  }
};

module.exports = getCustomerByID;
