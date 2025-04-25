const cloudinary = require("../../middleware/cloudinary");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");
const notificationSchema = require("../../model/notificationSchema");
const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await projectSchema.findById(id);
    if (!project) {
    return  res.status(404).json({ message: "Project doesn't exist" });
    }
    for (const index in project.imagesURLs) {
      let { fileID } = project.imagesURLs[index];
      await cloudinary.delete(fileID);
    }
    for (const index in project.videosURLs) {
      let { fileID } = project.videosURLs[index];
      await cloudinary.delete(fileID);
    }
    for (const index in project.docsURLs) {
      let { fileID } = project.docsURLs[index];
      await cloudinary.delete(fileID);
    }
    await projectSchema.findByIdAndDelete(id);
    console.log("item-delated")
    res.status(200).json({ message: "project deleted successfully" });
   
  } catch (error) {
    next(error);
  }
};
module.exports = deleteProject;
