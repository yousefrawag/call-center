const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const addNewdeaily = require("../controller/DeailyReport/AddNewdeaily")
exports.login = async (req, res, next) => {
  try {
    // Find user by email
  console.log(req.body);
  
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User doesn't exist");
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid Password");
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10h" }
    );

    // Add daily login record
    await addNewdeaily(user._id);

    // Respond with success
    res.status(200).json({ action: "Authenticated", token, user });
  } catch (err) {
    // Pass error to the next middleware
    next(err);
  }
};


exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    const encodedToken = encodeURIComponent(resetToken);
    const resetLink = `${process.env.CLIENT_URL}/auth/Reset-Password?token=${encodedToken}`;
    
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: "Password Reset",
      text: `You requested a password reset. Use the following link to reset your password: 
            ${resetLink}`,
    };
    

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Password reset link sent to your email", resetToken });
  } catch (error) {
    next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userSchema.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userSchema.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
