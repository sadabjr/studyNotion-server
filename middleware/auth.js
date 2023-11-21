const jwt = require("jsonwebtoken");
const user = require("../models/User");
require("dotenv").config;

// auth
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "")

    // if token is missing , send response
    if(!token){
        return req.status("403").json({
            success:false,
            message:"Token is missing"
        })
    }

  }
  catch (error) {
    console.log(error);
  }
};

// isStudent

// isInstructor

// isAdmin
