import { api } from "@/lib/api";
import type { AssistantRequest, AssistantResponse, ChatMessage } from "./types";

export async function sendMessage(
  message: string,
  history: ChatMessage[]
): Promise<AssistantResponse> {
  const payload: AssistantRequest = { message, history };
  const { data } = await api.post<AssistantResponse>(
    "/assistant/chat",
    payload,
    { timeout: 60000 }
  );
  return data;
}