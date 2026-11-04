import React from "react";

export default function PrintHeader({ title = "Cierre de Turno", subtitle, oficina, fecha }) {
  return (
    <header className="print-header">
      <div className="print-brand">
        <img src="/gl2.png" alt="La Grúa" />
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="print-identity">
        <span>Oficina</span>
        <strong className="print-office">{oficina || "Todas las oficinas"}</strong>
        <span>Fecha del cierre</span>
        <strong className="print-date">{formatPrintDate(fecha)}</strong>
      </div>
    </header>
  );
}

function formatPrintDate(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : text || "Todas";
}
