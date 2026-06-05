export async function handler() {
  const gasUrl = process.env.GAS_WEBAPP_URL;
  const token = process.env.GAS_EXECUTION_TOKEN;

  if (!gasUrl || !token) {
    return json(200, {
      ok: false,
      message: "Faltan variables de entorno. Se usaran catalogos locales."
    });
  }

  try {
    const url = new URL(gasUrl);
    url.searchParams.set("action", "catalogos");
    url.searchParams.set("token", token);

    const response = await fetch(url);
    const data = await response.json();
    return json(response.ok && data.ok !== false ? 200 : 502, data);
  } catch (error) {
    return json(502, {
      ok: false,
      message: `No se pudieron cargar catalogos: ${error.message}`
    });
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
