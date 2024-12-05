import { createServer } from "http";

import {} from "@/common/types/global";

import express from "express";
import next, { NextApiHandler } from "next";
import { Server } from "socket.io";

import setupSocket from "./controller/socket";
import setupModelSocket from "./controller/modelSocket.controller";
import { logger } from "./utility/logger";
import connectToMongoose  from "./database/dbconfig";
import authRouter from "./controller/user.controller";
import roomRouter from "./controller/chatRoom.controller";
import Room from "./models/Room";

// const  setupSocket =require("./controller/socket");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);
  app.use(express.json());
  app.use('/api/auth',authRouter);
  app.use('/api/rooms', roomRouter);

  try {
    connectToMongoose();
    Room.deleteMany().then(()=>{console.log("sucess")}).catch((e=>{console.log("error",e)}));
    logger.Info("Connected to db");
  } catch (e) {
    logger.Error("Unable to connect to db", e);
  }

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
  try {
    setupSocket(io);
    logger.Info("Socket setup successful");
  } catch (e) {
    logger.Error("Socket setup failed", e);
    console.log(e);
  }
  // const io2 = new Server<ClientToServerEvents, ServerToClientEvents>(server);
  // try{
  //   setupModelSocket(io2);
  //  console.log("Socket2 setup successful");
  // }
  // catch (e) {
  //   logger.Error("Socket setup failed", e);
  //   console.log(e);
  // }




  app.get("/health", async (_, res) => {
    res.send("Healthy");
  });
  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
    logger.Info(`> Ready on XXXXXXXXXXXXXXXX:${port}`);
  });
});
