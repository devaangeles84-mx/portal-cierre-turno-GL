import React from "react";

export default function ObservationsSignatures({ form, onChange }) {
  return (
    <section className="section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Cierre</p>
          <h2>Observaciones y firmas</h2>
        </div>
      </div>

      <label className="full-field">
        Observaciones generales
        <textarea
          rows="4"
          value={form.observaciones}
          onChange={(event) => onChange("observaciones", event.target.value)}
          placeholder="Notas, diferencias o aclaraciones del cierre"
        />
      </label>

      <div className="signature-grid">
        <label>
          Entrega
          <input value={form.entregaNombre} onChange={(event) => onChange("entregaNombre", event.target.value)} />
        </label>
        <label>
          Recibe
          <input value={form.recibeNombre} onChange={(event) => onChange("recibeNombre", event.target.value)} />
        </label>
        <label>
          Traslada
          <input value={form.trasladaNombre} onChange={(event) => onChange("trasladaNombre", event.target.value)} />
        </label>
      </div>
    </section>
  );
}
