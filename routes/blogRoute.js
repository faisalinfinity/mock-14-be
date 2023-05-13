const express = require("express");
const { blogModel } = require("../model/blogModel");
const { authorization } = require("../middleware/authorization");
const blogRoute = express.Router();
blogRoute.patch("/blogs/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    let data = await blogModel.findOne({ _id: id });

    await blogModel.findByIdAndUpdate({ _id: id }, { likes: +data.likes + 1 });
    res.send("added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

blogRoute.patch("/blogs/:id/comment", async (req, res) => {
  const { id } = req.params;
  try {
    let data = await blogModel.findOne({ _id: id });
    let comments = data.comments;
    comments.push(req.body);

    await blogModel.findByIdAndUpdate({ _id: id }, { comments: comments });
    res.send("added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
blogRoute.get("/blogs", async (req, res) => {
  const { sort, page, order } = req.query;
  let limit = +req.query.limit || 5;
  let skip = (+page - 1) * limit;
  try {
    let data;
    if (req.query.category || req.query.title) {
      data = blogModel.find(req.query);
    } else if (sort) {
      data = blogModel.find();
      if (order == "asc") {
        let obj = {};
        obj[sort] = 1;
        data.sort(obj);
      } else if (order == "desc") {
        let obj = {};
        obj[sort] = -1;
        data.sort(obj);
      }
    } else {
      data = blogModel.find();
    }

    const total = await blogModel.countDocuments(data);
    const totalPages = Math.ceil(total / limit);
    const blogsData = await data.skip(skip).limit(limit).exec();

    res.json({
      page,
      limit,
      total,
      totalPages,
      blogsData,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
blogRoute.use(authorization);
blogRoute.post("/blogs", async (req, res) => {
  try {
    let new_blog = new blogModel(req.body);
    await new_blog.save();
    res.send("added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

blogRoute.patch("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await blogModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send("added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

blogRoute.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await blogModel.findByIdAndDelete({ _id: id });
    res.send("deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
});



module.exports = {
  blogRoute,
};
