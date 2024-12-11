import { useState, useEffect } from "react";
import { Message } from "@stomp/stompjs";
import { ChatMessage } from "../../api/chat/ChatAPI";
import {
  connectServiceChat,
  disconnectServiceChat,
  sendMessageToUser,
} from "../../api/chat/ServiceChatAPI";

import { useCsrf } from "../../hooks/useCsrf";
import { ChatLines } from "./ChatMessage";

export function AdminChatbox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userId] = useState("1");
  const csrfTokenData = useCsrf();

  useEffect(() => {
    try {
      connectServiceChat((message: Message) => {
        const chatMessage = JSON.parse(message.body) as ChatMessage;
        chatMessage.userOwnMessage = false;
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
      }, csrfTokenData);

      return () => {
        disconnectServiceChat();
      };
    } catch (e) {
      alert("Connection fail");
    }
  }, [csrfTokenData]);

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
      sendMessageToUser(newMessage);
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
