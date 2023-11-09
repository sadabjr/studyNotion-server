const  mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }

});

// function to send email
async function sendVerificationEmail(email, otp){
    try{

    }
    catch{
        
    }
}

module.exports = mongoose.model("OTP", OTPSchema)