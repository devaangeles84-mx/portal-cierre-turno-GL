import { DEFAULT_CATALOGOS } from "../utils/calculations";

const LOCAL_CIERRES_KEY = "cierre-turno-local-cierres";

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
      const cierreId = saveLocalCierre(payload);
      return {
        ok: true,
        cierreId,
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
      return { ok: true, cierres: listLocalCierres(filters) };
    }
    throw error;
  }
}

export async function getCierreDetalle({ sessionToken, cierreId }) {
  try {
    const response = await fetch("/api/get-cierre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, cierreId })
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      const cierre = getLocalCierre(cierreId);
      if (cierre) return { ok: true, cierre };
    }
    throw error;
  }
}

export async function validateCierreContabilidad({ sessionToken, cierreId, observacionValidacion }) {
  try {
    const response = await fetch("/api/validate-cierre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, cierreId, observacionValidacion })
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      validateLocalCierre(cierreId, observacionValidacion);
      return { ok: true, message: "Cierre validado localmente." };
    }
    throw error;
  }
}

export async function deleteBorrador({ sessionToken, cierreId }) {
  try {
    const response = await fetch("/api/delete-borrador", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, cierreId })
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      deleteLocalDraft(cierreId);
      return { ok: true, message: "Borrador eliminado localmente." };
    }
    throw error;
  }
}

export async function reopenCierre({ sessionToken, cierreId }) {
  try {
    const response = await fetch("/api/reopen-cierre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken, cierreId })
    });
    return await parseResponse(response);
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      reopenLocalCierre(cierreId);
      return { ok: true, message: "Cierre reabierto localmente." };
    }
    throw error;
  }
}

function localDemoSession(usuario) {
  const users = {
    admin: { usuario: "admin", nombre: "Administrador", rol: "ADMIN", oficina: "" },
    conta: { usuario: "conta", nombre: "Contabilidad", rol: "CONTABILIDAD", oficina: "" },
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

function saveLocalCierre(payload) {
  const cierres = readLocalCierres();
  const cierre = payload.cierre || {};
  const oficina = cierre.oficina;
  const status = payload.action === "saveDraft" ? "Borrador" : "Enviado";
  const existingIndex =
    cierre.cierreId
      ? cierres.findIndex((item) => item.cierre.cierreId === cierre.cierreId)
      : cierres.findIndex(
          (item) =>
            item.cierre.fechaCierre === cierre.fechaCierre &&
            item.cierre.turno === cierre.turno &&
            item.cierre.oficina === oficina &&
            item.cierre.estatus === "Borrador"
        );
  const cierreId = existingIndex >= 0 ? cierres[existingIndex].cierre.cierreId : `LOCAL-${Date.now()}`;
  const record = {
    cierre: {
      ...cierre,
      cierreId,
      estatus: status,
      timestampGuardado: new Date().toISOString(),
      timestampEnviado: status === "Enviado" ? new Date().toISOString() : ""
    },
    movimientos: payload.movimientos || [],
    conteos: payload.conteos || [],
    valesAseguradora: payload.valesAseguradora || [],
    resumenOficinas: payload.resumenOficinas || [],
    auditoria: [
      ...(existingIndex >= 0 ? cierres[existingIndex].auditoria || [] : []),
      {
        accion: status === "Borrador" ? "GUARDAR_BORRADOR" : "ENVIAR_CIERRE",
        usuarioId: cierre.usuarioCaptura,
        usuarioNombre: cierre.usuarioNombre,
        oficinaSeleccionada: oficina,
        timestamp: new Date().toISOString()
      }
    ]
  };
  if (existingIndex >= 0) cierres[existingIndex] = record;
  else cierres.push(record);
  localStorage.setItem(LOCAL_CIERRES_KEY, JSON.stringify(cierres));
  return cierreId;
}

function listLocalCierres(filters = {}) {
  return readLocalCierres()
    .map((item) => item.cierre)
    .filter((cierre) => {
      if (filters.fecha && cierre.fechaCierre !== filters.fecha) return false;
      if (filters.fechaInicio && cierre.fechaCierre < filters.fechaInicio) return false;
      if (filters.fechaFin && cierre.fechaCierre > filters.fechaFin) return false;
      if (filters.turno && cierre.turno !== filters.turno) return false;
      if (filters.oficina && cierre.oficina !== filters.oficina) return false;
      if (filters.usuario && !String(cierre.usuarioCaptura || "").toLowerCase().includes(String(filters.usuario).toLowerCase())) return false;
      if (filters.estatus && cierre.estatus !== filters.estatus) return false;
      return true;
    })
    .reverse();
}

function getLocalCierre(cierreId) {
  return readLocalCierres().find((item) => item.cierre.cierreId === cierreId);
}

function validateLocalCierre(cierreId, observacionValidacion) {
  const cierres = readLocalCierres();
  const index = cierres.findIndex((item) => item.cierre.cierreId === cierreId);
  if (index < 0) throw new Error("Cierre no encontrado.");
  if (cierres[index].cierre.estatus === "Validado") throw new Error("Este cierre ya fue validado.");
  cierres[index].cierre.estatus = "Validado";
  cierres[index].cierre.validadoPorUsuarioId = "conta";
  cierres[index].cierre.validadoPorNombre = "Contabilidad";
  cierres[index].cierre.validadoTimestamp = new Date().toISOString();
  cierres[index].cierre.observacionValidacion = observacionValidacion || "";
  cierres[index].auditoria = [
    ...(cierres[index].auditoria || []),
    {
      accion: "VALIDAR_CIERRE",
      usuarioId: "conta",
      usuarioNombre: "Contabilidad",
      oficinaSeleccionada: cierres[index].cierre.oficina,
      timestamp: new Date().toISOString()
    }
  ];
  localStorage.setItem(LOCAL_CIERRES_KEY, JSON.stringify(cierres));
}

function reopenLocalCierre(cierreId) {
  const cierres = readLocalCierres();
  const index = cierres.findIndex((item) => item.cierre.cierreId === cierreId);
  if (index < 0) throw new Error("Cierre no encontrado.");
  if (cierres[index].cierre.estatus === "Validado") throw new Error("No se puede reabrir un cierre validado.");
  cierres[index].cierre.estatus = "Borrador";
  cierres[index].cierre.timestampEnviado = "";
  cierres[index].auditoria = [
    ...(cierres[index].auditoria || []),
    {
      accion: "REABRIR_CIERRE",
      usuarioId: "admin",
      usuarioNombre: "Administrador",
      oficinaSeleccionada: cierres[index].cierre.oficina,
      timestamp: new Date().toISOString()
    }
  ];
  localStorage.setItem(LOCAL_CIERRES_KEY, JSON.stringify(cierres));
}

function deleteLocalDraft(cierreId) {
  const cierres = readLocalCierres();
  const next = cierres.filter((item) => item.cierre.cierreId !== cierreId || item.cierre.estatus !== "Borrador");
  localStorage.setItem(LOCAL_CIERRES_KEY, JSON.stringify(next));
}

function readLocalCierres() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CIERRES_KEY)) || [];
  } catch {
    return [];
  }
}
