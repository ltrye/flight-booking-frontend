import { Client, Message } from "@stomp/stompjs";
import { CsrfTokenData } from "../common/CsrfAPI";

export interface ChatMessage {
  id?: number;
  userId: string;
  agentId: string;
  message: string;
  userOwnMessage?: boolean;
}

let stompClient: Client | null = null;

export const connect = async (
  onMessageReceived: (message: Message) => void,
  userId: string,
  csrfTokenData: CsrfTokenData | null
) => {
  //Get csrf token

  if (!csrfTokenData) {
    throw new Error("CSRF token is not available");
  }

  const headers = {
    [csrfTokenData.headerName]: csrfTokenData.token,
  };
  try {
    stompClient = new Client({
      connectHeaders: headers,
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        stompClient?.subscribe("/topic/messages/" + userId, onMessageReceived);
      },
    });

    stompClient.activate();
  } catch {
    throw new Error("Failed to connect to STOMP server");
  }
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export const sendMessage = (message: ChatMessage) => {
  console.log(stompClient);
  if (stompClient && stompClient.connected) {
    try {
      stompClient.publish({
        destination: "/ws/messages/services",
        body: JSON.stringify(message),
      });
    } catch {
      throw new Error("Failed to send message");
    }
  }
};
