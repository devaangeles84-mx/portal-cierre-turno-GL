import React from "react";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle.js";

export default function ConfirmModal({ open, warnings, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <AlertTriangle size={28} className="modal-icon" />
        <h2 id="confirm-title">Confirmar envio</h2>
        {warnings.map((warning) => (
          <p key={warning}>{warning}</p>
        ))}
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onCancel}>
            Revisar
          </button>
          <button type="button" className="primary" onClick={onConfirm}>
            Enviar de todos modos
          </button>
        </div>
      </div>
    </div>
  );
}
