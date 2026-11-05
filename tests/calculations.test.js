import assert from "node:assert/strict";
import test from "node:test";
import { calculateOfficeSummaries, calculateTotals } from "../src/utils/calculations.js";

const oficina = "La Union";

function summarize(payments, conteos = []) {
  const summaries = calculateOfficeSummaries({
    oficinas: [oficina],
    movimientos: payments.map(([metodoPago, importe, tipoMovimiento = "Liberacion"]) => ({
      oficina, metodoPago, importe, tipoMovimiento
    })),
    conteos: conteos.map(([denominacion, cantidad]) => ({ oficina, denominacion, cantidad }))
  });
  return { summary: summaries[0], totals: calculateTotals(summaries) };
}

test("cuenta Clip Debito en el cierre reportado sin cambiar el arqueo", () => {
  const { summary, totals } = summarize([
    ...[3000, 5000, 7500, 500, 5000, 7366].map((amount) => ["Clip Debito", amount]),
    ["Efectivo", 45106],
    ["Efectivo", 650, "Egreso"]
  ], [[1000, 44], [200, 2], [50, 1], [5, 1], [1, 1]]);

  assert.equal(summary.clip, 28366);
  assert.equal(summary.efectivoEsperado, 44456);
  assert.equal(summary.efectivoContado, 44456);
  assert.equal(totals.totalGeneral, 72822);
  assert.equal(totals.diferenciaGeneral, 0);
});

test("agrupa variantes de CLIP, BBVA y transferencias sin doble conteo", () => {
  const { totals } = summarize([
    ["CLIP", 10], ["  Clip   D\u00e9bito ", 20], ["Clip Cr\u00e9dito", 30], ["Kashpay", 40],
    ["Terminal BBVA", 100], ["BBVA", 200], ["BBVA D\u00e9bito", 300], ["Terminal BBVA Cr\u00e9dito", 400],
    ["Transferencia", 1], ["Transferencias", 2], ["Transferencia bancaria", 3], ["Transferencia BBVA", 4], ["SPEI", 5]
  ]);

  assert.equal(totals.totalClip, 100);
  assert.equal(totals.totalKashpay, 100);
  assert.equal(totals.totalTerminal, 1000);
  assert.equal(totals.totalTransferencia, 15);
  assert.equal(totals.totalGeneral, 1115);
  assert.equal(totals.totalEfectivo, 0);
  assert.equal(totals.diferenciaGeneral, 0);
});

test("no suma movimientos de control ni metodos desconocidos al cobro", () => {
  const { totals } = summarize([
    ["Clip Debito", 5, "Sobrante"],
    ["BBVA", 15, "Faltante"],
    ["No aplica", 30, "O.S. pendiente"],
    ["Sin transferencia", 80]
  ]);

  assert.equal(totals.totalGeneral, 0);
  assert.equal(totals.totalSobrantes, 5);
  assert.equal(totals.totalFaltantes, 15);
  assert.equal(totals.totalPendientes, 30);
});

test("agrupa todos los nombres del catalogo operativo y mantiene separado el arqueo", () => {
  const { summary, totals } = summarize([
    ["Efectivo", 100], ["Clip Debito", 200], ["Clip Credito", 300],
    ["Terminal BBVA Deb", 400], ["Terminal BBVA Cred", 500],
    ["Transferencia Banamex", 600], ["Transferencia Felipe", 700], ["Transferencia Hector S", 800],
    ["Cheque", 900], ["No aplica", 1000, "O.S. pendiente"]
  ], [[100, 1]]);

  assert.equal(totals.totalClip, 500);
  assert.equal(totals.totalTerminal, 900);
  assert.equal(totals.totalTransferencia, 2100);
  assert.equal(totals.totalCheque, 900);
  assert.equal(totals.totalGeneral, 4500);
  assert.equal(totals.totalPendientes, 1000);
  assert.equal(summary.efectivoEsperado, 100);
  assert.equal(summary.efectivoContado, 100);
  assert.equal(totals.diferenciaGeneral, 0);
});
