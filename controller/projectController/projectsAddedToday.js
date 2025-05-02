const projectSchema = require("../../model/projectSchema");

const projectsAddedToday = async (req, res, next) => {
  try {
   

    const projects = await projectSchema.find({})
      console.log(projects);
      
    return res.status(200).json({data: projects });
  } catch (error) {
    next(error);
  }
};

module.exports = projectsAddedToday;
