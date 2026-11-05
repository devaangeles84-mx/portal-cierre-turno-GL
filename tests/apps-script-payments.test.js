import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createContext, runInContext } from "node:vm";

const source = readFileSync(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8");

function loadScript() {
  const context = createContext({ Utilities: { getUuid: () => "uuid-prueba" } });
  runInContext(source, context);
  return { context, headers: runInContext("HEADERS", context) };
}

test("guarda cheque en ambas hojas y conserva los metodos originales", () => {
  const { context, headers } = loadScript();
  const rows = {};
  context.validateSessionToken = () => ({ rol: "OFICINA", usuario: "prueba" });
  context.validateOffice = () => {};
  context.audit = () => {};
  context.upsertCierre = (_, row) => { rows.CierresTurno = row; };
  context.replaceChildren = (sheetName, _, children) => { rows[sheetName] = children[0]; };

  const result = context.saveCierre({
    cierre: {
      cierreId: "CIERRE-PRUEBA", fechaCierre: "2026-11-05", turno: "General", oficina: "La Union",
      totalGeneral: 4500, totalTerminal: 900, totalTransferencia: 2100, totalCheque: 900
    },
    movimientos: [{ id: "mov-1", tipoMovimiento: "Liberacion", metodoPago: "Transferencia Felipe", importe: 700 }],
    resumenOficinas: [{ clip: 500, terminalBBVA: 900, transferencia: 2100, cheque: 900, efectivoContado: 100 }]
  });

  assert.equal(result.ok, true);
  for (const sheet of ["CierresTurno", "CierreOficinasResumen"]) {
    assert.equal(headers[sheet].length, rows[sheet].length);
    assert.equal(headers[sheet].at(-1), "cheque");
    assert.equal(rows[sheet].at(-1), 900);
    assert.equal(rows[sheet][headers[sheet].indexOf("terminalBBVA")], 900);
    assert.equal(rows[sheet][headers[sheet].indexOf("transferencia")], 2100);
  }
  assert.equal(rows.CierresTurno[headers.CierresTurno.indexOf("totalGeneral")], 4500);
  assert.equal(rows.CierreMovimientos[headers.CierreMovimientos.indexOf("metodoPago")], "Transferencia Felipe");
});

test("extiende la hoja sin mover columnas y protege una columna ocupada", () => {
  const { context, headers } = loadScript();
  for (const name of ["CierresTurno", "CierreOficinasResumen"]) {
    const header = headers[name];
    const previousLength = header.length - 1;
    const writes = [];
    const sheet = {
      getName: () => name,
      getLastColumn: () => previousLength,
      getMaxColumns: () => previousLength,
      insertColumnsAfter: (...args) => writes.push(["append", ...args]),
      getRange: (...args) => ({ setValues: () => writes.push(["range", ...args]) }),
      setFrozenRows: () => {}
    };
    context.ensureHeaders(sheet, header);
    assert.deepEqual(writes, [["append", previousLength, 1], ["range", 1, 1, 1, header.length]]);

    assert.throws(() => context.ensureHeaders({
      ...sheet,
      getLastColumn: () => header.length,
      getRange: () => ({ getValue: () => "Columna personalizada" })
    }, header), /columna para cheque ya esta ocupada/);
    assert.equal(writes.length, 2);
  }
});
