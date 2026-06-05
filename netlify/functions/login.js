export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { ok: false, message: "Metodo no permitido." });

  const gasUrl = process.env.GAS_WEBAPP_URL;
  const token = process.env.GAS_EXECUTION_TOKEN;
  if (!gasUrl || !token) return json(500, { ok: false, message: "Faltan variables de entorno." });

  try {
    const body = JSON.parse(event.body || "{}");
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", token, usuario: body.usuario, password: body.password })
    });
    const data = await response.json();
    return json(response.ok && data.ok !== false ? 200 : 401, data);
  } catch (error) {
    return json(502, { ok: false, message: error.message });
  }
}

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
