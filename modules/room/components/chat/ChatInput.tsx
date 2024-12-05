import { FormEvent, useState } from "react";

import { AiOutlineSend } from "react-icons/ai";

import { socket } from "@/common/lib/socket";

const ChatInput = () => {
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("send_msg", msg);
    setMsg("");
  };

  return (
    <form  className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-white p-2" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-lg bg-transparent border-2 border-gray-300 text-white p-2 focus:outline-none focus:border-yellow-400 transition-all"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 transition-all"
        type="submit"
      >
        <AiOutlineSend className="text-xl" />
      </button>
    </form>
  );
};

export default ChatInput;
