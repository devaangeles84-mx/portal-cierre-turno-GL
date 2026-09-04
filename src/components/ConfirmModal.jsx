import React from "react";

export default function ConfirmModal({
  open,
  title = "Cierre de turno",
  warnings = [],
  details = [],
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar cierre",
  loading = false,
  onCancel,
  onConfirm
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <span className="modal-icon" aria-hidden="true">!</span>
        <h2 id="confirm-title">{title}</h2>
        {details.length > 0 && (
          <dl className="modal-details">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>
        )}
        {warnings.map((warning) => (
          <p key={warning}>{warning}</p>
        ))}
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="primary" onClick={onConfirm} disabled={loading}>
            {loading ? "Procesando" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
