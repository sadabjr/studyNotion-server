const Category = require("../models/Category");

// create tag ka handler function

exports.createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = res.body;
    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are require",
      });
    }
    // create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all tags
exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All Category returned successfully",
      allTags,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
