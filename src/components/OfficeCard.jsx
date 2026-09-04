import React from "react";
import { formatMoney } from "../utils/money";

const metrics = [
  ["efectivo", "Efectivo en movimientos"],
  ["efectivoEsperado", "Efectivo esperado"],
  ["egresos", "Egresos"],
  ["pendientes", "O.S. pendientes"],
  ["ingresos", "Ingresos / O.S."],
  ["liberaciones", "Liberaciones"],
  ["pensiones", "Pensiones"],
  ["sobrantes", "Sobrantes"],
  ["faltantes", "Faltantes"],
  ["clip", "CLIP"],
  ["terminalBBVA", "Terminal BBVA"],
  ["transferencia", "Transferencia"],
  ["efectivoContado", "Efectivo contado"],
  ["totalOficina", "Total neto oficina"]
];

export default function OfficeCard({ summary }) {
  const hasDifference = summary.diferencia !== 0;

  return (
    <article className={`office-card ${hasDifference ? "has-warning" : ""}`}>
      <div className="office-card-head">
        <div>
          <p className="eyebrow">Oficina</p>
          <h2>{summary.oficina}</h2>
        </div>
        {hasDifference && (
          <span className="difference-badge" title="Diferencia detectada">
            <span aria-hidden="true">!</span>
            {formatMoney(summary.diferencia)}
          </span>
        )}
      </div>

      <dl className="metric-grid">
        {metrics.map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{formatMoney(summary[key])}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
