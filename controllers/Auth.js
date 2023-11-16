const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");

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

exports.signUp = (req, res) => {
    // data fetch form request ki body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    } = req.body
    // data ko validate kr lo

    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are require"
        })
    }

    // 2. passwords ko match kr lo

    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm Password Value does not match, please try again"
        })
    }

    // check user already exist or not

    // find most recent otp for the suer

    // Hash password

    // entry create in DB


}

// sign in

// change password
