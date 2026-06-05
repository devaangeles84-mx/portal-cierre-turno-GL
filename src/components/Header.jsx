import React from "react";
import Printer from "lucide-react/dist/esm/icons/printer.js";
import Save from "lucide-react/dist/esm/icons/save.js";
import Send from "lucide-react/dist/esm/icons/send.js";

export default function Header({ form, catalogos, session, onChange, onSaveDraft, onSubmit, onPrint, onLogout, isSubmitting }) {
  const isAdmin = session?.rol === "ADMIN";

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
        {!isAdmin && (
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
          </>
        )}
        <label>
          Usuario
          <input
            type="text"
            value={form.usuarioCaptura}
            onChange={(event) => onChange("usuarioCaptura", event.target.value)}
            placeholder="Nombre"
            disabled={Boolean(session)}
          />
        </label>
        {session?.oficina && (
          <label>
            Oficina
            <input type="text" value={session.oficina} disabled />
          </label>
        )}
      </div>

      <div className="header-actions">
        {!isAdmin && (
          <>
            <button type="button" className="secondary icon-button" onClick={onSaveDraft} title="Guardar borrador">
              <Save size={18} />
              <span>Guardar</span>
            </button>
            <button type="button" className="secondary icon-button" onClick={onPrint} title="Vista de impresion">
              <Printer size={18} />
              <span>Imprimir</span>
            </button>
            <button type="button" className="primary icon-button" onClick={onSubmit} disabled={isSubmitting}>
              <Send size={18} />
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
