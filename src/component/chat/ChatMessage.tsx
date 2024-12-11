import { ChatMessage as ChatMessageData } from "../../api/chat/ChatAPI";

export function ChatMessage({ message }: { message: ChatMessageData }) {
  if (message.userOwnMessage) {
    return (
      <div key={message.id} className="flex flex-row gap-x-4">
        <div className={`flex-grow p-2 mb-2 bg-blue-400 rounded-lg text-white`}>
          {message.message}
        </div>
        <div className="size-9 bg-gray-400 rounded-full"></div>
      </div>
    );
  } else {
    return (
      <div key={message.id} className="flex flex-row gap-x-4">
        <div className="size-9 bg-gray-400 rounded-full"></div>
        <div className={`flex-grow p-2 mb-2 bg-gray-400 rounded-lg text-white`}>
          {message.message}
        </div>
      </div>
    );
  }
}

export function ChatLines({ messages }: { messages: ChatMessageData[] }) {
  return (
    <div className=" min-h-64 flex-grow overflow-y-auto mb-4 p-2 border rounded-lg">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
