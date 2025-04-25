const customerSchema = require("../../model/customerSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const projectSchema  = require("../../model/projectSchema"); // Module has 12000 data

const addCustomer = async (req, res, next) => {
  try {
    console.log(req.body);

    // Save the single customer data from req.body
    let customer = new customerSchema(req.body);
    customer.addedBy = req.token?.id;
    await customer.save();
console.log("customer.customer" , customer.customer);

    // ✅ Update the related project (institution) to mark as called
    await projectSchema.findByIdAndUpdate(req.body.customer, { hasBeenCalled: true });

    // ✅ Send response
    res.status(200).json({
      message: `${req.body.customer}  created successfully`,
      body:req.body,
      customer,
    });

    // // ✅ Notify all admins
    // const admins = await userSchema.find({});
    // const notifications = admins.map((admin) => ({
    //   user: admin._id,
    //   employee: req.token?.id,
    //   levels: "clients",
    //   type: "add",
    //   allowed: customer._id,
    //   message: "تم إجراء  إتصال جديد",
    // }));

    // await notificationSchema.insertMany(notifications);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = addCustomer;
