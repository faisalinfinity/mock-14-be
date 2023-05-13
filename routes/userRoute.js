const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { userModel } = require("../model/userModel");

userRoute.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    let data = await userModel.find({ email });

    if (data.length == 0) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          return res.status(402).send(err.message);
        }
        req.body.password = hash;
        const new_user = new userModel(req.body);
        await new_user.save();
        res.status(201).send("registered");
      });
    } else {
      res.status(404).send("user already exist");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    let data = await userModel.find({ email });

    if (data.length == 0) {
      res.status(404).send("user not registered");
    } else {
      let hash = data[0].password;

      bcrypt.compare(password, hash, async (err, result) => {
        if (err) {
          return res.send(402).send(err.message);
        }

        if (result) {
          res.status(201).json({
            userId: data[0]._id,
            username: data[0].username,
            token: jwt.sign({ username, userId: data[0]._id }, "faisal"),
          });
        } else {
          res.status(403).send("incorrect password");
        }
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRoute.post("/users/:id/reset", async (req, res) => {
  const { email, newpassword, currentpassword } = req.body;
  const { id } = req.params;

  try {
    let data = await userModel.find({ email });

    if (data.length == 0) {
      res.status(404).send("user not registered");
    } else {
      let hash1 = data[0].password;

      bcrypt.compare(currentpassword, hash1, async (err, result) => {
        if (err) {
          return res.send(402).send(err.message);
        }

        if (result) {
          bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
            if (err) {
              return res.status(402).send(err.message);
            }
            await userModel.findByIdAndUpdate({ _id: id }, { password: hash });
            res.status(201).send("password changed successfully");
          });
        } else {
          res.status(403).send("incorrect current password");
        }
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  userRoute,
};
