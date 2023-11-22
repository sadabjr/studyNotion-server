const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken(reset password mail sender)
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;

    // check user fro this email, email validation
    const user = await User.findOne({ email: email });
    if (!User) {
      return res.json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }

    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiring time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 100,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );
    // return response
    return res.json({
      success: true,
      message:
        "Email send successfully, PLease check email and change Password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password mail",
    });
  }
};

// reset password(in database)
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password is not matched",
      });
    }
    // get user details from db using token
    const userDetails = await User.findOne({ token: token });
    // if no entry invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, Please regenerate your token!",
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

  }
};
