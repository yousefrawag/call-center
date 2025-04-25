const { parse, parseISO, isValid } = require('date-fns');
const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");
const userSchema = require("../../model/userSchema");

// Helper function to trim all the keys in an object
const trimObjectKeys = (obj) => {
  const trimmedObj = {};
  Object.keys(obj).forEach((key) => {
    trimmedObj[key.trim()] = obj[key]; // Trim the key and assign the value
  });
  return trimmedObj;
};

// Improved date parsing function using date-fns
const parseDate = (dateValue) => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return isValid(dateValue) ? dateValue : null;
  }
  
  // If it's a number (Excel serial date)
  if (typeof dateValue === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + dateValue * 86400 * 1000);
    return isValid(jsDate) ? jsDate : null;
  }
  
  // If it's a string
  if (typeof dateValue === 'string') {
    const trimmedDate = dateValue.trim();
    
    // Try different date formats
    const formats = [
      'dd/MM/yyyy', // 11/09/2025
      'MM/dd/yyyy', // 09/11/2025
      'yyyy-MM-dd', // 2025-09-11
      'dd-MM-yyyy', // 11-09-2025
    ];
    
    for (const format of formats) {
      try {
        const parsedDate = parse(trimmedDate, format, new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (e) {
        continue;
      }
    }
    
    // Try ISO format as fallback
    try {
      const isoDate = parseISO(trimmedDate);
      if (isValid(isoDate)) {
        return isoDate;
      }
    } catch (e) {
      return null;
    }
  }
  
  return null;
};

const insertMany = async (req, res) => {
  try {
    const jsonData = req.body;
    
    // Trim the keys of each item in jsonData
    const normalizedData = jsonData.map((item) => trimObjectKeys(item));

    // Prepare the customer data with proper date conversion
    const vailData = normalizedData.map((item) => {
      return {
        name: item.name || "",
        phone: item.phone || "",
        scoundphone: item.scoundphone || "",
        stauts: item.stauts || "",
        idNumber: item.idNumber || "",
        SiginNumber: item.SiginNumber || " ",
        ExpiryDate: parseDate(item.ExpiryDate),
        ReleaseDate: parseDate(item.ReleaseDate)
      };
    });

    // Insert the customer data into the database
    const newCustomers = await projectSchema.insertMany(vailData);

    const populatedCustomers = await projectSchema
      .find({ _id: { $in: newCustomers.map(customer => customer._id) } })
      .sort({ createdAt: -1 });

    res.status(200).json({ newCustomers: populatedCustomers });
  } catch (err) {
    console.error("bulk-insert error: ", err);
    res.status(500).json({ success: false, message: "internal_server_error" });
  }
};

module.exports = insertMany;