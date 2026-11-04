import React from "react";

export default function PrintNameModal({ nombre, onChange, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-name-title"
        onSubmit={(event) => {
          event.preventDefault();
          if (nombre.trim()) onConfirm(nombre.trim());
        }}
      >
        <h2 id="print-name-title">Imprimir cierre</h2>
        <label>
          Nombre completo de quien entrega
          <input
            autoFocus
            required
            value={nombre}
            onChange={(event) => onChange(event.target.value)}
            autoComplete="name"
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="primary" disabled={!nombre.trim()}>Imprimir</button>
        </div>
      </form>
    </div>
  );
}
