import React from "react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type || "info"}`} role="status">
      <span>{toast.message}</span>
      <button type="button" className="ghost square-button" onClick={onClose} title="Cerrar">
        <span aria-hidden="true">x</span>
      </button>
    </div>
  );
}
