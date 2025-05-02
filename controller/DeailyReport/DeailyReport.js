const DeailyReportsmodule = require("../../model/DeailyReports");

const getDeailyreport= async (req, res, next) => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59
    
        // Query to find records where `login` is within the current day
        const records = await DeailyReportsmodule.find()
          .populate({
            path: "employeeID",
         
          })
          .sort({ createdAt: -1 });
    
        res.status(200).json({ records });
      } catch (error) {
        next(error);
      }
};
module.exports = getDeailyreport;