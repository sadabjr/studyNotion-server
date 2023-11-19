const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const bcrypt = require("bcrypt")

//  (Send OTP)
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    // check user if already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered.",
      });
    }

    // generate OTP
    var otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated", otp);

    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = optGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayLoad = { email, otp };

    // create an entry for OTP
    const otpBody = await OTP.create(otpPayLoad);
    console.log(otpBody);

    // return response successful
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// sign up

exports.signUp = async (req, res) => {
  try {
    // data fetch form request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // data ko validate kr lo

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are require",
      });
    }

    // 2. passwords ko match kr lo

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm Password Value does not match, please try again",
      });
    }

    // check user already exist or not
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent otp for the user
    const recentOtp = await OTP.find({ email })
      .short({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // Validate OTP
    if (recentOtp.length == 0) {
      // means OTP is not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      // means OTP is invalid
      return res.status(400).json({
        success: false,
        message: "OTP is invalid",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message:"User is Registered Successfully",
      user,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"User can not be Registered, Please try again.",

    })
  }
};

// sign in

exports.login = async (req, res) => {

}

// change password
