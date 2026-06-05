export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "Metodo no permitido." });
  }

  const gasUrl = process.env.GAS_WEBAPP_URL;
  const token = process.env.GAS_EXECUTION_TOKEN;

  if (!gasUrl || !token) {
    return json(500, {
      ok: false,
      message: "Faltan GAS_WEBAPP_URL o GAS_EXECUTION_TOKEN en Netlify."
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, message: "El cuerpo de la solicitud no es JSON valido." });
  }

  const errors = validatePayload(payload);
  if (errors.length > 0) {
    return json(400, { ok: false, message: errors.join(" ") });
  }

  try {
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, action: payload.action || "submit", token })
    });
    const data = await response.json();
    return json(response.ok && data.ok !== false ? 200 : 502, data);
  } catch (error) {
    return json(502, {
      ok: false,
      message: `No se pudo conectar con Google Apps Script: ${error.message}`
    });
  }
}

function validatePayload(payload) {
  const errors = [];
  if (!payload.cierre?.fechaCierre) errors.push("La fecha de cierre es obligatoria.");
  if (!payload.cierre?.usuarioCaptura) errors.push("El usuario que captura es obligatorio.");
  if (!Array.isArray(payload.movimientos)) errors.push("Movimientos debe ser una lista.");
  if (!Array.isArray(payload.conteos)) errors.push("Conteos debe ser una lista.");
  if (!Array.isArray(payload.resumenOficinas)) errors.push("Resumen de oficinas debe ser una lista.");
  return errors;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
