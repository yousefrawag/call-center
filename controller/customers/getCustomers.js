const customerSchema = require("../../model/customerSchema");
const GetallCustomer = async (req, res, next) => {
  try {
    const { field, searchTerm } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {};

    // 🔍 دعم البحث داخل الحقول النستد مثل addedBy.fullName
    if (field && searchTerm) {
      if (field === "addedBy.fullName") {
        matchStage["addedBy.fullName"] = { $regex: searchTerm, $options: "i" };
      } else if (field === "customer.name") {
        matchStage["customer.name"] = { $regex: searchTerm, $options: "i" };
      } else {
        matchStage[field] = { $regex: searchTerm, $options: "i" };
      }
    }

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "addedBy",
        },
      },
      { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $match: matchStage,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const results = await customerSchema.aggregate(pipeline);

    const data = results[0]?.data || [];
    const totalCount = results[0]?.metadata[0]?.total || 0;

    res.status(200).json({
      data,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = GetallCustomer;
