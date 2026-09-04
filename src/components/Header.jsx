import React from "react";

export default function Header({
  form,
  catalogos,
  session,
  onChange,
  onSaveDraft,
  onSubmit,
  onPrint,
  onClear,
  onLogout,
  isSavingDraft,
  isSubmitting
}) {
  const isBackOffice = session?.rol === "ADMIN" || session?.rol === "CONTABILIDAD";

  return (
    <header className="app-header">
      <div className="brand-block">
        <img src="/gl2.png" alt="La Grúa" className="brand-logo" />
        <div className="brand-copy">
          <strong>
            Grúas <span>Laguna</span>
          </strong>
          <p>Cierre de Turno</p>
        </div>
      </div>

      <div className="header-fields">
        {!isBackOffice && (
          <>
            <label>
              Fecha
              <input
                type="date"
                value={form.fechaCierre}
                onChange={(event) => onChange("fechaCierre", event.target.value)}
              />
            </label>
            <label>
              Turno
              <select value={form.turno} onChange={(event) => onChange("turno", event.target.value)}>
                {catalogos.turnos.map((turno) => (
                  <option key={turno} value={turno}>
                    {turno}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Oficina
              <select value={form.oficina} onChange={(event) => onChange("oficina", event.target.value)}>
                {catalogos.oficinas.map((oficina) => (
                  <option key={oficina} value={oficina}>
                    {oficina}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <label>
          Usuario
          <input
            type="text"
            value={session?.nombre || session?.usuario || form.usuarioCaptura}
            onChange={(event) => onChange("usuarioCaptura", event.target.value)}
            placeholder="Nombre"
            disabled={Boolean(session)}
          />
        </label>
      </div>

      <div className="header-actions">
        {!isBackOffice && (
          <>
            <button type="button" className="secondary icon-button" onClick={onSaveDraft} title="Guardar borrador" disabled={isSavingDraft || isSubmitting}>
              <span>{isSavingDraft ? "Guardando" : "Guardar"}</span>
            </button>
            <button type="button" className="secondary icon-button" onClick={onPrint} title="Vista de impresion">
              <span>Imprimir</span>
            </button>
            <button type="button" className="secondary icon-button" onClick={onClear} title="Limpiar captura">
              <span>Limpiar</span>
            </button>
            <button type="button" className="primary icon-button" onClick={onSubmit} disabled={isSubmitting}>
              <span>{isSubmitting ? "Enviando" : "Enviar"}</span>
            </button>
          </>
        )}
        <button type="button" className="secondary icon-button" onClick={onLogout}>
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
