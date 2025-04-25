const express = require("express");
const router = express.Router();
const addCustomer = require("../controller/customers/addCustomer");
const getCustomers = require("../controller/customers/getCustomers");
const getCustomerByID = require("../controller/customers/getCustomerByID");
const updateCustomer = require("../controller/customers/updateCustomer");
const deleteCustomer = require("../controller/customers/deleteCustomer");
const SelectCustomer = require("../controller/customers/SelectCustomer")
const getUserCustomer = require("../controller/customers/userCustomer")
const uinqCoustomerData = require("../controller/customers/uinqCoustomerData")
const insertMany = require("../controller/customers/insertMany")
const validationResult = require("../middleware/validations/validatorResult");
const protect = require("../middleware/authenticationMW")
const {
  insert,
  update,
} = require("../middleware/validations/customerValidator");
const multerUpload = require("../middleware/multer");

const authorizationMW = require("../middleware/authorizationMW");
router.use(protect)
router
  .route("/")
  .get( 
    
    getCustomers)
  .post(
   
    addCustomer
  )
  router.post("/many" , insertMany);
  // where any can select customers
router.get("/selectCustomer" ,SelectCustomer )
router.get("/uinqData"  , uinqCoustomerData)
router.get("/userCustomer" ,  getUserCustomer)
router
  .route("/:id")
  .put(

 
    updateCustomer
  )
  .get(

  getCustomerByID)
  .delete(
 
    deleteCustomer);

module.exports = router;
