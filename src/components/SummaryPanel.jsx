import React from "react";
import AlertCircle from "lucide-react/dist/esm/icons/alert-circle.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/circle-check-big.js";
import { formatMoney } from "../utils/money";

export default function SummaryPanel({ summaries, totals }) {
  const hasDifferences = totals.diferenciaGeneral !== 0;

  return (
    <aside className="summary-panel">
      <div>
        <p className="eyebrow">Resumen</p>
        <h2>Total general</h2>
        <strong className="grand-total">{formatMoney(totals.totalGeneral)}</strong>
      </div>

      <div className={`status-box ${hasDifferences ? "warning" : "ok"}`}>
        {hasDifferences ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
        <span>
          {hasDifferences
            ? `Diferencia general: ${formatMoney(totals.diferenciaGeneral)}`
            : "Sin diferencias detectadas"}
        </span>
      </div>

      <dl className="summary-list">
        <div>
          <dt>Efectivo</dt>
          <dd>{formatMoney(totals.totalEfectivo)}</dd>
        </div>
        <div>
          <dt>Kashpay</dt>
          <dd>{formatMoney(totals.totalKashpay)}</dd>
        </div>
        <div>
          <dt>Terminal BBVA</dt>
          <dd>{formatMoney(totals.totalTerminal)}</dd>
        </div>
        <div>
          <dt>Transferencia</dt>
          <dd>{formatMoney(totals.totalTransferencia)}</dd>
        </div>
        <div>
          <dt>Pendientes</dt>
          <dd>{formatMoney(totals.totalPendientes)}</dd>
        </div>
        <div>
          <dt>Egresos</dt>
          <dd>{formatMoney(totals.totalEgresos)}</dd>
        </div>
        <div>
          <dt>Ingresos / O.S.</dt>
          <dd>{formatMoney(totals.totalIngresos)}</dd>
        </div>
        <div>
          <dt>Liberaciones</dt>
          <dd>{formatMoney(totals.totalLiberaciones)}</dd>
        </div>
      </dl>

      <div className="summary-offices">
        {summaries.map((summary) => (
          <div key={summary.oficina}>
            <span>{summary.oficina}</span>
            <strong>{formatMoney(summary.totalOficina)}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}
