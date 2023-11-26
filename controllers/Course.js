const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // get thumbnail
    const thumbnail = re.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are require",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = User.findById(userId);
    console.log("instructor details", instructorDetails);
    // todo: verify that userId and instructorDetails._id are same or different ?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details are not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details not found",
      });
    }

    // upload Image to cloudinary
    const imageUrl = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDetails,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // add the new course to the  user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update the tag ka schema
    // home work

    // return response
    return res.status(200).json({
      success: true,
      message: "Course created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// getAllCourse Handler function
exports.showAllCourse = async (req, res) => {
  try {
    // TODO change the given billow statement incrementally
    const allCourses = await Course.find(
      {}
      // {
      //   courseName: true,
      //   price: true,
      //   thumbnail: true,
      //   instructor: true,
      //   ratingAndReview: true,
      //   studentEnrolled: true,
      // }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetch successfully",
      data: allCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cant Match course data",
      error: error.message,
    });
  }
};
