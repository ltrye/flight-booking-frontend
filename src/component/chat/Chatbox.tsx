import { useState, useEffect, useContext } from "react";
import { Message } from "@stomp/stompjs";
import {
  ChatMessage,
  connect,
  disconnect,
  sendMessage,
} from "../../api/chat/ChatAPI";
import { CsrfContext } from "../../context/CsrfContext";
import { ChatLines } from "./ChatMessage";

export function Chatbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("1");

  const csrfTokenData = useContext(CsrfContext);
  useEffect(() => {
    async function connectToChat() {
      await connect(
        (message: Message) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            JSON.parse(message.body) as ChatMessage,
          ]);
        },
        userId,
        csrfTokenData
      );
    }
    setUserId("1");
    connectToChat();

    return () => {
      disconnect();
    };
  }, [csrfTokenData, userId]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      message: inputValue,
      userId: userId,
      agentId: "1",
      userOwnMessage: true,
    };

    try {
      sendMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (e) {
      console.error(e);
    }

    setInputValue("");
  };

  return (
    <div className="w-96 h-[60vh] p-4 border rounded-lg shadow-lg flex flex-col justify-between">
      <ChatLines messages={messages} />
      <div className="input-container flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
