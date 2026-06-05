import React, { useEffect, useMemo, useState } from "react";
import CashCountTable from "./components/CashCountTable";
import ConfirmModal from "./components/ConfirmModal";
import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/Header";
import Login from "./components/Login";
import MovementsTable from "./components/MovementsTable";
import ObservationsSignatures from "./components/ObservationsSignatures";
import OfficeCard from "./components/OfficeCard";
import PrintView from "./components/PrintView";
import SummaryPanel from "./components/SummaryPanel";
import Toast from "./components/Toast";
import { getCatalogos, submitCierre } from "./services/api";
import {
  calculateOfficeSummaries,
  calculateTotals,
  createInitialCashCounts,
  DEFAULT_CATALOGOS
} from "./utils/calculations";
import { validateCierre } from "./utils/validators";
import { createId } from "./utils/id";

const DRAFT_KEY = "cierre-turno-draft";
const SESSION_KEY = "cierre-turno-session";

const initialForm = {
  fechaCierre: new Date().toISOString().slice(0, 10),
  turno: "General",
  usuarioCaptura: "",
  observaciones: "",
  entregaNombre: "",
  recibeNombre: "",
  trasladaNombre: ""
};

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export default function App() {
  const draft = useMemo(loadDraft, []);
  const [session, setSession] = useState(loadSession);
  const [catalogos, setCatalogos] = useState(DEFAULT_CATALOGOS);
  const [form, setForm] = useState(draft?.form || initialForm);
  const [movimientos, setMovimientos] = useState(draft?.movimientos || []);
  const [conteos, setConteos] = useState(
    draft?.conteos || createInitialCashCounts(DEFAULT_CATALOGOS.oficinas, DEFAULT_CATALOGOS.denominaciones)
  );
  const [efectivoReportado, setEfectivoReportado] = useState(draft?.efectivoReportado || {});
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, warnings: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(draft?.estatus === "Enviado");

  useEffect(() => {
    getCatalogos().then((data) => {
      const normalized = {
        ...DEFAULT_CATALOGOS,
        ...data,
        oficinas: mergeUnique(DEFAULT_CATALOGOS.oficinas, data.oficinas || []),
        denominaciones: data.denominaciones.map(Number)
      };
      setCatalogos(normalized);
      setConteos((current) => ensureCashCounts(current, normalized.oficinas, normalized.denominaciones));
      setForm((current) => ({
        ...current,
        turno: normalized.turnos.includes(current.turno) ? current.turno : normalized.turnos[0]
      }));
    });
  }, []);

  const scopedCatalogos =
    session?.rol === "OFICINA" && session.oficina
      ? { ...catalogos, oficinas: [session.oficina] }
      : catalogos;

  const summaries = useMemo(
    () =>
      calculateOfficeSummaries({
        oficinas: scopedCatalogos.oficinas,
        movimientos,
        conteos,
        efectivoReportado
      }),
    [scopedCatalogos.oficinas, movimientos, conteos, efectivoReportado]
  );

  const totals = useMemo(() => calculateTotals(summaries), [summaries]);

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateEfectivo = (oficina, value) => {
    setEfectivoReportado((current) => ({ ...current, [oficina]: value }));
  };

  const saveDraft = async () => {
    const payload = buildPayload("Borrador");
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, movimientos, conteos, efectivoReportado, estatus: "Borrador" }));
    try {
      await submitCierre(payload);
      setToast({ type: "ok", message: "Borrador guardado." });
    } catch {
      setToast({ type: "ok", message: "Borrador guardado localmente. No se pudo guardar en Sheets todavia." });
    }
  };

  const buildPayload = (estatus = "Enviado") => ({
    sessionToken: session?.sessionToken,
    action: estatus === "Borrador" ? "saveDraft" : "submit",
    cierre: {
      ...form,
      usuarioCaptura: session?.usuario || form.usuarioCaptura,
      oficina: scopedCatalogos.oficinas[0],
      estatus,
      ...totals
    },
    movimientos,
    conteos: conteos.filter((row) => Number(row.cantidad) > 0),
    resumenOficinas: summaries
  });

  const requestSubmit = () => {
    const validation = validateCierre({ form, oficinas: catalogos.oficinas, movimientos, summaries });
    if (validation.errors.length > 0) {
      setToast({ type: "error", message: validation.errors.join(" ") });
      return;
    }

    if (validation.hasDifferences) {
      setConfirm({ open: true, warnings: validation.warnings });
      return;
    }

    sendCierre();
  };

  const sendCierre = async () => {
    setConfirm({ open: false, warnings: [] });
    setIsSubmitting(true);
    try {
      const result = await submitCierre(buildPayload("Enviado"));
      localStorage.removeItem(DRAFT_KEY);
      setIsLocked(true);
      setToast({ type: "ok", message: result.message || "Cierre guardado correctamente." });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setForm((current) => ({
      ...current,
      usuarioCaptura: nextSession.nombre || nextSession.usuario || "",
      oficina: nextSession.oficina || ""
    }));
    if (nextSession.rol === "OFICINA" && nextSession.oficina) {
      setConteos((current) => ensureCashCounts(current, [nextSession.oficina], catalogos.denominaciones));
      setMovimientos((current) =>
        current.map((mov) => ({ ...mov, oficina: nextSession.oficina })).filter((mov) => mov.oficina === nextSession.oficina)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setIsLocked(false);
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Header
        form={form}
        catalogos={scopedCatalogos}
        session={session}
        onChange={updateForm}
        onSaveDraft={saveDraft}
        onSubmit={requestSubmit}
        onPrint={() => window.print()}
        onLogout={handleLogout}
        isSubmitting={isSubmitting}
      />

      <main className="app-shell">
        <div className="content-column">
          <section className="portal-intro">
            <h1>Cierre de Turno</h1>
            <p>
              Captura los movimientos, arqueos y diferencias del cierre diario. La informacion se validara antes de
              enviarse a Google Sheets.
            </p>
          </section>

          {session.rol === "ADMIN" ? (
            <AdminDashboard session={session} catalogos={catalogos} />
          ) : (
            <>
              <SummaryPanel summaries={summaries} totals={totals} />
              {isLocked && (
                <div className="status-box ok">
                  Este cierre ya fue enviado y quedo bloqueado para edicion. Un admin puede reabrirlo.
                </div>
              )}
              <fieldset className="capture-fieldset" disabled={isLocked}>
                <section className="offices-grid single-office" aria-label="Oficina">
                  {summaries.map((summary) => (
                    <OfficeCard
                      key={summary.oficina}
                      summary={summary}
                      value={efectivoReportado[summary.oficina] || ""}
                      onEfectivoChange={updateEfectivo}
                    />
                  ))}
                </section>

                <MovementsTable catalogos={scopedCatalogos} movimientos={movimientos} onChange={setMovimientos} />
                <CashCountTable
                  conteos={conteos}
                  oficinas={scopedCatalogos.oficinas}
                  denominaciones={scopedCatalogos.denominaciones}
                  onChange={setConteos}
                />
                <ObservationsSignatures form={form} onChange={updateForm} />
              </fieldset>
            </>
          )}
        </div>
      </main>

      <PrintView form={form} movimientos={movimientos} conteos={conteos} summaries={summaries} totals={totals} />
      <ConfirmModal
        open={confirm.open}
        warnings={confirm.warnings}
        onCancel={() => setConfirm({ open: false, warnings: [] })}
        onConfirm={sendCierre}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

function mergeUnique(base, extra) {
  return Array.from(new Set([...base, ...extra].filter(Boolean)));
}

function ensureCashCounts(current, oficinas, denominaciones) {
  const next = [...current];
  const exists = new Set(current.map((row) => `${row.oficina}|${row.concepto}|${row.denominacion}`));

  oficinas.forEach((oficina) => {
    ["Liberaciones", "Pensiones"].forEach((concepto) => {
      denominaciones.forEach((denominacion) => {
        const key = `${oficina}|${concepto}|${denominacion}`;
        if (!exists.has(key)) {
          next.push({
            id: createId("conteo"),
            oficina,
            concepto,
            denominacion,
            cantidad: ""
          });
        }
      });
    });
  });

  return next.filter((row) => oficinas.includes(row.oficina) && denominaciones.includes(Number(row.denominacion)));
}
