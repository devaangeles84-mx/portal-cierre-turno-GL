const HEADERS = {
  Usuarios: ["usuario", "passwordHash", "passwordTemporal", "nombre", "rol", "oficina", "activo"],
  CierresTurno: [
    "cierreId",
    "createdAt",
    "fechaCierre",
    "turno",
    "oficina",
    "usuarioCaptura",
    "estatus",
    "efectivoReportado",
    "efectivoContado",
    "egresos",
    "osPendientes",
    "ingresosOS",
    "liberaciones",
    "kashpay",
    "terminalBBVA",
    "transferencia",
    "pensiones",
    "totalEfectivo",
    "totalKashpay",
    "totalTerminal",
    "totalTransferencia",
    "totalPendientes",
    "totalPensiones",
    "totalGeneral",
    "diferenciaGeneral",
    "observaciones",
    "entregaNombre",
    "recibeNombre",
    "trasladaNombre",
    "timestampGuardado",
    "timestampEnviado"
  ],
  CierreMovimientos: [
    "movimientoId",
    "cierreId",
    "oficina",
    "tipoMovimiento",
    "metodoPago",
    "folioOS",
    "clienteRazonSocial",
    "division",
    "autorizo",
    "importe",
    "comentarios"
  ],
  CierreConteoEfectivo: [
    "conteoId",
    "cierreId",
    "oficina",
    "concepto",
    "denominacion",
    "cantidad",
    "importe"
  ],
  CierreOficinasResumen: [
    "resumenId",
    "cierreId",
    "oficina",
    "efectivoReportado",
    "efectivoContado",
    "egresos",
    "ingresos",
    "liberaciones",
    "kashpay",
    "terminalBBVA",
    "transferencia",
    "pensiones",
    "pendientes",
    "importeSinPensiones",
    "importeConPensiones",
    "diferencia"
  ],
  Catalogos: ["tipoCatalogo", "clave", "valor", "activo", "orden"]
};

const DEFAULT_CATALOGOS = [
  ["Oficinas", "alvarez", "Alvarez", true, 1],
  ["Oficinas", "la-partida", "La Partida (Matamoros)", true, 2],
  ["Oficinas", "la-union", "La Union", true, 3],
  ["Oficinas", "el-triunfo", "El Triunfo", true, 4],
  ["Oficinas", "encierro-gomez-walmart", "Encierro Gomez (Walmart)", true, 5],
  ["MetodosPago", "efectivo", "Efectivo", true, 1],
  ["MetodosPago", "kashpay", "Kashpay", true, 2],
  ["MetodosPago", "terminal-bbva", "Terminal BBVA", true, 3],
  ["MetodosPago", "transferencia", "Transferencia", true, 4],
  ["MetodosPago", "no-aplica", "No aplica", true, 5],
  ["TiposMovimiento", "egreso", "Egreso", true, 1],
  ["TiposMovimiento", "os-pendiente", "O.S. pendiente", true, 2],
  ["TiposMovimiento", "os-recibida", "O.S. recibida", true, 3],
  ["TiposMovimiento", "liberacion", "Liberacion", true, 4],
  ["TiposMovimiento", "pension", "Pension", true, 5],
  ["TiposMovimiento", "apoyo", "Apoyo", true, 6],
  ["TiposMovimiento", "otro", "Otro", true, 7],
  ["Denominaciones", "1000", "1000", true, 1],
  ["Denominaciones", "500", "500", true, 2],
  ["Denominaciones", "200", "200", true, 3],
  ["Denominaciones", "100", "100", true, 4],
  ["Denominaciones", "50", "50", true, 5],
  ["Denominaciones", "20", "20", true, 6],
  ["Denominaciones", "10", "10", true, 7],
  ["Denominaciones", "5", "5", true, 8],
  ["Denominaciones", "2", "2", true, 9],
  ["Denominaciones", "1", "1", true, 10],
  ["Denominaciones", "0.5", "0.5", true, 11],
  ["Denominaciones", "0.2", "0.2", true, 12],
  ["Denominaciones", "0.1", "0.1", true, 13],
  ["Turnos", "matutino", "Matutino", true, 1],
  ["Turnos", "vespertino", "Vespertino", true, 2],
  ["Turnos", "nocturno", "Nocturno", true, 3],
  ["Turnos", "general", "General", true, 4]
];

const DEFAULT_USUARIOS = [
  ["admin", "", "admin123", "Administrador", "ADMIN", "", true],
  ["alvarez", "", "alvarez123", "Usuario Alvarez", "OFICINA", "Alvarez", true],
  ["partida", "", "partida123", "Usuario La Partida", "OFICINA", "La Partida (Matamoros)", true],
  ["union", "", "union123", "Usuario La Union", "OFICINA", "La Union", true],
  ["triunfo", "", "triunfo123", "Usuario El Triunfo", "OFICINA", "El Triunfo", true],
  ["gomez", "", "gomez123", "Usuario Encierro Gomez", "OFICINA", "Encierro Gomez (Walmart)", true]
];

function doGet(e) {
  try {
    setupSheets();
    const action = e && e.parameter ? e.parameter.action : "";

    if (action === "catalogos") {
      validateGasToken(e.parameter.token);
      return jsonResponse({ ok: true, catalogos: getCatalogos() });
    }

    return jsonResponse({ ok: true, message: "Cierre de Turno API activa." });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    setupSheets();

    const payload = JSON.parse(e.postData.contents || "{}");
    validateGasToken(payload.token);

    if (payload.action === "login") return jsonResponse(login(payload));
    if (payload.action === "listCierres") return jsonResponse(listCierres(payload));
    if (payload.action === "getCierre") return jsonResponse(getCierre(payload));
    if (payload.action === "reopenCierre") return jsonResponse(reopenCierre(payload));

    return jsonResponse(saveCierre(payload));
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  } finally {
    lock.releaseLock();
  }
}

function setupSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(HEADERS).forEach(function (sheetName) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) sheet = spreadsheet.insertSheet(sheetName);

    const headers = HEADERS[sheetName];
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const isEmpty = existing.every(function (value) {
      return value === "";
    });
    const headerChanged = existing.join("|") !== headers.join("|");

    if (isEmpty || headerChanged) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });

  seedCatalogos();
  seedUsuarios();
}

function seedCatalogos() {
  appendMissingRows("Catalogos", DEFAULT_CATALOGOS, function (row) {
    return row[0] + "|" + row[1];
  });
}

function seedUsuarios() {
  appendMissingRows("Usuarios", DEFAULT_USUARIOS, function (row) {
    return row[0];
  });
}

function appendMissingRows(sheetName, defaultRows, keyFn) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();
  const existingKeys = new Set();

  if (lastRow > 1) {
    const rows = sheet.getRange(2, 1, lastRow - 1, defaultRows[0].length).getValues();
    rows.forEach(function (row) {
      existingKeys.add(keyFn(row));
    });
  }

  const missingRows = defaultRows.filter(function (row) {
    return !existingKeys.has(keyFn(row));
  });

  if (missingRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, missingRows.length, missingRows[0].length).setValues(missingRows);
  }
}

function login(payload) {
  const usuario = String(payload.usuario || "").trim().toLowerCase();
  const password = String(payload.password || "");
  if (!usuario || !password) throw new Error("Usuario y contrasena son obligatorios.");

  const user = readObjects("Usuarios").find(function (row) {
    return String(row.usuario).toLowerCase() === usuario && isActive(row.activo);
  });

  if (!user) throw new Error("Usuario o contrasena incorrectos.");

  const expectedHash = String(user.passwordHash || "");
  const tempPassword = String(user.passwordTemporal || "");
  const validByHash = expectedHash && expectedHash === hashPassword(password);
  const validByTemp = tempPassword && tempPassword === password;

  if (!validByHash && !validByTemp) throw new Error("Usuario o contrasena incorrectos.");

  const session = {
    usuario: user.usuario,
    nombre: user.nombre,
    rol: user.rol,
    oficina: user.oficina || "",
    sessionToken: createSessionToken(user)
  };

  return { ok: true, session: session };
}

function saveCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  const cierre = payload.cierre || {};
  const movimientos = payload.movimientos || [];
  const conteos = payload.conteos || [];
  const resumenOficinas = payload.resumenOficinas || [];
  const isDraft = payload.action === "saveDraft" || cierre.estatus === "Borrador";

  if (!cierre.fechaCierre) throw new Error("fechaCierre es obligatorio.");
  if (!cierre.usuarioCaptura) throw new Error("usuarioCaptura es obligatorio.");

  const oficina = session.rol === "OFICINA" ? session.oficina : cierre.oficina;
  if (session.rol === "OFICINA" && cierre.oficina !== session.oficina) {
    throw new Error("No puedes guardar cierres de otra oficina.");
  }

  const summary = resumenOficinas[0] || {};
  const cierreId =
    cierre.cierreId ||
    "CIERRE-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + shortId();
  const now = new Date();

  appendRows("CierresTurno", [
    [
      cierreId,
      now,
      cierre.fechaCierre,
      cierre.turno || "",
      oficina || "",
      session.usuario || cierre.usuarioCaptura || "",
      isDraft ? "Borrador" : "Enviado",
      number(summary.efectivoReportado),
      number(summary.efectivoContado),
      number(summary.egresos),
      number(summary.pendientes),
      number(summary.ingresos),
      number(summary.liberaciones),
      number(summary.kashpay),
      number(summary.terminalBBVA),
      number(summary.transferencia),
      number(summary.pensiones),
      number(cierre.totalEfectivo),
      number(cierre.totalKashpay),
      number(cierre.totalTerminal),
      number(cierre.totalTransferencia),
      number(cierre.totalPendientes),
      number(cierre.totalPensiones),
      number(cierre.totalGeneral),
      number(cierre.diferenciaGeneral),
      cierre.observaciones || "",
      cierre.entregaNombre || "",
      cierre.recibeNombre || "",
      cierre.trasladaNombre || "",
      now,
      isDraft ? "" : now
    ]
  ]);

  appendRows(
    "CierreMovimientos",
    movimientos.map(function (mov) {
      const movOffice = session.rol === "OFICINA" ? session.oficina : mov.oficina;
      return [
        mov.id || Utilities.getUuid(),
        cierreId,
        movOffice || "",
        mov.tipoMovimiento || "",
        mov.metodoPago || "",
        mov.folioOS || "",
        mov.clienteRazonSocial || "",
        mov.division || "",
        mov.autorizo || "",
        number(mov.importe),
        mov.comentarios || ""
      ];
    })
  );

  appendRows(
    "CierreConteoEfectivo",
    conteos.map(function (row) {
      const countOffice = session.rol === "OFICINA" ? session.oficina : row.oficina;
      return [
        row.id || Utilities.getUuid(),
        cierreId,
        countOffice || "",
        row.concepto || "",
        number(row.denominacion),
        number(row.cantidad),
        number(row.cantidad) * number(row.denominacion)
      ];
    })
  );

  appendRows(
    "CierreOficinasResumen",
    resumenOficinas.map(function (row) {
      const rowOffice = session.rol === "OFICINA" ? session.oficina : row.oficina;
      return [
        Utilities.getUuid(),
        cierreId,
        rowOffice || "",
        number(row.efectivoReportado),
        number(row.efectivoContado),
        number(row.egresos),
        number(row.ingresos),
        number(row.liberaciones),
        number(row.kashpay),
        number(row.terminalBBVA),
        number(row.transferencia),
        number(row.pensiones),
        number(row.pendientes),
        number(row.importeSinPensiones),
        number(row.importeConPensiones),
        number(row.diferencia)
      ];
    })
  );

  return {
    ok: true,
    cierreId: cierreId,
    message: isDraft ? "Borrador guardado correctamente" : "Cierre enviado correctamente"
  };
}

function listCierres(payload) {
  const session = validateSessionToken(payload.sessionToken);
  const filters = payload.filters || {};
  let rows = readObjects("CierresTurno");

  if (session.rol === "OFICINA") {
    rows = rows.filter(function (row) {
      return row.oficina === session.oficina;
    });
  }

  rows = rows.filter(function (row) {
    if (filters.fecha && row.fechaCierre !== filters.fecha) return false;
    if (filters.turno && row.turno !== filters.turno) return false;
    if (filters.oficina && row.oficina !== filters.oficina) return false;
    if (filters.usuario && String(row.usuarioCaptura).toLowerCase().indexOf(String(filters.usuario).toLowerCase()) === -1) {
      return false;
    }
    if (filters.estatus && row.estatus !== filters.estatus) return false;
    return true;
  });

  return { ok: true, cierres: rows.reverse().slice(0, 300) };
}

function getCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  const cierreId = payload.cierreId;
  if (!cierreId) throw new Error("cierreId es obligatorio.");

  const cierre = readObjects("CierresTurno").find(function (row) {
    return row.cierreId === cierreId;
  });

  if (!cierre) throw new Error("Cierre no encontrado.");
  if (session.rol === "OFICINA" && cierre.oficina !== session.oficina) {
    throw new Error("No puedes consultar cierres de otra oficina.");
  }

  return {
    ok: true,
    cierre: {
      cierre: cierre,
      movimientos: readObjects("CierreMovimientos").filter(function (row) {
        return row.cierreId === cierreId;
      }),
      conteos: readObjects("CierreConteoEfectivo").filter(function (row) {
        return row.cierreId === cierreId;
      }),
      resumenOficinas: readObjects("CierreOficinasResumen").filter(function (row) {
        return row.cierreId === cierreId;
      })
    }
  };
}

function reopenCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol !== "ADMIN") throw new Error("Solo ADMIN puede reabrir cierres.");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CierresTurno");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  const statusIndex = headers.indexOf("estatus");

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === payload.cierreId) {
      sheet.getRange(i + 1, statusIndex + 1).setValue("Borrador");
      return { ok: true, message: "Cierre reabierto" };
    }
  }

  throw new Error("Cierre no encontrado.");
}

function getCatalogos() {
  const rows = readObjects("Catalogos")
    .filter(function (row) {
      return isActive(row.activo);
    })
    .sort(function (a, b) {
      return number(a.orden) - number(b.orden);
    });

  return {
    oficinas: pickCatalog(rows, "Oficinas"),
    metodosPago: pickCatalog(rows, "MetodosPago"),
    tiposMovimiento: pickCatalog(rows, "TiposMovimiento"),
    denominaciones: pickCatalog(rows, "Denominaciones").map(Number),
    turnos: pickCatalog(rows, "Turnos")
  };
}

function pickCatalog(rows, type) {
  return rows
    .filter(function (row) {
      return row.tipoCatalogo === type;
    })
    .map(function (row) {
      return row.valor;
    });
}

function appendRows(sheetName, rows) {
  if (!rows || rows.length === 0) return;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function readObjects(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  return values
    .filter(function (row) {
      return row.some(function (value) {
        return value !== "";
      });
    })
    .map(function (row) {
      const object = {};
      headers.forEach(function (header, index) {
        object[header] = row[index];
      });
      return object;
    });
}

function validateGasToken(receivedToken) {
  const expected = PropertiesService.getScriptProperties().getProperty("GAS_EXECUTION_TOKEN");
  if (!expected) throw new Error("Configura GAS_EXECUTION_TOKEN en Script Properties.");
  if (receivedToken !== expected) throw new Error("Token no autorizado.");
}

function createSessionToken(user) {
  const issuedAt = Date.now();
  const data = JSON.stringify({
    usuario: user.usuario,
    rol: user.rol,
    oficina: user.oficina || "",
    issuedAt: issuedAt
  });
  const encoded = Utilities.base64EncodeWebSafe(data);
  const signature = sign(encoded);
  return encoded + "." + signature;
}

function validateSessionToken(sessionToken) {
  if (!sessionToken) throw new Error("Sesion requerida.");
  const parts = String(sessionToken).split(".");
  if (parts.length !== 2) throw new Error("Sesion invalida.");
  if (sign(parts[0]) !== parts[1]) throw new Error("Sesion invalida.");

  const session = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());
  const maxAgeMs = 1000 * 60 * 60 * 12;
  if (Date.now() - Number(session.issuedAt) > maxAgeMs) throw new Error("Sesion expirada.");

  return session;
}

function sign(value) {
  const secret = PropertiesService.getScriptProperties().getProperty("GAS_EXECUTION_TOKEN");
  const bytes = Utilities.computeHmacSha256Signature(value, secret);
  return bytes
    .map(function (byte) {
      const normalized = byte < 0 ? byte + 256 : byte;
      return ("0" + normalized.toString(16)).slice(-2);
    })
    .join("");
}

function hashPassword(password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return bytes
    .map(function (byte) {
      const normalized = byte < 0 ? byte + 256 : byte;
      return ("0" + normalized.toString(16)).slice(-2);
    })
    .join("");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function number(value) {
  const parsed = Number(value);
  return isFinite(parsed) ? parsed : 0;
}

function isActive(value) {
  return String(value).toLowerCase() !== "false" && value !== false && value !== "";
}

function shortId() {
  return Utilities.getUuid().slice(0, 8).toUpperCase();
}
