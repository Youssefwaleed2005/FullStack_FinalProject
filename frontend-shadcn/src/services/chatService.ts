import api from "./api";
import type { ChatMessage, ChatResponse } from "@/types/Chat";

// Sends the conversation; the API answers using the live course catalog
export async function askAssistant(messages: ChatMessage[]): Promise<ChatResponse> {
  // A local model can take a while, so allow up to 2 minutes
  const response = await api.post<ChatResponse>("/chat", { messages }, { timeout: 120_000 });
  return response.data;
}
