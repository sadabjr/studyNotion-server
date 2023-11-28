const Section = require("../models/Section");
const Course = require("../models/Course")



exports.createSection = async (req, res) => {
    try{
    // data fetch
        const {sectionName, courseId} = req.body;

    // data validation
    if(!sectionName || !courseId){
        return res.status(400).json({
            success: true,
            message:"missing property"
        })
    }
    // create section
    const newSection = await Section.create({sectionName})

    // update course with section id
    const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
            $push:{
                courseContent:newSection._id,

            },
        },
        {new:true}
    ) //Home Work:use populate to replace sections both in the updatedCourseDetails

    // return response
    return res.status(200).json({
        success:true,
        message:"section created successfully",
        updatedCourseDetails,
    })
    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"unable to create a section please try again"
        })
    }
}

exports.updateSection = async (req, res) => {
    try{
        // data input 
        const {sectionName, sectionId} = req.body;

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, Please Try again",
            error:error.message,
        })
    }
}