import React from "react";
import { formatMoney, toNumber } from "../utils/money";
import PrintHeader from "./PrintHeader";
import PrintSignatures from "./PrintSignatures";

export default function PrintView({ form, movimientos, conteos, valesAseguradora = [], summaries, totals }) {
  const countedRows = conteos.filter((row) => toNumber(row.cantidad) > 0);
  const voucherRows = valesAseguradora.filter((vale) =>
    [
      vale.ordenGrips,
      vale.aseguradora,
      vale.folioVale,
      vale.vehiculo,
      vale.marca,
      vale.modelo,
      vale.color,
      vale.anio
    ].some((value) => String(value || "").trim() !== "")
  );

  return (
    <section className="print-view" aria-label="Vista de impresion">
      <PrintHeader oficina={form.oficina || summaries[0]?.oficina} fecha={form.fechaCierre} />
      <div className="print-meta">
        <span>Turno: {form.turno}</span>
        <span>Elaboró: {form.usuarioNombre || form.usuarioCaptura}</span>
      </div>

      <h2>Resumen por oficina</h2>
      {summaries.map((summary) => (
        <table key={summary.oficina} className="print-summary" aria-label={`Resumen de ${summary.oficina}`}>
          <tbody>
            {[
              ["Efectivo esperado", summary.efectivoEsperado, "Efectivo contado", summary.efectivoContado],
              ["CLIP", summary.clip || summary.kashpay, "Pensiones", summary.pensiones],
              ["Terminal BBVA", summary.terminalBBVA, "Transferencia", summary.transferencia],
              ["Sobrante", summary.sobrantes, "Faltante", summary.faltantes],
              ["Total neto", summary.totalOficina, "Diferencia", summary.diferencia]
            ].map(([label, value, secondLabel, secondValue]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{formatMoney(value)}</td>
                <th scope="row">{secondLabel}</th>
                <td>{formatMoney(secondValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}

      <h2>Movimientos</h2>
      <table className="print-movements">
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
              <td className="print-folio">{mov.folioOS}</td>
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
            <th>Denominacion</th>
            <th>Cantidad</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          {countedRows.map((row) => (
            <tr key={row.id}>
              <td>{row.oficina}</td>
              <td>${row.denominacion}</td>
              <td>{row.cantidad}</td>
              <td>{formatMoney(toNumber(row.cantidad) * row.denominacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {voucherRows.length > 0 && (
        <>
          <h2>Vales físicos de aseguradora para CXC</h2>
          <table>
            <thead>
              <tr>
                <th>Orden GRIPS</th>
                <th>Aseguradora</th>
                <th>Folio vale</th>
                <th>Vehículo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Año</th>
              </tr>
            </thead>
            <tbody>
              {voucherRows.map((vale) => (
                <tr key={vale.id}>
                  <td className="print-folio">{vale.ordenGrips}</td>
                  <td>{vale.aseguradora}</td>
                  <td className="print-folio">{vale.folioVale}</td>
                  <td>{vale.vehiculo}</td>
                  <td>{vale.marca}</td>
                  <td>{vale.modelo}</td>
                  <td>{vale.color}</td>
                  <td>{vale.anio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Total general: {formatMoney(totals.totalGeneral)}</h2>
      <p>Observaciones: {form.observaciones || "Sin observaciones"}</p>
      <PrintSignatures
        elaboradoPor={form.usuarioNombre || form.usuarioCaptura}
        entregaNombre={form.entregaNombre}
        trasladaNombre={form.trasladaNombre}
        rutaValija={form.rutaValija}
      />
    </section>
  );
}
