const HEADERS = {
  Usuarios: ["usuario", "passwordHash", "passwordTemporal", "nombre", "rol", "oficina", "activo"],
  CierresTurno: [
    "cierreId",
    "createdAt",
    "fechaCierre",
    "turno",
    "oficina",
    "usuarioCaptura",
    "usuarioNombre",
    "estatus",
    "efectivoReportado",
    "efectivoContado",
    "egresos",
    "osPendientes",
    "ingresosOS",
    "liberaciones",
    "clip",
    "kashpay",
    "terminalBBVA",
    "transferencia",
    "pensiones",
    "sobrantes",
    "faltantes",
    "totalEfectivo",
    "totalClip",
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
    "rutaValija",
    "timestampGuardado",
    "timestampEnviado",
    "validadoPorUsuarioId",
    "validadoPorNombre",
    "validadoTimestamp",
    "observacionValidacion"
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
  CierreConteoEfectivo: ["conteoId", "cierreId", "oficina", "concepto", "denominacion", "cantidad", "importe"],
  CierreValesAseguradora: [
    "valeId",
    "cierreId",
    "oficina",
    "ordenGrips",
    "aseguradora",
    "folioVale",
    "vehiculo",
    "marca",
    "modelo",
    "color",
    "anio",
    "comentarios"
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
    "clip",
    "kashpay",
    "terminalBBVA",
    "transferencia",
    "pensiones",
    "sobrantes",
    "faltantes",
    "pendientes",
    "importeSinPensiones",
    "importeConPensiones",
    "diferencia"
  ],
  CierreAuditoria: [
    "auditId",
    "cierreId",
    "usuarioId",
    "usuarioNombre",
    "oficinaHabitual",
    "oficinaSeleccionada",
    "fechaCierre",
    "turno",
    "estatus",
    "accion",
    "timestamp"
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
  ["MetodosPago", "clip", "CLIP", true, 2],
  ["MetodosPago", "terminal-bbva", "Terminal BBVA", true, 3],
  ["MetodosPago", "transferencia", "Transferencia", true, 4],
  ["MetodosPago", "no-aplica", "No aplica", true, 5],
  ["TiposMovimiento", "egreso", "Egreso", true, 1],
  ["TiposMovimiento", "os-pendiente", "O.S. pendiente", true, 2],
  ["TiposMovimiento", "os-recibida", "O.S. recibida", true, 3],
  ["TiposMovimiento", "liberacion", "Liberacion", true, 4],
  ["TiposMovimiento", "pension", "Pension", true, 5],
  ["TiposMovimiento", "sobrante", "Sobrante", true, 6],
  ["TiposMovimiento", "faltante", "Faltante", true, 7],
  ["TiposMovimiento", "apoyo", "Apoyo", true, 8],
  ["TiposMovimiento", "otro", "Otro", true, 9],
  ["Divisiones", "gruas-arrastre", "Gruas de Arrastre", true, 1],
  ["Divisiones", "encierro", "Encierro", true, 2],
  ["Divisiones", "montacargas", "Montacargas", true, 3],
  ["Divisiones", "industrial", "Industrial", true, 4],
  ["Autorizo", "hgg", "HGG", true, 1],
  ["Autorizo", "hsg", "HSG", true, 2],
  ["Autorizo", "mga", "MGA", true, 3],
  ["Autorizo", "kga", "KGA", true, 4],
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
  ["Turnos", "matutino", "Matutino", true, 1],
  ["Turnos", "vespertino", "Vespertino", true, 2],
  ["Turnos", "nocturno", "Nocturno", true, 3],
  ["Turnos", "general", "General", true, 4]
];

const DEFAULT_USUARIOS = [
  ["admin", "", "admin123", "Administrador", "ADMIN", "", true],
  ["conta", "", "conta123", "Contabilidad", "CONTABILIDAD", "", true],
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
    if (payload.action === "validateCierre") return jsonResponse(validateCierreContabilidad(payload));
    if (payload.action === "deleteDraft") return jsonResponse(deleteDraft(payload));
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
    ensureHeaders(sheet, HEADERS[sheetName]);
  });
  seedCatalogos();
  seedUsuarios();
  deactivateSmallDenominations();
}

function ensureHeaders(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
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

function deactivateSmallDenominations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Catalogos");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const typeIndex = headers.indexOf("tipoCatalogo");
  const valueIndex = headers.indexOf("valor");
  const activeIndex = headers.indexOf("activo");
  for (let i = 1; i < values.length; i += 1) {
    if (values[i][typeIndex] === "Denominaciones" && number(values[i][valueIndex]) < 0.5) {
      sheet.getRange(i + 1, activeIndex + 1).setValue(false);
    }
    if (values[i][typeIndex] === "MetodosPago" && String(values[i][valueIndex]).toLowerCase() === "kashpay") {
      sheet.getRange(i + 1, activeIndex + 1).setValue(false);
    }
  }
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

  return {
    ok: true,
    session: {
      usuario: user.usuario,
      nombre: user.nombre,
      rol: String(user.rol || "").toUpperCase(),
      oficina: user.oficina || "",
      sessionToken: createSessionToken(user)
    }
  };
}

function saveCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol === "CONTABILIDAD") throw new Error("Contabilidad no puede capturar cierres.");

  const cierre = payload.cierre || {};
  const movimientos = payload.movimientos || [];
  const conteos = payload.conteos || [];
  const valesAseguradora = payload.valesAseguradora || [];
  const resumenOficinas = payload.resumenOficinas || [];
  const isDraft = payload.action === "saveDraft" || normalizeStatus(cierre.estatus) === "BORRADOR";
  const targetStatus = isDraft ? "Borrador" : "Enviado";
  const oficina = String(cierre.oficina || cierre.oficinaSeleccionada || "").trim();

  if (!cierre.fechaCierre) throw new Error("fechaCierre es obligatorio.");
  if (!cierre.turno) throw new Error("turno es obligatorio.");
  if (!oficina) throw new Error("oficina es obligatorio.");
  if (!session.usuario) throw new Error("Sesion invalida.");
  if (normalizeStatus(cierre.estatus) === "VALIDADO") throw new Error("No se puede sobrescribir un cierre validado.");
  validateOffice(oficina);

  let cierreId = cierre.cierreId;
  if (!cierreId) {
    const existingDraft = findDraft(cierre.fechaCierre, cierre.turno, oficina);
    cierreId = existingDraft ? existingDraft.cierreId : "";
  }
  if (!cierreId) cierreId = "CIERRE-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + shortId();

  const now = new Date();
  const row = makeCierreRow({
    cierreId,
    cierre,
    summary: resumenOficinas[0] || {},
    session,
    oficina,
    status: targetStatus,
    now
  });

  upsertCierre(cierreId, row);
  replaceChildren("CierreMovimientos", cierreId, movimientos.map(function (mov) {
    return [
      mov.id || Utilities.getUuid(),
      cierreId,
      oficina,
      mov.tipoMovimiento || "",
      normalizePayment(mov.metodoPago),
      mov.folioOS || "",
      mov.clienteRazonSocial || "",
      mov.division || "",
      mov.autorizo || "",
      number(mov.importe),
      mov.comentarios || ""
    ];
  }));
  replaceChildren("CierreConteoEfectivo", cierreId, conteos.map(function (count) {
    return [
      count.id || Utilities.getUuid(),
      cierreId,
      oficina,
      "Consolidado",
      number(count.denominacion),
      number(count.cantidad),
      number(count.cantidad) * number(count.denominacion)
    ];
  }));
  replaceChildren("CierreValesAseguradora", cierreId, valesAseguradora.map(function (vale) {
    return [
      vale.id || Utilities.getUuid(),
      cierreId,
      oficina,
      vale.ordenGrips || "",
      vale.aseguradora || "",
      vale.folioVale || "",
      vale.vehiculo || "",
      vale.marca || "",
      vale.modelo || "",
      vale.color || "",
      vale.anio || "",
      vale.comentarios || ""
    ];
  }));
  replaceChildren("CierreOficinasResumen", cierreId, resumenOficinas.map(function (summary) {
    return [
      Utilities.getUuid(),
      cierreId,
      oficina,
      number(summary.efectivoReportado),
      number(summary.efectivoContado),
      number(summary.egresos),
      number(summary.ingresos),
      number(summary.liberaciones),
      number(summary.clip || summary.kashpay),
      number(summary.kashpay || summary.clip),
      number(summary.terminalBBVA),
      number(summary.transferencia),
      number(summary.pensiones),
      number(summary.sobrantes),
      number(summary.faltantes),
      number(summary.pendientes),
      number(summary.importeSinPensiones),
      number(summary.importeConPensiones),
      number(summary.diferencia)
    ];
  }));

  audit(session, {
    cierreId,
    oficina,
    fechaCierre: cierre.fechaCierre,
    turno: cierre.turno,
    estatus: targetStatus,
    accion: isDraft ? "GUARDAR_BORRADOR" : "ENVIAR_CIERRE"
  });

  return {
    ok: true,
    cierreId,
    message: isDraft ? "Borrador guardado correctamente" : "Cierre enviado correctamente"
  };
}

function makeCierreRow(args) {
  const cierre = args.cierre;
  const summary = args.summary;
  const session = args.session;
  const status = args.status;
  const now = args.now;
  const clip = number(summary.clip || summary.kashpay || cierre.totalClip || cierre.totalKashpay);
  return [
    args.cierreId,
    cierre.createdAt || now,
    normalizeDateKey(cierre.fechaCierre),
    cierre.turno || "",
    args.oficina || "",
    session.usuario || cierre.usuarioCaptura || "",
    session.nombre || cierre.usuarioNombre || cierre.usuarioCaptura || "",
    status,
    number(summary.efectivoReportado),
    number(summary.efectivoContado),
    number(summary.egresos),
    number(summary.pendientes),
    number(summary.ingresos),
    number(summary.liberaciones),
    clip,
    clip,
    number(summary.terminalBBVA),
    number(summary.transferencia),
    number(summary.pensiones),
    number(summary.sobrantes),
    number(summary.faltantes),
    number(cierre.totalEfectivo),
    clip,
    clip,
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
    cierre.rutaValija || "",
    now,
    status === "Enviado" ? now : "",
    cierre.validadoPorUsuarioId || "",
    cierre.validadoPorNombre || "",
    cierre.validadoTimestamp || "",
    cierre.observacionValidacion || ""
  ];
}

function upsertCierre(cierreId, row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CierresTurno");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  const statusIndex = headers.indexOf("estatus");
  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === cierreId) {
      if (normalizeStatus(values[i][statusIndex]) === "VALIDADO") throw new Error("No se puede sobrescribir un cierre validado.");
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function findDraft(fechaCierre, turno, oficina) {
  return readObjects("CierresTurno").find(function (row) {
    return (
      normalizeDateKey(row.fechaCierre) === normalizeDateKey(fechaCierre) &&
      row.turno === turno &&
      row.oficina === oficina &&
      normalizeStatus(row.estatus) === "BORRADOR"
    );
  });
}

function listCierres(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol === "OFICINA") throw new Error("El usuario de oficina no tiene acceso al panel.");
  const filters = payload.filters || {};
  let rows = readObjects("CierresTurno");

  if (session.rol === "CONTABILIDAD") {
    rows = rows.filter(function (row) {
      return ["ENVIADO", "VALIDADO"].indexOf(normalizeStatus(row.estatus)) !== -1;
    });
  }

  rows = rows.filter(function (row) {
    const fecha = normalizeDateKey(row.fechaCierre);
    if (filters.fecha && fecha !== filters.fecha) return false;
    if (filters.fechaInicio && fecha < normalizeDateKey(filters.fechaInicio)) return false;
    if (filters.fechaFin && fecha > normalizeDateKey(filters.fechaFin)) return false;
    if (filters.turno && row.turno !== filters.turno) return false;
    if (filters.oficina && row.oficina !== filters.oficina) return false;
    if (filters.usuario && String(row.usuarioCaptura).toLowerCase().indexOf(String(filters.usuario).toLowerCase()) === -1) return false;
    if (filters.estatus && normalizeStatus(row.estatus) !== normalizeStatus(filters.estatus)) return false;
    row.fechaCierre = fecha;
    row.estatus = displayStatus(row.estatus);
    row.totalClip = number(row.totalClip || row.totalKashpay || row.clip || row.kashpay);
    return true;
  });

  return { ok: true, cierres: rows.reverse().slice(0, 300) };
}

function getCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol === "OFICINA") throw new Error("El usuario de oficina no tiene acceso al detalle administrativo.");
  const cierreId = payload.cierreId;
  if (!cierreId) throw new Error("cierreId es obligatorio.");
  const cierre = readObjects("CierresTurno").find(function (row) {
    return row.cierreId === cierreId;
  });
  if (!cierre) throw new Error("Cierre no encontrado.");
  cierre.fechaCierre = normalizeDateKey(cierre.fechaCierre);
  cierre.estatus = displayStatus(cierre.estatus);
  cierre.totalClip = number(cierre.totalClip || cierre.totalKashpay || cierre.clip || cierre.kashpay);

  return {
    ok: true,
    cierre: {
      cierre,
      movimientos: readObjects("CierreMovimientos").filter(byCierreId(cierreId)).map(function (row) {
        row.metodoPago = row.metodoPago === "Kashpay" ? "CLIP" : row.metodoPago;
        return row;
      }),
      conteos: readObjects("CierreConteoEfectivo").filter(byCierreId(cierreId)),
      valesAseguradora: readObjects("CierreValesAseguradora").filter(byCierreId(cierreId)),
      resumenOficinas: readObjects("CierreOficinasResumen").filter(byCierreId(cierreId)),
      auditoria: readObjects("CierreAuditoria").filter(byCierreId(cierreId))
    }
  };
}

function validateCierreContabilidad(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol !== "CONTABILIDAD" && session.rol !== "ADMIN") throw new Error("Solo Contabilidad puede validar cierres.");
  const cierreId = payload.cierreId;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CierresTurno");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  const statusIndex = headers.indexOf("estatus");
  const diffIndex = headers.indexOf("diferenciaGeneral");
  const validatedUserIndex = headers.indexOf("validadoPorUsuarioId");
  const validatedNameIndex = headers.indexOf("validadoPorNombre");
  const validatedAtIndex = headers.indexOf("validadoTimestamp");
  const noteIndex = headers.indexOf("observacionValidacion");

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] !== cierreId) continue;
    if (normalizeStatus(values[i][statusIndex]) === "VALIDADO") throw new Error("Este cierre ya fue validado.");
    if (normalizeStatus(values[i][statusIndex]) !== "ENVIADO") throw new Error("Solo se pueden validar cierres enviados.");
    if (hasMeaningfulDifference(values[i][diffIndex]) && !String(payload.observacionValidacion || "").trim()) {
      throw new Error("La observacion de validacion es obligatoria cuando existe diferencia.");
    }
    const now = new Date();
    sheet.getRange(i + 1, statusIndex + 1).setValue("Validado");
    sheet.getRange(i + 1, validatedUserIndex + 1).setValue(session.usuario);
    sheet.getRange(i + 1, validatedNameIndex + 1).setValue(session.nombre || session.usuario);
    sheet.getRange(i + 1, validatedAtIndex + 1).setValue(now);
    sheet.getRange(i + 1, noteIndex + 1).setValue(payload.observacionValidacion || "");
    audit(session, {
      cierreId,
      oficina: values[i][headers.indexOf("oficina")],
      fechaCierre: values[i][headers.indexOf("fechaCierre")],
      turno: values[i][headers.indexOf("turno")],
      estatus: "Validado",
      accion: "VALIDAR_CIERRE"
    });
    return { ok: true, message: "Cierre validado por Contabilidad." };
  }
  throw new Error("Cierre no encontrado.");
}

function deleteDraft(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol !== "ADMIN") throw new Error("Solo ADMIN puede eliminar borradores.");
  const cierreId = payload.cierreId;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CierresTurno");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  const statusIndex = headers.indexOf("estatus");
  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] !== cierreId) continue;
    if (normalizeStatus(values[i][statusIndex]) !== "BORRADOR") throw new Error("Solo se pueden eliminar borradores.");
    const oficina = values[i][headers.indexOf("oficina")];
    const fechaCierre = values[i][headers.indexOf("fechaCierre")];
    const turno = values[i][headers.indexOf("turno")];
    sheet.deleteRow(i + 1);
    deleteChildren("CierreMovimientos", cierreId);
    deleteChildren("CierreConteoEfectivo", cierreId);
    deleteChildren("CierreValesAseguradora", cierreId);
    deleteChildren("CierreOficinasResumen", cierreId);
    audit(session, { cierreId, oficina, fechaCierre, turno, estatus: "Borrador", accion: "ELIMINAR_BORRADOR" });
    return { ok: true, message: "Borrador eliminado." };
  }
  throw new Error("Cierre no encontrado.");
}

function reopenCierre(payload) {
  const session = validateSessionToken(payload.sessionToken);
  if (session.rol !== "ADMIN") throw new Error("Solo ADMIN puede reabrir cierres.");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CierresTurno");
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  const statusIndex = headers.indexOf("estatus");
  const sentAtIndex = headers.indexOf("timestampEnviado");
  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === payload.cierreId) {
      if (normalizeStatus(values[i][statusIndex]) === "VALIDADO") throw new Error("No se puede reabrir un cierre validado.");
      if (normalizeStatus(values[i][statusIndex]) !== "ENVIADO") throw new Error("Solo se pueden reabrir cierres enviados.");
      sheet.getRange(i + 1, statusIndex + 1).setValue("Borrador");
      if (sentAtIndex >= 0) sheet.getRange(i + 1, sentAtIndex + 1).setValue("");
      audit(session, {
        cierreId: payload.cierreId,
        oficina: values[i][headers.indexOf("oficina")],
        fechaCierre: values[i][headers.indexOf("fechaCierre")],
        turno: values[i][headers.indexOf("turno")],
        estatus: "Borrador",
        accion: "REABRIR_CIERRE"
      });
      return { ok: true, message: "Cierre reabierto como borrador." };
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
    metodosPago: pickCatalog(rows, "MetodosPago").map(function (value) { return value === "Kashpay" ? "CLIP" : value; }),
    tiposMovimiento: pickCatalog(rows, "TiposMovimiento"),
    divisiones: pickCatalog(rows, "Divisiones"),
    autorizo: pickCatalog(rows, "Autorizo"),
    denominaciones: pickCatalog(rows, "Denominaciones").map(Number).filter(function (value) { return value >= 0.5; }),
    turnos: pickCatalog(rows, "Turnos")
  };
}

function pickCatalog(rows, type) {
  return rows.filter(function (row) { return row.tipoCatalogo === type; }).map(function (row) { return row.valor; });
}

function validateOffice(oficina) {
  const allowed = getCatalogos().oficinas;
  if (allowed.indexOf(oficina) === -1) throw new Error("Oficina no valida.");
}

function replaceChildren(sheetName, cierreId, rows) {
  deleteChildren(sheetName, cierreId);
  appendRows(sheetName, rows);
}

function deleteChildren(sheetName, cierreId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf("cierreId");
  for (let i = values.length - 1; i >= 1; i -= 1) {
    if (values[i][idIndex] === cierreId) sheet.deleteRow(i + 1);
  }
}

function audit(session, data) {
  appendRows("CierreAuditoria", [[
    Utilities.getUuid(),
    data.cierreId,
    session.usuario,
    session.nombre || session.usuario,
    session.oficina || "",
    data.oficina || "",
    normalizeDateKey(data.fechaCierre),
    data.turno || "",
    data.estatus || "",
    data.accion || "",
    new Date()
  ]]);
}

function byCierreId(cierreId) {
  return function (row) {
    return row.cierreId === cierreId;
  };
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
      return row.some(function (value) { return value !== ""; });
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
    nombre: user.nombre,
    rol: String(user.rol || "").toUpperCase(),
    oficina: user.oficina || "",
    issuedAt
  });
  const encoded = Utilities.base64EncodeWebSafe(data);
  return encoded + "." + sign(encoded);
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
  return bytes.map(function (byte) {
    const normalized = byte < 0 ? byte + 256 : byte;
    return ("0" + normalized.toString(16)).slice(-2);
  }).join("");
}

function hashPassword(password) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return bytes.map(function (byte) {
    const normalized = byte < 0 ? byte + 256 : byte;
    return ("0" + normalized.toString(16)).slice(-2);
  }).join("");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function number(value) {
  const parsed = Number(value);
  return isFinite(parsed) ? parsed : 0;
}

function hasMeaningfulDifference(value) {
  return Math.abs(number(value)) >= 0.01;
}

function isActive(value) {
  return String(value).toLowerCase() !== "false" && value !== false && value !== "";
}

function normalizePayment(value) {
  return value === "Kashpay" ? "CLIP" : value;
}

function normalizeStatus(value) {
  const status = String(value || "").trim().toUpperCase();
  if (status === "REVISADO") return "VALIDADO";
  return status;
}

function displayStatus(value) {
  const status = normalizeStatus(value);
  if (status === "BORRADOR") return "Borrador";
  if (status === "ENVIADO") return "Enviado";
  if (status === "VALIDADO") return "Validado";
  return value || "";
}

function normalizeDateKey(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  const text = String(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return match[1] + "-" + match[2] + "-" + match[3];
  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) return Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return text;
}

function shortId() {
  return Utilities.getUuid().slice(0, 8).toUpperCase();
}
