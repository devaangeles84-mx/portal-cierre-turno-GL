import React from "react";
import { formatMoney, toNumber } from "../utils/money";

export default function PrintView({ form, movimientos, conteos, summaries, totals }) {
  const countedRows = conteos.filter((row) => toNumber(row.cantidad) > 0);

  return (
    <section className="print-view" aria-label="Vista de impresion">
      <h1>Cierre de Turno</h1>
      <div className="print-meta">
        <span>Fecha: {form.fechaCierre}</span>
        <span>Turno: {form.turno}</span>
        <span>Usuario: {form.usuarioCaptura}</span>
      </div>

      <h2>Resumen por oficina</h2>
      <table>
        <thead>
          <tr>
            <th>Oficina</th>
            <th>Efectivo reportado</th>
            <th>Efectivo contado</th>
            <th>Pensiones</th>
            <th>Con pensiones</th>
            <th>Diferencia</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((summary) => (
            <tr key={summary.oficina}>
              <td>{summary.oficina}</td>
              <td>{formatMoney(summary.efectivoReportado)}</td>
              <td>{formatMoney(summary.efectivoContado)}</td>
              <td>{formatMoney(summary.pensiones)}</td>
              <td>{formatMoney(summary.importeConPensiones)}</td>
              <td>{formatMoney(summary.diferencia)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Movimientos</h2>
      <table>
        <thead>
          <tr>
            <th>Oficina</th>
            <th>Tipo</th>
            <th>Metodo</th>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((mov) => (
            <tr key={mov.id}>
              <td>{mov.oficina}</td>
              <td>{mov.tipoMovimiento}</td>
              <td>{mov.metodoPago}</td>
              <td>{mov.folioOS}</td>
              <td>{mov.clienteRazonSocial}</td>
              <td>{formatMoney(mov.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Conteo de efectivo</h2>
      <table>
        <thead>
          <tr>
            <th>Oficina</th>
            <th>Concepto</th>
            <th>Denominacion</th>
            <th>Cantidad</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {countedRows.map((row) => (
            <tr key={row.id}>
              <td>{row.oficina}</td>
              <td>{row.concepto}</td>
              <td>${row.denominacion}</td>
              <td>{row.cantidad}</td>
              <td>{formatMoney(toNumber(row.cantidad) * row.denominacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total general: {formatMoney(totals.totalGeneral)}</h2>
      <p>Observaciones: {form.observaciones || "Sin observaciones"}</p>
      <div className="print-signatures">
        <span>Entrega: {form.entregaNombre}</span>
        <span>Recibe: {form.recibeNombre}</span>
        <span>Traslada: {form.trasladaNombre}</span>
      </div>
    </section>
  );
}
