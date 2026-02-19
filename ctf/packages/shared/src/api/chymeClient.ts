import type {
  ChymeChatMessage,
  ChymeJoinCallResponse,
  ChymeRoomState,
  ServiceDeletionResponse,
} from "../models/chyme";

export const getChymeRoom = async (): Promise<ChymeRoomState> => {
  const response = await fetch("/api/chyme/room", { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to load Chyme room state");
  }
  return (await response.json()) as ChymeRoomState;
};

export const getChymeChatMessages = async (): Promise<ChymeChatMessage[]> => {
  const response = await fetch("/api/chyme/messages", { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to load Chyme chat messages");
  }
  return (await response.json()) as ChymeChatMessage[];
};

export const sendChymeChatMessage = async (text: string): Promise<ChymeChatMessage> => {
  const response = await fetch("/api/chyme/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Failed to send Chyme chat message");
  }
  return (await response.json()) as ChymeChatMessage;
};

export const joinChymeCall = async (): Promise<ChymeJoinCallResponse> => {
  const response = await fetch("/api/chyme/join", { method: "POST" });
  if (!response.ok) {
    throw new Error("Failed to join Chyme call");
  }
  return (await response.json()) as ChymeJoinCallResponse;
};

export const deleteChymeProfile = async (): Promise<ServiceDeletionResponse> => {
  const response = await fetch("/api/account/chyme-profile", { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete Chyme profile");
  }
  return (await response.json()) as ServiceDeletionResponse;
};

export const deleteFullAccount = async (): Promise<ServiceDeletionResponse> => {
  const response = await fetch("/api/account/full-account", { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete full account");
  }
  return (await response.json()) as ServiceDeletionResponse;
};
