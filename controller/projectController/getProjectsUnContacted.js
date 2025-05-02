const projectSchema = require("../../model/projectSchema");

const getProjectsUnContacted = async (req, res, next) => {
  try {

console.log("data");

const projects = await projectSchema.find({
    $or: [
      { hasBeenCalled: false },
      { hasBeenCalled: { $exists: false } }
    ]
  });
  

    res.status(200).json({
      data:  projects
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getProjectsUnContacted;
