export const consultarAngelGuard = async (duda) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Eres AngelGuard. Responde en 2 frases cortas. NUNCA uses términos técnicos. Usa: presionar el botón, mover el dedo, carta privada, video corto, dibujo de corazón. Tono muy amable." },
        { role: "user", content: duda }
      ]
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
};