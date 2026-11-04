import React from "react";

export default function PrintSignatures({ elaboradoPor, entregaNombre, trasladaNombre, rutaValija }) {
  return (
    <section className="print-signature-section">
      <div className="print-signatures">
        <div>
          <span>Elaboró</span>
          <strong>{elaboradoPor || "No registrado"}</strong>
        </div>
        <div>
          <span>Entrega</span>
          <strong>{entregaNombre || "Nombre: ____________________"}</strong>
          <div className="print-signature-line">Firma de entrega</div>
        </div>
      </div>
      <div className="print-delivery">
        <span>Traslada: {trasladaNombre || "____________________"}</span>
        <span>Ruta: {rutaValija || "____________________"}</span>
      </div>
    </section>
  );
}
