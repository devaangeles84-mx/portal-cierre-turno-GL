import React from "react";
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
        <span aria-hidden="true">{hasDifferences ? "!" : "OK"}</span>
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
          <dt>CLIP</dt>
          <dd>{formatMoney(totals.totalClip || totals.totalKashpay)}</dd>
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
        <div>
          <dt>Sobrantes</dt>
          <dd>{formatMoney(totals.totalSobrantes)}</dd>
        </div>
        <div>
          <dt>Faltantes</dt>
          <dd>{formatMoney(totals.totalFaltantes)}</dd>
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
