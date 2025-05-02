const express = require("express");
const addProject = require("../controller/projectController/addProject");
const getProjects = require("../controller/projectController/getProjects");
const getProjectByID = require("../controller/projectController/getProjectByID");
const deleteProject = require("../controller/projectController/deleteProject");
const updateProject = require("../controller/projectController/updateProject");
const userProjects = require("../controller/projectController/userProjects");
const UinqDataProject = require("../controller/projectController/UinqDataProject")
const selectProject = require("../controller/projectController/selectProject")
const validationResult = require("../middleware/validations/validatorResult");
const {
  insert,
  update,
} = require("../middleware/validations/projectValidator");
const authorizationMW = require("../middleware/authorizationMW");
const protected = require("../middleware/authenticationMW")
const multerUpload = require("../middleware/multer");
const projectsAddedToday = require("../controller/projectController/projectsAddedToday");
const authuserViewhasMission = require("../middleware/authuserViewhasMission")
const getProjectsUnContacted = require("../controller/projectController/getProjectsUnContacted")
const {getDashboardStats} = require("../controller/Systemstatistics")
const router = express.Router();
// router.use(protected)
router.route("/users/:id").get(userProjects);
router.route("/projectsToday").get(projectsAddedToday);
router.route("/Systemstatistics").get(getDashboardStats);
router.route("/projectUncontacted").get(getProjectsUnContacted);
router
  .route("/")
  .get(
 
    
    getProjects)
  .post(
  
    multerUpload.array("files"),
    addProject
  );
router.get("/selectproject" ,selectProject)
router.get("/uinqData" , UinqDataProject)
router
  .route("/:id")
  .put(
  
    multerUpload.array("files"),
    updateProject
  )
  .get(
   
    getProjectByID)
  .delete(
 
   deleteProject);
module.exports = router;
