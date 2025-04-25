const userSchema = require("../model/userSchema");
const cloudinary = require("../middleware/cloudinary");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");
const { log } = require("console");
const logo = path.join(__dirname, "../images/logo2.jpg");
const DeailyReportsmodule = require("../model/DeailyReports");

exports.getUsers = (req, res, next) => {
  const {field , searTerm} = req.query
  let fillter = {}
  if(["fullName" , "email" , "job"].includes(field) && searTerm) {
    fillter[field] = { $regex: new RegExp(searTerm, 'i') }
  }
  userSchema
    .find(fillter)
   
    .sort({ createdAt: -1 })
    .select("-password")
    .then((data) => {
      if (!data.length) {
        res.status(404).json({ message: "there is no users" });
      }
      res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
exports.Selectusers = async (req , res , next) => {
  const findusers  = await  userSchema
  .find({})
  .populate("role")
  .select("-password")
  const users = findusers.filter((item) => item._id !== 1)
  res.status(200).json({users})
}



exports.addUser = async (req, res, next) => {
  console.log(req.body)
  try {
    let user = new userSchema(req.body);

    if (req.file) {
      const { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "userImages"
      );
      user.imageURL = imageURL;
      user.imageID = imageID;
    }
    
    await user.save();

    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });



    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "🎉 تم إنشاء حسابك بنجاح!",
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; color: #333; line-height: 1.8;">
          <!-- شعار الشركة -->
       

          <h2 style="color: #218bc7;">🎉 مرحبًا ${user.fullName}!</h2>
          <p>تم إنشاء حسابك بنجاح على منصتنا   . يمكنك الآن تسجيل الدخول باستخدام التفاصيل التالية:</p>

          <p><strong>✉️ البريد الإلكتروني:</strong> ${user.email}</p>
          <p><strong>🔑 كلمة المرور:</strong> ${req.body.password}</p>

          <p style="color: #d9534f;"><strong>⚠️ ملاحظة:</strong> يُرجى تغيير كلمة المرور فور تسجيل الدخول لحماية حسابك.</p>

          <p>يمكنك تسجيل الدخول إلى حسابك عبر الرابط التالي:</p>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.CLIENT_URL}" 
              style="display: inline-block; padding: 12px 24px; background-color: #218bc7; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
              🔐 تسجيل الدخول إلى الحساب
            </a>
          </div>

          <p style="margin-top: 20px; font-size: 12px; color: #888;">📌 هذا البريد مرسل تلقائيًا، لا ترد عليه.</p>
        </div>
      `,
  
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ action: "تم إنشاء الحساب وإرسال البريد الإلكتروني بنجاح" });

  } catch (error) {
    console.error("فشل إرسال الإيميل:", error);
    next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    let user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "This user desn't exist" });
    }
    if (req.file) {
      if (user.imageID) await cloudinary.delete(user.imageID);
      const { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "userImages"
      );
      updateData.imageURL = imageURL;
      updateData.imageID = imageID;
    }
    const updatedUesr = await userSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json({ message: "User updated successfully", updatedUesr });
  } catch (error) {
    next(error);
  }
};

exports.updateUserOwnInfo = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);

  try {
    const id = req.token.id;
    const updateData = { ...req.body };
    let user = await userSchema.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "This user desn't exist" });
    }
    if (req.file) {
      if (user.imageID) await cloudinary.delete(user.imageID);
      const { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "userImages"
      );
      updateData.imageURL = imageURL;
      updateData.imageID = imageID;
    }
    const updatedUesr = await userSchema
      .findByIdAndUpdate(id, updateData, {
        new: true,
      })
    
    res.status(200).json({ message: "User updated successfully", updatedUesr });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findByIdAndDelete(id)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json("User doesn't exist");
      }
      if (user.imageID) await cloudinary.delete(user.imageID);
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => next(err));
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findById(id)
    .select("-password")
    .then((data) => {
      if (!data) {
        res.status(404).json({ message: "User doesn't exist" });
      }
      res.status(200).json({ data });
    })
    .catch((err) => next(err));
};
exports.logout = async (req, res, next) => {
  try {
    // Find the latest login record that has no logout time
    const findDeailyUser = await DeailyReportsmodule.findOne({
      employeeID: req.token.id,
      logout: { $exists: false }, // Ensures we get only open sessions
    }).sort({ login: -1 }); // Get the latest session

    if (!findDeailyUser) {
      return res.status(400).json({ msg: "No active session found for logout" });
    }

    // Set logout time and calculate total hours
    const logoutTime = new Date();
    const totalHours = (logoutTime - findDeailyUser.login) / (1000 * 60 * 60); // Convert ms to hours

    findDeailyUser.logout = logoutTime;
    findDeailyUser.totaHours = totalHours.toFixed(2); // Store hours with 2 decimals
    await findDeailyUser.save();

    res.status(200).json({ msg: "User logged out successfully", totalHours });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  let { id, oldPassword, newPassword } = req.body;

  try {
    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userSchema.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentLoggedUser = (req, res, next) => {
  userSchema
    .findById(req.token.id)
    .populate("role")
    .select("-password")
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User doesn't exist" });
      }
      res.status(200).json({ user });
    })
    .catch((err) => next(err));
};
exports.getusersAdmin = async (req , res , nex) => {
  const {field , searTerm} = req.query
  let fillter = {type:"admin"}
  if(["fullName" , "email" , "job"].includes(field) && searTerm) {
    fillter[field] = { $regex: new RegExp(searTerm, 'i') }
  }
  const admins = await userSchema.find(fillter).sort({ createdAt: -1 })
  const checkuser = admins.filter((item) => item._id !== 1)
  res.status(200).json({checkuser})
}
