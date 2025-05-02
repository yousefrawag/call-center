const projectSchema = require("../../model/projectSchema");
const selectProject = async (req, res, next) => {
  
  try {
    const search = req.query.search || '';
    const projects = await projectSchema.find({
      name: { $regex: search, $options: 'i' }
    }).limit(100);
  
  
    
      res.status(200).json({ data:projects });
 
  
  } catch (error) {
 throw new Error(error)
    next(error);
  }
};
module.exports = selectProject;
