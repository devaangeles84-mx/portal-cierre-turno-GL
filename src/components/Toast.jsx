import React from "react";
import X from "lucide-react/dist/esm/icons/x.js";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type || "info"}`} role="status">
      <span>{toast.message}</span>
      <button type="button" className="ghost square-button" onClick={onClose} title="Cerrar">
        <X size={16} />
      </button>
    </div>
  );
}
