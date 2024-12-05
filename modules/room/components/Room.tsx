import { useRoom } from "@/common/recoil/room";

import RoomContextProvider from "../context/Room.context";
import Canvas from "./board/Canvas";
import MousePosition from "./board/MousePosition";
import MousesRenderer from "./board/MousesRenderer";
import MoveImage from "./board/MoveImage";
import SelectionBtns from "./board/SelectionBtns";
import NameInput from "./NameInput";
import ToolBar from "./toolbar/ToolBar";
import UserList from "./UserList";
// import Chat from "./chat/Chat";

const Room = () => {
  const room = useRoom();

  if (!room.id) return <></>;

  return (
    <RoomContextProvider>
      <div className="h-full w-full overflow-hidden">
        <UserList />
        <ToolBar />
        <SelectionBtns />
        <MoveImage />
        <Canvas />
        <MousePosition />
        <MousesRenderer />
        {/* <Chat /> */}
      </div>
    </RoomContextProvider>
  );
};

export default Room;
