import { DEFAULT_CATALOGOS } from "../utils/calculations";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || "No se pudo completar la operacion.");
  }
  return data;
}

export async function getCatalogos() {
  try {
    const response = await fetch("/api/get-catalogos");
    const data = await parseResponse(response);
    return {
      ...DEFAULT_CATALOGOS,
      ...data.catalogos
    };
  } catch (error) {
    console.warn("Usando catalogos locales:", error.message);
    return DEFAULT_CATALOGOS;
  }
}

export async function submitCierre(payload) {
  try {
    const response = await fetch("/api/submit-cierre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return {
        ok: true,
        cierreId: `LOCAL-${Date.now()}`,
        message: payload.action === "saveDraft" ? "Borrador guardado localmente." : "Cierre enviado localmente."
      };
    }
    throw error;
  }
}

export async function loginUser({ usuario, password }) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      const session = localDemoSession(usuario);
      if (session) return { ok: true, session };
    }
    throw error;
  }
}

export async function listCierres({ sessionToken, filters }) {
  const response = await fetch("/api/list-cierres", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken, filters })
  });
  try {
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return { ok: true, cierres: [] };
    }
    throw error;
  }
}

export async function getCierreDetalle({ sessionToken, cierreId }) {
  const response = await fetch("/api/get-cierre", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken, cierreId })
  });
  return parseResponse(response);
}

function localDemoSession(usuario) {
  const users = {
    admin: { usuario: "admin", nombre: "Administrador", rol: "ADMIN", oficina: "" },
    alvarez: { usuario: "alvarez", nombre: "Usuario Alvarez", rol: "OFICINA", oficina: "Alvarez" },
    partida: {
      usuario: "partida",
      nombre: "Usuario La Partida",
      rol: "OFICINA",
      oficina: "La Partida (Matamoros)"
    },
    union: { usuario: "union", nombre: "Usuario La Union", rol: "OFICINA", oficina: "La Union" },
    triunfo: { usuario: "triunfo", nombre: "Usuario El Triunfo", rol: "OFICINA", oficina: "El Triunfo" },
    gomez: {
      usuario: "gomez",
      nombre: "Usuario Encierro Gomez",
      rol: "OFICINA",
      oficina: "Encierro Gomez (Walmart)"
    }
  };
  const key = String(usuario || "").trim().toLowerCase();
  if (!users[key]) return null;
  return { ...users[key], sessionToken: `local-demo-${key}` };
}
