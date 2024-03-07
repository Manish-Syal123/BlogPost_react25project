const mongoose = require("mongoose");
const Blogmodel = require("../model/Blogmodel");

const fetchListOfBlogs = async (req, res) => {
  let blogList;
  try {
    blogList = await Blogmodel.find();
  } catch (error) {
    console.log(error);
  }

  if (!blogList) {
    return res.status(404).json({ message: "No Blog's found" });
  }

  return res.status(200).json({ blogList });
};

const addNewBlog = async (req, res) => {
  const { title, description } = req.body;
  const currdate = new Date();

  const newblog = await Blogmodel({ title, description, date: currdate });
  try {
    await newblog.save();
  } catch (error) {
    console.log("Error while saving the Blog in database", error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newblog.save(session);
    session.commitTransaction();
  } catch (error) {
    return res.send(500).json({ message: error });
  }

  return res.status(200).json({ newblog });
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const findCurrentBlog = await Blogmodel.findByIdAndDelete(id);

    if (findCurrentBlog) {
      return res.status(200).json({ message: "Bloge delected Succefully!" });
    }

    return res.status(404).json({ message: "Blog not found." });
  } catch (error) {
    console.log(error);
    return res.status(505).json({ message: "Faild to delete Blog" });
  }
};

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  try {
    const findCurrBlogAndUpdate = await Blogmodel.findByIdAndUpdate(id, {
      title,
      description,
    });

    if (findCurrentBlog) {
      return res.send(200).json({ findCurrBlogAndUpdate });
    }

    return res.status(505).json({ message: "Unable to Update a blog" });
  } catch (error) {
    console.log(error);
    return res
      .status(505)
      .json({ message: "Faild to Update a Blog ! Please try again." });
  }
};

module.exports = { fetchListOfBlogs, addNewBlog, updateBlog, deleteBlog };
