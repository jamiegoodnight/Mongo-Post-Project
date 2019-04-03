const express = require("express");

const Post = require("../postSchema");

const router = express.Router();

/*http://localhost:5000/
get -> return stuff from db
post -> add to db
put -> updates the db
delete -> removes from the db*/

router.get("/", async (req, res) => {
  //Retrieve all posts
  try {
    const posts = await Post.find({}).exec(); //Empty object to find every post, returns an array. Exec covers any promise issues.
    res.status(200).json(posts); //If posts are located, return an 'ok' status code and the json format of posts.
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong retrieving the posts." });
    //If the find promise rejects, provide an error message to the user.
  }
});

router.post("/", async (req, res) => {
  const post = req.body; //Define what the post to be added is

  if (!post.title || !post.description) {
    res.status(400).json({
      message: "Please provide a title and description for the post."
    });
    //Let the user know if they are missing some required fields
  } else {
    try {
      const newPost = await Post.create(post); //Try to create a new post and save the returned post info
      res.status(201).json(newPost); //Let the user know that the post was added by sending back the info
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong adding the new post." });
      //Catch any errors, need a handler for if the record already exists. Sends back on err.errmsg
    }
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; //destructure id from params
  const post = req.body;
  if (!post.title || !post.description) {
    res.status(400).json({
      message: "Please provide a title and description in your update."
    });
  } else {
    try {
      const updatedPost = await Post.findByIdAndUpdate(id, post, {
        new: true
      }).exec();
      res.status(200).json(updatedPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Something went wrong updating the post.", err });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    res.status(200).end();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong trying to delete the post." });
  }
});

module.exports = router;
