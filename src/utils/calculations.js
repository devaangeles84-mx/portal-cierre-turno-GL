import { roundMoney, toNumber } from "./money";
import { createId } from "./id";

export const DEFAULT_DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1];

export const DEFAULT_CATALOGOS = {
  oficinas: ["Alvarez", "La Partida (Matamoros)", "La Union", "El Triunfo", "Encierro Gomez (Walmart)"],
  metodosPago: ["Efectivo", "Kashpay", "Terminal BBVA", "Transferencia", "No aplica"],
  tiposMovimiento: [
    "Egreso",
    "O.S. pendiente",
    "O.S. recibida",
    "Liberacion",
    "Pension",
    "Apoyo",
    "Otro"
  ],
  denominaciones: DEFAULT_DENOMINATIONS,
  turnos: ["Matutino", "Vespertino", "Nocturno", "General"]
};

const paymentKey = {
  Efectivo: "efectivo",
  Kashpay: "kashpay",
  "Terminal BBVA": "terminalBBVA",
  Transferencia: "transferencia"
};

export function createEmptyOfficeResumen(oficina) {
  return {
    oficina,
    efectivo: 0,
    efectivoReportado: 0,
    efectivoEsperado: 0,
    efectivoContado: 0,
    egresos: 0,
    ingresos: 0,
    liberaciones: 0,
    kashpay: 0,
    terminalBBVA: 0,
    transferencia: 0,
    pensiones: 0,
    pendientes: 0,
    importeSinPensiones: 0,
    importeConPensiones: 0,
    diferencia: 0
  };
}

export function calculateCashCount(conteos) {
  return conteos.reduce((total, row) => total + toNumber(row.cantidad) * toNumber(row.denominacion), 0);
}

export function calculateOfficeSummaries({ oficinas, movimientos, conteos }) {
  const summaries = oficinas.map(createEmptyOfficeResumen);
  const byOffice = new Map(summaries.map((summary) => [summary.oficina, summary]));

  movimientos.forEach((mov) => {
    const summary = byOffice.get(mov.oficina);
    if (!summary) return;

    const amount = toNumber(mov.importe);
    const signedAmount = mov.tipoMovimiento === "Egreso" ? -Math.abs(amount) : amount;
    const method = paymentKey[mov.metodoPago];

    if (mov.tipoMovimiento === "Egreso") summary.egresos += Math.abs(amount);
    if (mov.tipoMovimiento === "O.S. recibida") summary.ingresos += amount;
    if (mov.tipoMovimiento === "O.S. pendiente") summary.pendientes += amount;
    if (mov.tipoMovimiento === "Liberacion") summary.liberaciones += amount;
    if (mov.tipoMovimiento === "Pension") summary.pensiones += amount;
    if (method) summary[method] += Math.max(0, signedAmount);
  });

  conteos.forEach((count) => {
    const summary = byOffice.get(count.oficina);
    if (!summary) return;
    summary.efectivoContado += toNumber(count.cantidad) * toNumber(count.denominacion);
  });

  summaries.forEach((summary) => {
    summary.efectivoEsperado = summary.efectivo - summary.egresos;
    summary.efectivoReportado = summary.efectivoEsperado;
    summary.importeSinPensiones = summary.efectivo - summary.pensiones - summary.egresos;
    summary.importeConPensiones = summary.pensiones > 0 ? summary.efectivo - summary.egresos : 0;
    summary.diferencia = summary.efectivoContado - summary.efectivoEsperado;

    Object.keys(summary).forEach((key) => {
      if (typeof summary[key] === "number") summary[key] = roundMoney(summary[key]);
    });
  });

  return summaries;
}

export function calculateTotals(summaries) {
  const totals = summaries.reduce(
    (acc, summary) => {
      acc.totalEfectivo += summary.efectivo;
      acc.totalKashpay += summary.kashpay;
      acc.totalTerminal += summary.terminalBBVA;
      acc.totalTransferencia += summary.transferencia;
      acc.totalPendientes += summary.pendientes;
      acc.totalPensiones += summary.pensiones;
      acc.diferenciaGeneral += summary.diferencia;
      return acc;
    },
    {
      totalEfectivo: 0,
      totalKashpay: 0,
      totalTerminal: 0,
      totalTransferencia: 0,
      totalPendientes: 0,
      totalPensiones: 0,
      diferenciaGeneral: 0,
      totalGeneral: 0
    }
  );

  totals.totalGeneral =
    totals.totalEfectivo + totals.totalKashpay + totals.totalTerminal + totals.totalTransferencia;

  Object.keys(totals).forEach((key) => {
    totals[key] = roundMoney(totals[key]);
  });

  return totals;
}

export function createInitialCashCounts(oficinas, denominaciones) {
  return oficinas.flatMap((oficina) =>
    ["Liberaciones", "Pensiones"].flatMap((concepto) =>
      denominaciones.map((denominacion) => ({
        id: createId("conteo"),
        oficina,
        concepto,
        denominacion,
        cantidad: ""
      }))
    )
  );
}
