import React from "react";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle.js";
import { formatMoney } from "../utils/money";

const metrics = [
  ["efectivo", "Total efectivo recibido"],
  ["egresos", "Egresos"],
  ["pendientes", "O.S. pendientes"],
  ["ingresos", "Ingresos / O.S."],
  ["liberaciones", "Liberaciones"],
  ["kashpay", "Kashpay"],
  ["terminalBBVA", "Terminal BBVA"],
  ["transferencia", "Transferencia"],
  ["pensiones", "Pensiones"],
  ["efectivoContado", "Efectivo contado"],
  ["importeSinPensiones", "Sin pensiones"],
  ["importeConPensiones", "Con pensiones"]
];

export default function OfficeCard({ summary, value, onEfectivoChange }) {
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
            <AlertTriangle size={16} />
            {formatMoney(summary.diferencia)}
          </span>
        )}
      </div>

      <label className="money-input">
        Efectivo reportado
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onEfectivoChange(summary.oficina, event.target.value)}
          placeholder="0.00"
        />
      </label>

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
