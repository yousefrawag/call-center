const { startOfDay, endOfDay } = require("date-fns");
const User = require("../model/userSchema");
const Project = require("../model/projectSchema");
const Customer = require("../model/customerSchema");

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);

    // 🔹 Mission Stats
    const ActiveEstbilshment = await Project.countDocuments({ stauts: "ACTIVE" });
    const SUSPENDEDEstbilshment = await Project.countDocuments({ stauts: "SUSPENDED" });
    const EXPIREDestbilshement = await Project.countDocuments({ stauts: "EXPIRED" });
    const Contactcount = await Customer.countDocuments();

    // 🔹 General Stats
    const totalCustomers = await Customer.countDocuments();
    const totalUsers = await User.countDocuments();

    // 🔹 Today Customers Count
    const todayCustomers = await Customer.countDocuments({
      createdAt: { $gte: startToday, $lte: endToday },
    });

    const customerStatus = await Customer.aggregate([
      {
        $group: {
          _id: "$EstbilshSatuts",
          count: { $sum: 1 },
        },
      },
    ]);

    const organizationStates = await Customer.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "customer",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $group: {
          _id: "$project.stauts",
          count: { $sum: 1 },
        },
      },
    ]);

    // 🔹 Send Response
    res.json({
      success: true,
      ActiveEstbilshment,
      SUSPENDEDEstbilshment,
      EXPIREDestbilshement,
      Contactcount,
      totalCustomers,
      totalUsers,
      todayCustomers, // ← عدد العملاء المضافين اليوم
      customerStatus,
      organizationStates,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getDashboardStats };
