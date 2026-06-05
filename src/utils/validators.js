import { toNumber } from "./money";

export function validateCierre({ form, oficinas, movimientos, summaries }) {
  const errors = [];
  const warnings = [];

  if (!form.fechaCierre) errors.push("La fecha de cierre es obligatoria.");
  if (!form.usuarioCaptura?.trim()) errors.push("El usuario que captura es obligatorio.");

  const hasOfficeData = oficinas.some((oficina) => {
    const summary = summaries.find((item) => item.oficina === oficina);
    return (
      summary &&
      [
        "efectivoReportado",
        "efectivoContado",
        "egresos",
        "ingresos",
        "liberaciones",
        "kashpay",
        "terminalBBVA",
        "transferencia",
        "pensiones",
        "pendientes"
      ].some((key) => toNumber(summary[key]) !== 0)
    );
  });

  if (!hasOfficeData) errors.push("Captura informacion de al menos una oficina.");

  movimientos.forEach((mov, index) => {
    const amount = toNumber(mov.importe);
    if (mov.importe !== "" && !Number.isFinite(Number(mov.importe))) {
      errors.push(`El importe de la fila ${index + 1} debe ser numerico.`);
    }
    if (amount < 0 && mov.tipoMovimiento !== "Egreso") {
      errors.push(`La fila ${index + 1} tiene importe negativo y no es egreso.`);
    }
  });

  const hasDifferences = summaries.some((summary) => toNumber(summary.diferencia) !== 0);
  if (hasDifferences) {
    warnings.push("Hay diferencias entre efectivo reportado y efectivo contado.");
    if (!form.observaciones?.trim()) {
      errors.push("Cuando hay diferencias, la observacion general es obligatoria.");
    }
  }

  return { errors, warnings, hasDifferences };
}
