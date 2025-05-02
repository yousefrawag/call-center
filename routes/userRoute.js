const express = require("express");
const userController = require("../controller/userController");
const validationResult = require("../middleware/validations/validatorResult");
const { insert, update } = require("../middleware/validations/userValidator");
const authorizationMW = require("../middleware/authorizationMW");
const multerUpload = require("../middleware/multer");
const protect = require("../middleware/authenticationMW")
const getDeailyreport  = require("../controller/DeailyReport/DeailyReport")
const router = express.Router();
router.use(protect)
router.route("/getCurrentLoggedUser").get(userController.getCurrentLoggedUser);
router.route("/changePassword").post(userController.changePassword);
router.route("/logout").post(userController.logout);
router.route("/DeailyRoutes").get(getDeailyreport)
router
  .route("/update")
  .put(
    multerUpload.single("image"),
  
    userController.updateUserOwnInfo
  );
router
  .route("/")
  .get(
   
   userController.getUsers)
  .post(

    multerUpload.single("image"),
    // insert,
    // validationResult,
    userController.addUser
  );
router.get("/selectusers" ,userController.Selectusers)
router.get("/admins" , userController.getusersAdmin)
router
  .route("/:id")
  .put(
   
    multerUpload.single("image"),
    // update,
    // validationResult,
    userController.updateUser
  )
  .get(userController.getUserById)
  .delete(
  
  userController.deleteUser);
module.exports = router;
