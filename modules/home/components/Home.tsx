import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/router";

// import { socket } from "@/common/lib/socket";
// import { useModal } from "@/common/recoil/modal";
// import { useSetRoomId } from "@/common/recoil/room";
//
// import NotFoundModal from "../modals/NotFound";
import VideoChat from "@/pages/chat/VideoChat";


const Home = () => {
  // const { openModal } = useModal();
  // const { openModal } = useModal();
  // const setAtomRoomId = useSetRoomId();
  //
  // const [roomId, setRoomId] = useState("");
  // const [username, setUsername] = useState("");


  const router = useRouter();



  useEffect(() =>{
    if (!localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }, []);
  // useEffect(() => {
  //   socket.on("created", (roomIdFromServer) => {
  //     setAtomRoomId(roomIdFromServer);
  //     router.push(roomIdFromServer);
  //   });
  //
  //   const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
  //     if (!failed) {
  //       setAtomRoomId(roomIdFromServer);
  //       router.push(roomIdFromServer);
  //     } else {
  //       openModal(<NotFoundModal id={roomId} />);
  //     }
  //   };
  //
  //   socket.on("joined", handleJoinedRoom);
  //
  //   return () => {
  //     socket.off("created");
  //     socket.off("joined", handleJoinedRoom);
  //   };
  // }, [openModal, roomId, router, setAtomRoomId]);
  //
  // useEffect(() => {
  //   socket.emit("leave_room");
  //   setAtomRoomId("");
  // }, [setAtomRoomId]);
  //
  // const handleCreateRoom = () => {
  //   socket.emit("create_room", username);
  // };
  //
  // const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //
  //   if (roomId) socket.emit("join_room", roomId, username);
  // };

  return (
    <>
      <VideoChat />
    </>
  );
};

export default Home;
