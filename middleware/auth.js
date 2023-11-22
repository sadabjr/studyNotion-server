const jwt = require("jsonwebtoken");
const user = require("../models/User");
require("dotenv").config;

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");

    // if token is missing , send response
    if (!token) {
      return req.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      // verification issue
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent\
exports.isStudent = (req, res, next) => {
try{
if(req.user.accountType !== "Student"){
  return res.status(401).json({
    success:false,
    message:"This is a protected route for student only"
  })
}
}
catch(error){
  return res.status(401).json({
    success:false,
    message:"user role can not be verified, Please try again"
  })
}
}

// isInstructor
exports.isInstructor = (req, res, next) => {
  try{
  if(req.user.accountType !== "Instructor"){
    return res.status(401).json({
      success:false,
      message:"This is a protected route for Instructor only"
    })
  }
  }
  catch(error){
    return res.status(401).json({
      success:false,
      message:"user role can not be verified, Please try again"
    })
  }
  }

// isAdmin
exports.isAdmin = (req, res, next) => {
  try{
  if(req.user.accountType !== "Admin"){
    return res.status(401).json({
      success:false,
      message:"This is a protected route for Admin only"
    })
  }
  }
  catch(error){
    return res.status(401).json({
      success:false,
      message:"user role can not be verified, Please try again"
    })
  }
  }