import React, { useEffect, useMemo, useState } from "react";
import Eye from "lucide-react/dist/esm/icons/eye.js";
import Printer from "lucide-react/dist/esm/icons/printer.js";
import { getCierreDetalle, listCierres } from "../services/api";
import { formatMoney, toNumber } from "../utils/money";

const emptyFilters = {
  fecha: "",
  turno: "",
  oficina: "",
  usuario: "",
  estatus: ""
};

export default function AdminDashboard({ session, catalogos }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [cierres, setCierres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    return cierres.reduce(
      (acc, row) => {
        acc.totalEfectivo += toNumber(row.totalEfectivo || row.efectivoReportado);
        acc.totalKashpay += toNumber(row.totalKashpay || row.kashpay);
        acc.totalTerminal += toNumber(row.totalTerminal || row.terminalBBVA);
        acc.totalTransferencia += toNumber(row.totalTransferencia || row.transferencia);
        acc.totalPensiones += toNumber(row.totalPensiones || row.pensiones);
        acc.totalEgresos += toNumber(row.egresos);
        acc.totalPendientes += toNumber(row.totalPendientes || row.osPendientes);
        acc.totalIngresos += toNumber(row.ingresosOS);
        acc.totalLiberaciones += toNumber(row.liberaciones);
        acc.diferenciaGeneral += toNumber(row.diferenciaGeneral || row.diferencia);
        return acc;
      },
      {
        totalEfectivo: 0,
        totalKashpay: 0,
        totalTerminal: 0,
        totalTransferencia: 0,
        totalPensiones: 0,
        totalEgresos: 0,
        totalPendientes: 0,
        totalIngresos: 0,
        totalLiberaciones: 0,
        diferenciaGeneral: 0
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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewDetail = async (cierreId) => {
    try {
      const result = await getCierreDetalle({ sessionToken: session.sessionToken, cierreId });
      setSelected(result.cierre);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-card admin-filters">
        <div>
          <p className="eyebrow">Administracion</p>
          <h2>Panel de cierres</h2>
        </div>
        <label>
          Fecha
          <input type="date" value={filters.fecha} onChange={(event) => setFilters({ ...filters, fecha: event.target.value })} />
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
            <option value="Borrador">Borrador</option>
            <option value="Enviado">Enviado</option>
            <option value="Revisado">Revisado</option>
          </select>
        </label>
        <button type="button" className="primary" onClick={load} disabled={loading}>
          {loading ? "Cargando" : "Filtrar"}
        </button>
      </div>

      {message && <div className="status-box warning">{message}</div>}

      <div className="admin-summary-grid">
        {Object.entries({
          Efectivo: totals.totalEfectivo,
          Kashpay: totals.totalKashpay,
          "Terminal BBVA": totals.totalTerminal,
          Transferencia: totals.totalTransferencia,
          Pensiones: totals.totalPensiones,
          Egresos: totals.totalEgresos,
          Pendientes: totals.totalPendientes,
          "Ingresos / O.S.": totals.totalIngresos,
          Liberaciones: totals.totalLiberaciones,
          Diferencia: totals.diferenciaGeneral
        }).map(([label, value]) => (
          <article key={label} className="admin-stat">
            <span>{label}</span>
            <strong>{formatMoney(value)}</strong>
          </article>
        ))}
      </div>

      <div className="admin-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Cierres</p>
            <h2>Oficinas enviadas</h2>
          </div>
          <button type="button" className="secondary icon-button" onClick={() => window.print()}>
            <Printer size={18} />
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
                <th />
              </tr>
            </thead>
            <tbody>
              {cierres.map((cierre) => (
                <tr key={cierre.cierreId || cierre.idCierre}>
                  <td>{cierre.fechaCierre || cierre.fecha}</td>
                  <td>{cierre.turno}</td>
                  <td>{cierre.oficina}</td>
                  <td>{cierre.usuarioCaptura || cierre.usuario}</td>
                  <td>{cierre.estatus}</td>
                  <td>{formatMoney(cierre.totalGeneral || cierre.totalEfectivo)}</td>
                  <td>{formatMoney(cierre.diferenciaGeneral || cierre.diferencia)}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary icon-button"
                      onClick={() => viewDetail(cierre.cierreId || cierre.idCierre)}
                    >
                      <Eye size={16} />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="admin-card detail-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Detalle</p>
              <h2>{selected.cierre?.oficina || selected.oficina}</h2>
            </div>
            <button type="button" className="secondary icon-button" onClick={() => window.print()}>
              <Printer size={18} />
              <span>Imprimir cierre</span>
            </button>
          </div>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
