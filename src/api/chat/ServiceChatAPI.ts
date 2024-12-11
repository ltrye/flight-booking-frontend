import { Client, Message } from "@stomp/stompjs";
import { ChatMessage } from "./ChatAPI";
import { CsrfTokenData } from "../common/CsrfAPI";

let stompClient: Client | null = null;

export const connectServiceChat = async (
  onMessageReceived: (message: Message) => void,
  csrfTokenData: CsrfTokenData | null
) => {
  try {
    if (!csrfTokenData) {
      throw new Error("CSRF token is not available");
    }
    const headers = {
      [csrfTokenData.headerName]: csrfTokenData.token,
    };
    stompClient = new Client({
      reconnectDelay: 5000,
      connectHeaders: headers,
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        stompClient?.subscribe("/topic/messages/services", onMessageReceived);
      },
    });

    stompClient.activate();
  } catch {
    throw new Error("Failed to connect to STOMP server");
  }
};

export const disconnectServiceChat = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

/**
 * Sends a message from a customer service agent to a user.
 * @param agentId - The ID of the customer service agent.
 * @param userId - The ID of the user.
 * @param message - The message to be sent.
 */
export const sendMessageToUser = (message: ChatMessage) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/ws/messages/" + message.userId,
      body: JSON.stringify(message),
    });
  } else {
    throw new Error("STOMP client is not connected");
  }
};
