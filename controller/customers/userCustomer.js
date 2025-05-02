const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema")
const getUserCustomer = async (req, res, next) => {
  try {
    console.log("Token ID:", req.token.id);
    

    const data = await customerSchema.find({addedBy:req.token.id}).populate("customer")
    .populate("addedBy");;
       const APPROVEDContact = await customerSchema.countDocuments({addedBy:req.token.id ,  EstbilshSatuts: "APPROVED" });
        const REJECTEDContact = await customerSchema.countDocuments({addedBy:req.token.id , EstbilshSatuts: "REJECTED" });
        const NEUTRALContact = await customerSchema.countDocuments({addedBy:req.token.id , EstbilshSatuts: "NEUTRAL" });
        const NoresponesContact = await customerSchema.countDocuments({addedBy:req.token.id , EstbilshSatuts: "NO_RESPONSE" });

    if (!data.length) {
      return res.status(404).json({ message: "Customer doesn't exist" });
    }

    res.status(200).json({ data  , APPROVEDContact ,REJECTEDContact , NEUTRALContact , NoresponesContact });
  } catch (error) {
    next(error);
  }
};


module.exports = getUserCustomer;
