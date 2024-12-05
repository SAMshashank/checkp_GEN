import express, { Request, Response } from "express";

import { User } from "../models/User";
import { logger } from "../utility/logger";
import Room from "../models/Room";
import { getRtcToken, getRtmToken } from "../utility/rtcTokenUtil";
import { fetchUser } from '../middleware/getUser';


const { body, validationResult } = require("express-validator");
const roomRouter = express.Router();

roomRouter.get("/createRoom",fetchUser, async (req: Request, res: Response) => {
  try {
    const userId:string=String(req.query.userId);
    const rooms = await Room.aggregate([
      { $match: { status: "waiting" } },
      { $sample: { size: 1 } },
    ]);
    if (rooms.length > 0) {
      const roomId = rooms[0]._id.toString();
      await Room.findByIdAndUpdate(roomId, {
        status: "chatting",
      });
      res.status(200).json({
        rooms,
        rtcToken: getRtcToken(roomId, userId),
        rtmToken: getRtmToken(userId),
      });
    } else {
      res.status(200).json({ rooms: [], token: null });
    }
  } catch (error) {
    logger.Error("Error in router room /createRoom",error);

    res.status(400).json((error as any).message);
  }
})

roomRouter.put(`/updateRoom`,fetchUser, async (req: Request, res: Response) => {

try {
  const roomId:string=String(req.query.roomId)
  await Room.findByIdAndUpdate(roomId, {
    status: "waiting",
  });
  res.status(200).json("success");
}
catch(e)
{
  logger.Error("Error in router room /updateRoom",e);
  res.status(400).json("no method for this endpoint");
}
})


roomRouter.post("/setRoom",fetchUser, async (req: Request, res: Response) => {
  try {
    const roomId:string=String(req.query.userId)
    const room = await Room.create({
      status: "waiting",
    });
    res.status(200).json({
      room,
      rtcToken: getRtcToken(room._id.toString(), roomId),
      rtmToken: getRtmToken(roomId),
    });
  }
  catch (e)
  {
    logger.Error("Error in router room /setroom",e);
    res.status(400).json("no method for this endpoint");
  }
})







export default roomRouter;
