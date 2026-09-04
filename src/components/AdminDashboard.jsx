import React, { useEffect, useMemo, useState } from "react";
import { deleteBorrador, getCierreDetalle, listCierres, reopenCierre, validateCierreContabilidad } from "../services/api";
import ConfirmModal from "./ConfirmModal";
import { formatMoney, toNumber } from "../utils/money";

const emptyFilters = {
  fecha: "",
  fechaInicio: "",
  fechaFin: "",
  turno: "",
  oficina: "",
  usuario: "",
  estatus: ""
};

export default function AdminDashboard({ session, catalogos }) {
  const isAccounting = session.rol === "CONTABILIDAD";
  const [filters, setFilters] = useState(isAccounting ? { ...emptyFilters, estatus: "Enviado" } : emptyFilters);
  const [cierres, setCierres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [validationNote, setValidationNote] = useState("");
  const [printMode, setPrintMode] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const totals = useMemo(() => {
    return cierres.reduce(
      (acc, row) => {
        acc.totalEfectivo += toNumber(row.totalEfectivo || row.efectivoReportado);
        acc.totalClip += toNumber(row.totalClip || row.totalKashpay || row.clip || row.kashpay);
        acc.totalTerminal += toNumber(row.totalTerminal || row.terminalBBVA);
        acc.totalTransferencia += toNumber(row.totalTransferencia || row.transferencia);
        acc.totalPensiones += toNumber(row.totalPensiones || row.pensiones);
        acc.totalEgresos += toNumber(row.egresos);
        acc.totalPendientes += toNumber(row.totalPendientes || row.osPendientes);
        acc.totalIngresos += toNumber(row.ingresosOS);
        acc.totalLiberaciones += toNumber(row.liberaciones);
        acc.totalSobrantes += toNumber(row.sobrantes);
        acc.totalFaltantes += toNumber(row.faltantes);
        acc.diferenciaGeneral += toNumber(row.diferenciaGeneral || row.diferencia);
        acc.pendientesValidacion += normalizeStatus(row.estatus) === "ENVIADO" ? 1 : 0;
        return acc;
      },
      {
        totalEfectivo: 0,
        totalClip: 0,
        totalTerminal: 0,
        totalTransferencia: 0,
        totalPensiones: 0,
        totalEgresos: 0,
        totalPendientes: 0,
        totalIngresos: 0,
        totalLiberaciones: 0,
        totalSobrantes: 0,
        totalFaltantes: 0,
        diferenciaGeneral: 0,
        pendientesValidacion: 0
      }
    );
  }, [cierres]);

  const load = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await listCierres({ sessionToken: session.sessionToken, filters });
      setCierres(result.cierres || []);
      setSelected(null);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const setDateRange = (range) => {
    const { fechaInicio, fechaFin } = getDateRange(range);
    setFilters((current) => ({
      ...current,
      fecha: "",
      fechaInicio,
      fechaFin
    }));
  };

  const clearDateFilters = () => {
    setFilters((current) => ({
      ...current,
      fecha: "",
      fechaInicio: "",
      fechaFin: ""
    }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewDetail = async (cierreId) => {
    try {
      const result = await getCierreDetalle({ sessionToken: session.sessionToken, cierreId });
      setSelected(result.cierre);
      setValidationNote(result.cierre?.cierre?.observacionValidacion || "");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const validateSelected = async () => {
    const cierre = selected?.cierre;
    if (!cierre) return;
    if (toNumber(cierre.diferenciaGeneral || cierre.diferencia) !== 0 && !validationNote.trim()) {
      setMessage("Captura una observacion de validacion para aceptar un cierre con diferencia.");
      return;
    }
    setPendingAction({
      type: "validate",
      title: "Validar cierre",
      confirmLabel: "Validar cierre",
      warnings: ["Confirma que este cierre fue revisado por Contabilidad."],
      details: [
        ["Fecha", formatDate(cierre.fechaCierre)],
        ["Oficina", cierre.oficina],
        ["Usuario que realizo el cierre", cierre.usuarioCaptura],
        ["Diferencia", formatMoney(cierre.diferenciaGeneral || cierre.diferencia)]
      ],
      cierre
    });
  };

  const confirmValidate = async (cierre) => {
    try {
      setActionLoading(true);
      await validateCierreContabilidad({
        sessionToken: session.sessionToken,
        cierreId: cierre.cierreId,
        observacionValidacion: validationNote
      });
      setMessage("Cierre validado por Contabilidad.");
      setPendingAction(null);
      await load();
      await viewDetail(cierre.cierreId);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const removeDraft = async (cierre) => {
    setPendingAction({
      type: "delete",
      title: "Eliminar borrador",
      confirmLabel: "Eliminar",
      warnings: ["Esta accion elimina el borrador y sus registros asociados."],
      details: [
        ["Oficina", cierre.oficina],
        ["Fecha", formatDate(cierre.fechaCierre)],
        ["Usuario", cierre.usuarioCaptura]
      ],
      cierre
    });
  };

  const confirmDelete = async (cierre) => {
    try {
      setActionLoading(true);
      await deleteBorrador({ sessionToken: session.sessionToken, cierreId: cierre.cierreId });
      setMessage("Borrador eliminado.");
      setPendingAction(null);
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const reopenSelected = async () => {
    const cierre = selected?.cierre;
    if (!cierre) return;
    setPendingAction({
      type: "reopen",
      title: "Reabrir cierre",
      confirmLabel: "Reabrir cierre",
      warnings: ["El cierre volvera a Borrador para poder corregirse."],
      details: [
        ["Oficina", cierre.oficina],
        ["Fecha", formatDate(cierre.fechaCierre)],
        ["Usuario", cierre.usuarioCaptura]
      ],
      cierre
    });
  };

  const confirmReopen = async (cierre) => {
    try {
      setActionLoading(true);
      const result = await reopenCierre({ sessionToken: session.sessionToken, cierreId: cierre.cierreId });
      setMessage(result.message || "Cierre reabierto.");
      setPendingAction(null);
      await load();
      await viewDetail(cierre.cierreId);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmPendingAction = () => {
    if (!pendingAction?.cierre) return;
    if (pendingAction.type === "validate") confirmValidate(pendingAction.cierre);
    if (pendingAction.type === "delete") confirmDelete(pendingAction.cierre);
    if (pendingAction.type === "reopen") confirmReopen(pendingAction.cierre);
  };

  const printSummary = () => {
    setPrintMode("summary");
    setTimeout(() => window.print(), 0);
  };

  const printSelected = () => {
    setPrintMode("detail");
    setTimeout(() => window.print(), 0);
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-card admin-filters">
        <div>
          <p className="eyebrow">{isAccounting ? "Contabilidad" : "Administracion"}</p>
          <h2>{isAccounting ? "Cierres de turno" : "Panel de cierres"}</h2>
        </div>
        <label>
          Fecha
          <input
            type="date"
            value={filters.fecha}
            onChange={(event) => setFilters({ ...filters, fecha: event.target.value, fechaInicio: "", fechaFin: "" })}
          />
        </label>
        <label>
          Fecha inicio
          <input
            type="date"
            value={filters.fechaInicio}
            onChange={(event) => setFilters({ ...filters, fecha: "", fechaInicio: event.target.value })}
          />
        </label>
        <label>
          Fecha fin
          <input
            type="date"
            value={filters.fechaFin}
            onChange={(event) => setFilters({ ...filters, fecha: "", fechaFin: event.target.value })}
          />
        </label>
        <label>
          Turno
          <select value={filters.turno} onChange={(event) => setFilters({ ...filters, turno: event.target.value })}>
            <option value="">Todos</option>
            {catalogos.turnos.map((turno) => (
              <option key={turno} value={turno}>
                {turno}
              </option>
            ))}
          </select>
        </label>
        <label>
          Oficina
          <select value={filters.oficina} onChange={(event) => setFilters({ ...filters, oficina: event.target.value })}>
            <option value="">Todas</option>
            {catalogos.oficinas.map((oficina) => (
              <option key={oficina} value={oficina}>
                {oficina}
              </option>
            ))}
          </select>
        </label>
        <label>
          Usuario
          <input value={filters.usuario} onChange={(event) => setFilters({ ...filters, usuario: event.target.value })} />
        </label>
        <label>
          Estatus
          <select value={filters.estatus} onChange={(event) => setFilters({ ...filters, estatus: event.target.value })}>
            <option value="">Todos</option>
            {!isAccounting && <option value="Borrador">Borrador</option>}
            <option value="Enviado">Pendientes de validacion</option>
            <option value="Validado">Validado por Contabilidad</option>
          </select>
        </label>
        <button type="button" className="primary" onClick={load} disabled={loading}>
          {loading ? "Cargando" : "Filtrar"}
        </button>
        <div className="date-shortcuts" aria-label="Filtros rapidos de fecha">
          <button type="button" className="secondary" onClick={() => setDateRange("today")}>
            Hoy
          </button>
          <button type="button" className="secondary" onClick={() => setDateRange("week")}>
            Esta semana
          </button>
          <button type="button" className="secondary" onClick={() => setDateRange("month")}>
            Este mes
          </button>
          <button type="button" className="secondary" onClick={() => setDateRange("lastMonth")}>
            Mes pasado
          </button>
          <button type="button" className="secondary" onClick={clearDateFilters}>
            Sin fecha
          </button>
        </div>
      </div>

      {message && <div className="status-box warning">{message}</div>}

      <div className="admin-summary-grid">
        {Object.entries({
          "Pendientes de validar": totals.pendientesValidacion,
          Efectivo: totals.totalEfectivo,
          CLIP: totals.totalClip,
          "Terminal BBVA": totals.totalTerminal,
          Transferencia: totals.totalTransferencia,
          Pensiones: totals.totalPensiones,
          Egresos: totals.totalEgresos,
          Pendientes: totals.totalPendientes,
          "Ingresos / O.S.": totals.totalIngresos,
          Liberaciones: totals.totalLiberaciones,
          Sobrantes: totals.totalSobrantes,
          Faltantes: totals.totalFaltantes,
          Diferencia: totals.diferenciaGeneral
        }).map(([label, value]) => (
          <article key={label} className="admin-stat">
            <span>{label}</span>
            <strong>{label === "Pendientes de validar" ? value : formatMoney(value)}</strong>
          </article>
        ))}
      </div>

      <div className="admin-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Cierres</p>
            <h2>Listado</h2>
          </div>
          <button type="button" className="secondary icon-button" onClick={printSummary}>
            <span>Imprimir resumen</span>
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Oficina</th>
                <th>Usuario</th>
                <th>Estatus</th>
                <th>Total</th>
                <th>Diferencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cierres.map((cierre) => (
                <tr key={cierre.cierreId || cierre.idCierre}>
                  <td>{formatDate(cierre.fechaCierre || cierre.fecha)}</td>
                  <td>{cierre.turno}</td>
                  <td>{cierre.oficina}</td>
                  <td>{cierre.usuarioCaptura || cierre.usuario}</td>
                  <td>{displayStatus(cierre.estatus)}</td>
                  <td>{formatMoney(cierre.totalGeneral || cierre.totalEfectivo)}</td>
                  <td>{formatMoney(cierre.diferenciaGeneral || cierre.diferencia)}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="secondary icon-button"
                      onClick={() => viewDetail(cierre.cierreId || cierre.idCierre)}
                    >
                      <span>Ver</span>
                    </button>
                    {session.rol === "ADMIN" && normalizeStatus(cierre.estatus) === "BORRADOR" && (
                      <button
                        type="button"
                        className="secondary icon-button danger-action"
                        onClick={() => removeDraft(cierre)}
                        disabled={actionLoading}
                      >
                        <span>Eliminar borrador</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <CierreDetail
          selected={selected}
          session={session}
          validationNote={validationNote}
          onValidationNote={setValidationNote}
          onPrint={printSelected}
          onValidate={validateSelected}
          onReopen={reopenSelected}
          actionLoading={actionLoading}
        />
      )}

      <AdminPrintView mode={printMode} cierres={cierres} selected={selected} filters={filters} totals={totals} />
      <ConfirmModal
        open={Boolean(pendingAction)}
        title={pendingAction?.title}
        warnings={pendingAction?.warnings || []}
        details={pendingAction?.details || []}
        cancelLabel="Cancelar"
        confirmLabel={pendingAction?.confirmLabel || "Confirmar"}
        loading={actionLoading}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
      />
    </section>
  );
}

function CierreDetail({ selected, session, validationNote, onValidationNote, onPrint, onValidate, onReopen, actionLoading }) {
  const cierre = selected.cierre || {};
  const movimientos = selected.movimientos || [];
  const conteos = selected.conteos || [];
  const vales = selected.valesAseguradora || [];
  const auditoria = selected.auditoria || [];
  const canValidate = session.rol === "CONTABILIDAD" && normalizeStatus(cierre.estatus) === "ENVIADO";
  const canReopen = session.rol === "ADMIN" && normalizeStatus(cierre.estatus) === "ENVIADO";
  const difference = toNumber(cierre.diferenciaGeneral || cierre.diferencia);

  return (
    <div className="admin-card detail-panel">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Detalle</p>
          <h2>{cierre.oficina}</h2>
        </div>
        <div className="header-actions compact-actions">
          <button type="button" className="secondary icon-button" onClick={onPrint}>
            <span>Imprimir cierre</span>
          </button>
          {canReopen && (
            <button type="button" className="secondary icon-button" onClick={onReopen} disabled={actionLoading}>
              <span>{actionLoading ? "Reabriendo" : "Reabrir cierre"}</span>
            </button>
          )}
          {canValidate && (
            <button type="button" className="primary icon-button" onClick={onValidate} disabled={actionLoading}>
              <span>{actionLoading ? "Validando" : "Validar cierre"}</span>
            </button>
          )}
        </div>
      </div>

      {difference !== 0 && <div className="status-box warning">Diferencia detectada: {formatMoney(difference)}</div>}
      {normalizeStatus(cierre.estatus) === "VALIDADO" && (
        <div className="status-box ok">
          Validado por Contabilidad: {cierre.validadoPorNombre || "No registrado"} -{" "}
          {formatDateTime(cierre.validadoTimestamp)}
        </div>
      )}

      <DetailGrid
        title="Datos del cierre"
        rows={{
          Fecha: formatDate(cierre.fechaCierre),
          Turno: cierre.turno,
          Oficina: cierre.oficina,
          Usuario: cierre.usuarioNombre || cierre.usuarioCaptura,
          Division: firstValue(movimientos, "division"),
          Autorizo: firstValue(movimientos, "autorizo"),
          Estado: displayStatus(cierre.estatus)
        }}
      />

      <DetailGrid
        title="Resumen"
        rows={{
          "Efectivo esperado": formatMoney(cierre.efectivoReportado || cierre.totalEfectivo),
          "Efectivo contado": formatMoney(cierre.efectivoContado),
          CLIP: formatMoney(cierre.totalClip || cierre.totalKashpay || cierre.kashpay),
          "Terminal BBVA": formatMoney(cierre.totalTerminal || cierre.terminalBBVA),
          Transferencia: formatMoney(cierre.totalTransferencia || cierre.transferencia),
          Pensiones: formatMoney(cierre.totalPensiones || cierre.pensiones),
          Liberaciones: formatMoney(cierre.liberaciones),
          "Ingresos / O.S.": formatMoney(cierre.ingresosOS),
          Egresos: formatMoney(cierre.egresos),
          Pendientes: formatMoney(cierre.osPendientes),
          Sobrantes: formatMoney(cierre.sobrantes),
          Faltantes: formatMoney(cierre.faltantes),
          Diferencia: formatMoney(difference)
        }}
      />

      <DetailTable
        title="Movimientos"
        headers={["Tipo", "Metodo", "Folio", "Cliente", "Division", "Autorizo", "Importe"]}
        rows={movimientos.map((mov) => [
          mov.tipoMovimiento,
          displayPayment(mov.metodoPago),
          mov.folioOS,
          mov.clienteRazonSocial,
          mov.division || "No registrado",
          mov.autorizo || "No registrado",
          formatMoney(mov.importe)
        ])}
      />

      <DetailTable
        title="Conteo de efectivo"
        headers={["Denominacion", "Cantidad", "Importe"]}
        rows={conteos.map((row) => [`$${row.denominacion}`, row.cantidad, formatMoney(row.importe || toNumber(row.cantidad) * row.denominacion)])}
      />

      {vales.length > 0 && (
        <DetailTable
          title="Vales fisicos de aseguradora"
          headers={["Orden GRIPS", "Aseguradora", "Folio vale", "Vehiculo", "Marca", "Modelo", "Color", "Anio"]}
          rows={vales.map((vale) => [
            vale.ordenGrips,
            vale.aseguradora,
            vale.folioVale,
            vale.vehiculo,
            vale.marca,
            vale.modelo,
            vale.color,
            vale.anio
          ])}
        />
      )}

      <DetailGrid
        title="Datos de valija"
        rows={{
          Entrega: cierre.entregaNombre,
          Traslada: cierre.trasladaNombre,
          Ruta: cierre.rutaValija || "—"
        }}
      />

      <DetailGrid title="Observaciones" rows={{ Observaciones: cierre.observaciones || "Sin observaciones" }} />

      {canValidate && (
        <label className="full-field validation-note">
          Observacion de validacion {difference !== 0 ? "(obligatoria por diferencia)" : "(opcional)"}
          <textarea rows="3" value={validationNote} onChange={(event) => onValidationNote(event.target.value)} />
        </label>
      )}

      <DetailTable
        title="Auditoria"
        headers={["Accion", "Usuario", "Oficina", "Fecha y hora"]}
        rows={auditoria.map((row) => [
          row.accion,
          row.usuarioNombre || row.usuarioId,
          row.oficinaSeleccionada,
          formatDateTime(row.timestamp)
        ])}
      />
    </div>
  );
}

function DetailGrid({ title, rows }) {
  return (
    <section className="detail-section">
      <h3>{title}</h3>
      <dl className="detail-grid">
        {Object.entries(rows).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function DetailTable({ title, headers, rows }) {
  return (
    <section className="detail-section">
      <h3>{title}</h3>
      <div className="table-wrap">
        <table className="data-table detail-table">
          <thead>
            <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="empty-table-cell">
                  Sin registros
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-${cellIndex}`}>{cell || "—"}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminPrintView({ mode, cierres, selected, filters, totals }) {
  const cierre = selected?.cierre || {};
  const detailRows = selected?.movimientos || [];
  const countRows = selected?.conteos || [];

  return (
    <section className="print-view admin-print-view">
      {mode === "detail" && selected ? (
        <>
          <PrintHeader title="Cierre de Turno" subtitle="Cierre individual" />
          <div className="print-meta">
            <span>Fecha: {formatDate(cierre.fechaCierre)}</span>
            <span>Turno: {cierre.turno}</span>
            <span>Oficina: {cierre.oficina}</span>
            <span>Usuario: {cierre.usuarioNombre || cierre.usuarioCaptura}</span>
            <span>Estado: {displayStatus(cierre.estatus)}</span>
            <span>Diferencia: {formatMoney(cierre.diferenciaGeneral || cierre.diferencia)}</span>
          </div>
          <h2>Resumen</h2>
          <table>
            <tbody>
              {[
                ["Efectivo esperado", cierre.efectivoReportado || cierre.totalEfectivo],
                ["Efectivo contado", cierre.efectivoContado],
                ["CLIP", cierre.totalClip || cierre.totalKashpay || cierre.kashpay],
                ["Terminal BBVA", cierre.totalTerminal || cierre.terminalBBVA],
                ["Transferencia", cierre.totalTransferencia || cierre.transferencia],
                ["Pensiones", cierre.totalPensiones || cierre.pensiones],
                ["Liberaciones", cierre.liberaciones],
                ["Ingresos / O.S.", cierre.ingresosOS],
                ["Egresos", cierre.egresos],
                ["Pendientes", cierre.osPendientes],
                ["Sobrante", cierre.sobrantes],
                ["Faltante", cierre.faltantes],
                ["Diferencia", cierre.diferenciaGeneral || cierre.diferencia]
              ].map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{formatMoney(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <SimplePrintTable title="Movimientos" headers={["Tipo", "Metodo", "Folio", "Cliente", "Importe"]} rows={detailRows.map((row) => [row.tipoMovimiento, displayPayment(row.metodoPago), row.folioOS, row.clienteRazonSocial, formatMoney(row.importe)])} />
          <SimplePrintTable title="Conteo de efectivo" headers={["Denominacion", "Cantidad", "Importe"]} rows={countRows.map((row) => [`$${row.denominacion}`, row.cantidad, formatMoney(row.importe || toNumber(row.cantidad) * row.denominacion)])} />
          <p>Observaciones: {cierre.observaciones || "Sin observaciones"}</p>
          <div className="print-signatures">
            <span>Entrega: {cierre.entregaNombre || "—"}</span>
            <span>Traslada: {cierre.trasladaNombre || "—"}</span>
            <span>Ruta: {cierre.rutaValija || "—"}</span>
          </div>
          {normalizeStatus(cierre.estatus) === "VALIDADO" && (
            <p>
              VALIDADO POR CONTABILIDAD. Validado por: {cierre.validadoPorNombre || "—"}. Fecha de validacion:{" "}
              {formatDateTime(cierre.validadoTimestamp)}. Observacion: {cierre.observacionValidacion || "—"}
            </p>
          )}
        </>
      ) : (
        <>
          <PrintHeader title="Resumen de Cierres" subtitle="Consolidado por filtros activos" />
          <div className="print-meta">
            <span>Fecha: {formatFilterDates(filters)}</span>
            <span>Turno: {filters.turno || "Todos"}</span>
            <span>Oficina: {filters.oficina || "Todas"}</span>
            <span>Estatus: {filters.estatus ? displayStatus(filters.estatus) : "Todos"}</span>
          </div>
          <h2>Totales</h2>
          <table>
            <tbody>
              {[
                ["Efectivo", totals.totalEfectivo],
                ["CLIP", totals.totalClip],
                ["Terminal BBVA", totals.totalTerminal],
                ["Transferencia", totals.totalTransferencia],
                ["Pensiones", totals.totalPensiones],
                ["Egresos", totals.totalEgresos],
                ["Pendientes", totals.totalPendientes],
                ["Ingresos / O.S.", totals.totalIngresos],
                ["Liberaciones", totals.totalLiberaciones],
                ["Sobrantes", totals.totalSobrantes],
                ["Faltantes", totals.totalFaltantes],
                ["Diferencia", totals.diferenciaGeneral]
              ].map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{formatMoney(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <SimplePrintTable
            title="Cierres"
            headers={["Fecha", "Turno", "Oficina", "Usuario", "Estatus", "Total", "Diferencia"]}
            rows={cierres.map((row) => [
              formatDate(row.fechaCierre),
              row.turno,
              row.oficina,
              row.usuarioCaptura,
              displayStatus(row.estatus),
              formatMoney(row.totalGeneral || row.totalEfectivo),
              formatMoney(row.diferenciaGeneral || row.diferencia)
            ])}
          />
        </>
      )}
    </section>
  );
}

function PrintHeader({ title, subtitle }) {
  return (
    <div className="print-header">
      <img src="/gl2.png" alt="La Grúa" />
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function SimplePrintTable({ title, headers, rows }) {
  return (
    <>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`}>{cell || "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function firstValue(rows, key) {
  return rows.find((row) => row[key])?.[key] || "No registrado";
}

function displayPayment(value) {
  return value === "Kashpay" ? "CLIP" : value;
}

function normalizeStatus(value) {
  const status = String(value || "").trim().toUpperCase();
  if (status === "REVISADO") return "VALIDADO";
  return status;
}

function displayStatus(value) {
  const status = normalizeStatus(value);
  if (status === "VALIDADO") return "Validado por Contabilidad";
  if (status === "ENVIADO") return "Enviado";
  if (status === "BORRADOR") return "Borrador";
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  const text = String(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  return text;
}

function formatFilterDates(filters) {
  if (filters.fecha) return formatDate(filters.fecha);
  if (filters.fechaInicio && filters.fechaFin) return `${formatDate(filters.fechaInicio)} a ${formatDate(filters.fechaFin)}`;
  if (filters.fechaInicio) return `Desde ${formatDate(filters.fechaInicio)}`;
  if (filters.fechaFin) return `Hasta ${formatDate(filters.fechaFin)}`;
  return "Todas";
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

function getDateRange(range) {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);

  if (range === "week") {
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(today.getDate() + mondayOffset);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 6);
  }

  if (range === "month") {
    start.setDate(1);
    end.setTime(start.getTime());
    end.setMonth(start.getMonth() + 1, 0);
  }

  if (range === "lastMonth") {
    start.setDate(1);
    start.setMonth(start.getMonth() - 1);
    end.setTime(start.getTime());
    end.setMonth(start.getMonth() + 1, 0);
  }

  return {
    fechaInicio: toDateInputValue(start),
    fechaFin: toDateInputValue(end)
  };
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
