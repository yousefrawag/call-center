const customerSchema = require("../../model/customerSchema");
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

const SelectCustomer = async (req, res, next) => {
  try {
    const { dateFilter, field, searchTerm } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();
    let dateMatch = {};

    if (dateFilter === "يومى") {
      dateMatch.createdAt = { $gte: startOfDay(now), $lte: endOfDay(now) };
    } else if (dateFilter === "أسبوعى") {
      dateMatch.createdAt = { $gte: startOfWeek(now), $lte: endOfWeek(now) };
    } else if (dateFilter === "شهرى") {
      dateMatch.createdAt = { $gte: startOfMonth(now), $lte: endOfMonth(now) };
    }

    const pipeline = [
      { $match: dateMatch },
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "addedBy",
        }
      },
      { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        }
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    ];

    // لو فيه searchTerm & field
    if (field && searchTerm) {
      const regexFilter = {};
      regexFilter[field] = { $regex: searchTerm, $options: "i" };
      pipeline.push({ $match: regexFilter });
    }

    const totalCountPipeline = [...pipeline, { $count: "total" }];
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip }, { $limit: limit });

    const [Customers, totalCountResult] = await Promise.all([
      customerSchema.aggregate(pipeline),
      customerSchema.aggregate(totalCountPipeline)
    ]);

    const totalCount = totalCountResult[0]?.total || 0;

    // top employees
    const topEmployees = await customerSchema.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: "$addedBy",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $project: {
          _id: 0,
          name: "$employee.fullName",
          count: 1,
        },
      },
    ]);

    const customerStatus = await customerSchema.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: "$EstbilshSatuts",
          count: { $sum: 1 },
        },
      },
    ]);

    const organizationStates = await customerSchema.aggregate([
      { $match: dateMatch },
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

    res.status(200).json({
      data: Customers,
      totalCount,
      page,
      customerStatus,
      organizationStates,
      topEmployees
    });

  } catch (error) {
    next(error);
  }
};

module.exports = SelectCustomer;
