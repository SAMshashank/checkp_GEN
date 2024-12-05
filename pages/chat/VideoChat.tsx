import React, { useEffect, useRef, useState } from "react";

import {
  ICameraVideoTrack,
  IRemoteVideoTrack,
  IAgoraRTCClient,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import Dashboard from "./dash";

import Head from "next/head";

import styles from "../../common/styles/Home.module.css";
import { RtmChannel } from "agora-rtm-sdk";
import { response } from "express";
import { useSetRoomId } from "@/common/recoil/room";
import Room from "@/modules/room/components/Room";
import { socket } from "@/common/lib/socket";
import TwoModel from "@/pages/model/TwoModel";
type TCreateRoomResponse = {
  room: Room;
  rtcToken: string;
  rtmToken: string;
};

type TGetRandomRoomResponse = {
  rtcToken: string;
  rtmToken: string;
  rooms: Room[];
};

type Room = {
  _id: string;
  status: string;
};

type TMessage = {
  userId: string;
  message: string | undefined;
};

function createRoom(userId: string): Promise<TCreateRoomResponse> {
  return fetch(`/api/rooms/setRoom`, {
    method: "POST",
    headers: {
      "auth-token": localStorage.getItem("token") || "",
    },
  }).then((response) => response.json());
}

function getRandomRoom(userId: string): Promise<TGetRandomRoomResponse> {
  return fetch(`/api/rooms/createRoom`, {
    headers: {
      "auth-token": localStorage.getItem("token") || "",
    },
  }).then((response) => response.json());
}

function setRoomToWaiting(roomId: string) {
  return fetch(`/api/rooms/updateRoom?roomId=${roomId}`, {
    method: "PUT",
    headers: {
      "auth-token": localStorage.getItem("token") || "",
    },
  }).then((response) => response.json());
}

export const VideoPlayer = ({
  videoTrack,
  style,
}: {
  videoTrack: IRemoteVideoTrack | ICameraVideoTrack;
  style: object;
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const playerRef = ref.current;
    if (!videoTrack) return;
    if (!playerRef) return;

    videoTrack.play(playerRef);

    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  return <div ref={ref} style={style}></div>;
};

async function connectToAgoraRtc(
  roomId: string,
  userId: string,
  onVideoConnect: any,
  onWebcamStart: any,
  onAudioConnect: any,
  token: string
) {
  const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  await client.join(
    process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    roomId,
    token,
    userId
  );

  client.on("user-published", (themUser, mediaType) => {
    client.subscribe(themUser, mediaType).then(() => {
      if (mediaType === "video") {
        onVideoConnect(themUser.videoTrack);
      }
      if (mediaType === "audio") {
        onAudioConnect(themUser.audioTrack);
        themUser.audioTrack?.play();
      }
    });
  });

  const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  onWebcamStart(tracks[1]);
  await client.publish(tracks);

  return { tracks, client };
}

async function connectToAgoraRtm(
  roomId: string,
  userId: string,
  onMessage: (message: TMessage) => void,
  token: string
) {
  const { default: AgoraRTM } = await import("agora-rtm-sdk");
  const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_APP_ID!);
  await client.login({
    uid: userId,
    token,
  });
  const channel = await client.createChannel(roomId);
  await channel.join();
  channel.on("ChannelMessage", (message: any, userId: any) => {
    onMessage({
      userId,
      message: message.text,
    });
  });

  return {
    channel,
  };
}

export default function VideoChat() {
  const [userId, setUserId] = useState(`${parseInt(`${Math.random() * 1e6}`)}`);
  const [room, setRoom] = useState<Room | undefined>();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [input, setInput] = useState("");
  const [themVideo, setThemVideo] = useState<IRemoteVideoTrack>();
  const [myVideo, setMyVideo] = useState<ICameraVideoTrack>();
  const [themAudio, setThemAudio] = useState<IRemoteAudioTrack>();
  const channelRef = useRef<RtmChannel>();
  const rtcClientRef = useRef<IAgoraRTCClient>();
  const setAtomRoomId = useSetRoomId();
  const [userData, setUserData] = useState<UserDataInterface>({
    __v: 0,
    _id: null,
    avatar: "",
    description: "",
    email: "",
    gender: "",
    name: "",
    password: "",
    walletAddress: "",
  });

  useEffect(() => {
    fetch("/api/auth/getUserData", {
      headers: {
        "auth-token": localStorage.getItem("token") || "",
      },
    })
      .then((res) => res)
      .then((res) => res.json())
      .then((body) => {
        console.log(body);
        setUserId(body?._id);
        setUserData(body);
      });
  }, []);

  function handleNextClick() {
    // setRoomToWaiting(room?._id as string).then((res)=>{
    connectToARoom();
    // });
  }

  function handleStartChattingClicked() {
    connectToARoom();
  }

  async function handleSubmitMessage(e: React.FormEvent) {
    e.preventDefault();
    await channelRef.current?.sendMessage({
      text: input,
    });
    setMessages((cur) => [
      ...cur,
      {
        userId,
        message: input,
      },
    ]);
    setInput("");
  }

  async function connectToARoom() {
    setThemAudio(undefined);
    setThemVideo(undefined);
    setMyVideo(undefined);
    setMessages([]);
    const prevRoom = JSON.parse(JSON.stringify(room || null));
    setRoom(undefined);

    if (channelRef.current) {
      await channelRef.current.leave();
    }

    if (rtcClientRef.current) {
      rtcClientRef.current.leave();
    }

    const { rooms, rtcToken, rtmToken } = await getRandomRoom(userId);

    if (room) {
      if (userData?._id) {
        socket.emit("leave_room");
        setAtomRoomId("");
      }
      setRoomToWaiting(room._id);
      setAtomRoomId(room._id);
      socket.emit("join_room", room._id, userData?.name);
    }

    if (rooms?.length > 0) {
      setRoom(rooms[0]);
      const { channel } = await connectToAgoraRtm(
        rooms[0]._id,
        userId,
        (message: TMessage) => setMessages((cur) => [...cur, message]),
        rtmToken
      );
      channelRef.current = channel;

      const { tracks, client } = await connectToAgoraRtc(
        rooms[0]._id,
        userId,
        (themVideo: IRemoteVideoTrack) => setThemVideo(themVideo),
        (myVideo: ICameraVideoTrack) => setMyVideo(myVideo),
        (themAudio: IRemoteAudioTrack) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
      if (userData?._id) {
        socket.emit("leave_room");
        setAtomRoomId("");
      }

      setAtomRoomId(rooms[0]._id);
      socket.emit("join_room", rooms[0]._id, userData?.name);
    } else {
      const { room, rtcToken, rtmToken } = await createRoom(userId);
      setRoom(room);
      const { channel } = await connectToAgoraRtm(
        room._id,
        userId,
        (message: TMessage) => setMessages((cur) => [...cur, message]),
        rtmToken
      );
      channelRef.current = channel;
      if (userData?._id) {
        socket.emit("leave_room");
        setAtomRoomId("");
      }
      setAtomRoomId(room._id);
      socket.emit("join_room", room._id, userData?.name);

      const { tracks, client } = await connectToAgoraRtc(
        room._id,
        userId,
        (themVideo: IRemoteVideoTrack) => setThemVideo(themVideo),
        (myVideo: ICameraVideoTrack) => setMyVideo(myVideo),
        (themAudio: IRemoteAudioTrack) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
    }
  }

  function convertToYouThem(message: TMessage) {
    return message.userId === userId ? "You" : "Them";
  }

  const isChatting = room!!;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {isChatting ? (
          <>
            {/* {room._id} */}
            <div className="">
              {room ? (
                <TwoModel roomId={room._id} onClick={handleNextClick} />
              ) : (
                <div className="flex items-center justify-center">
                  {/* Loader, you can customize it as needed */}
                  <div className="z-[9999] h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-solid border-yellow-400"></div>
                </div>
              )}
            </div>
            <div className="hidden">
              {/* className="hidden" */}
              {room ? (
                <Room />
              ) : (
                <div className="flex items-center justify-center">
                  {/* Loader, you can customize it as needed */}
                  <div className="z-[9999] h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-solid border-yellow-400"></div>
                </div>
              )}

              <button
                className="top-22 absolute left-0   z-[9999] mb-6 ml-2 transform rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                onClick={handleNextClick}
              >
                Next
              </button>

              <div className=" chat-window absolute bottom-0 right-0  z-[9999]">
                <div className="video-panel">
                  <div className="video-stream">
                    {myVideo && (
                      <VideoPlayer
                        style={{ width: "100%", height: "100%" }}
                        videoTrack={myVideo}
                      />
                    )}
                  </div>
                  <div className="video-stream">
                    {themVideo && (
                      <VideoPlayer
                        style={{ width: "100%", height: "100%" }}
                        videoTrack={themVideo}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Dashboard onClick={handleStartChattingClicked} />
          </>
        )}
      </main>
    </>
  );
}

interface UserDataInterface {
  avatar: string;
  description: string;
  email: string;
  gender: string;
  name: string;
  password: string;
  walletAddress: string;
  __v: number;
  _id: string | null;
}
