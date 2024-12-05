import { User } from "../models/User";

const jwt = require('jsonwebtoken');
const JWt_SECRET = 'myjwtsecrets';
import express, { Request, Response } from "express";
export const fetchUser=async (req:Request, res:Response, next:any)=>{
  const token=req.header("auth-token");
  if(!token)
  {
    res.status(401).send({error: 'Invalid token please authenticate using valid tokens'});
  }
  else
  {
    try {
      const data=jwt.verify(token,JWt_SECRET);
      const d=jwt.decode(data);
      // let user = await User.findById({ id: data.user.id});
      if(data)
      {
        req.query.userId =data.user.id;
        next();
      }
      else
      {
          res.status(401).send({error: 'Invalid token'});
      }

    } catch (error) {
      res.status(401).send({error: 'Invalid token please authenticate using valid token'});
    }
  }
}

