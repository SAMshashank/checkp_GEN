import express, { Request, Response } from "express";

import { User } from "../models/User";
import { logger } from "../utility/logger";
import { fetchUser } from "../middleware/getUser";

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const authRouter = express.Router();
const JWt_SECRET = "myjwtsecrets";
const jwt = require("jsonwebtoken");

// Todo: user creation
authRouter.post(
  "/signup",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password atleast of 5 character").isLength({
      min: 5,
    }),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, message: "a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        password: secpassword,
        email: req.body?.email,
        name: req.body?.name,
        avatar: req.body?.avatar,
        gender: req.body?.gender,
        description: req.body?.description,
        walletAddress:req.body?.walletAddress,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWt_SECRET);
      // console.log("user created successfully");
      success = true;
      res.json({ success, authtoken });
    } catch (err) {
      logger.Error("Unbale to signup", err);
      success = false;
      res.status(400).json({ success, message: err });
    }
  }
);

// todo: login
authRouter.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWt_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      logger.Error("Unbale to login", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

authRouter.get('/getUserData',fetchUser ,async (req: Request, res: Response) => {
  try {
    const userId=req.query.userId;
    const user = await User.findById(userId);
    logger.Info("User Found",user)
    res.status(200).send(user);
  }
  catch (e)
  {
    logger.Error("User Not Found",e);
    res.status(400).send(null);
  }

})

export default authRouter;
