const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
  
    
    const updateData = { ...req.body };
    console.log(req.body);
    
 

    // Single atomic update operation
    const updatedCustomer = await customerSchema.findByIdAndUpdate(
      id,
      {
        $set: updateData, // Update top-level fields
      
      },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "This customer doesn't exist" });
    }

    res.status(200).json({ 
      message: "Customer updated successfully", 
      updatedCustomer 
    });

    // Notify admins (same as before)
    const admins = await userSchema.find({ });
    const notifications = admins.map(admin => ({
      user: admin._id,
      employee: req.token?.id,
      levels: "clients",
      type: "update",
      allowed: updatedCustomer?._id,
      message: "تم تعديل بيانات الاتصال ",
    }));

    await notificationSchema.insertMany(notifications);

  } catch (error) {
    next(error);
  }
};
module.exports = updateCustomer;