const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
const AI_CHAT_URL = API_URL.endsWith("/api")
  ? `${API_URL}/ai/chat`
  : `${API_URL}/api/ai/chat`;

export async function sendSnowtrekAiMessage(message) {
  let response;

  try {
    response = await fetch(AI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw new Error("No se pudo conectar con SnowtrekIA. Verificá que el backend esté activo.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error("SnowtrekIA no pudo procesar la consulta.");
  }

  return data;
}
