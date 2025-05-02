const projectSchema = require("../../model/projectSchema");

const getallProjects = async (req, res, next) => {
  try {
    const {field, searchTerm} = req.query
    console.log("page" ,req.query.page);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
const filter = {

}
if (field && searchTerm) {

  filter[field] = { $regex: searchTerm, $options: "i" };

}
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      projectSchema
        .find(filter)
       
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      projectSchema.countDocuments()
    ]);

    res.status(200).json({
      data,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getallProjects;
