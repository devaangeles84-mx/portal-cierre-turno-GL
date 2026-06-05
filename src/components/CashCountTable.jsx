import React, { useState } from "react";
import { formatMoney, toNumber } from "../utils/money";

export default function CashCountTable({ conteos, oficinas, onChange }) {
  const [selectedOffice, setSelectedOffice] = useState(oficinas[0] || "");
  const [selectedConcept, setSelectedConcept] = useState("Liberaciones");

  const concepts = Array.from(new Set(conteos.map((row) => row.concepto)));
  const filtered = conteos.filter((row) => row.oficina === selectedOffice && row.concepto === selectedConcept);
  const total = filtered.reduce((sum, row) => sum + toNumber(row.cantidad) * toNumber(row.denominacion), 0);

  const updateCount = (id, cantidad) => {
    onChange(conteos.map((row) => (row.id === id ? { ...row, cantidad } : row)));
  };

  return (
    <section className="section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Arqueo fisico</p>
          <h2>Conteo de efectivo</h2>
        </div>
        <strong className="total-pill">{formatMoney(total)}</strong>
      </div>

      <div className="segmented-row">
        <select value={selectedOffice} onChange={(event) => setSelectedOffice(event.target.value)}>
          {oficinas.map((oficina) => (
            <option key={oficina} value={oficina}>
              {oficina}
            </option>
          ))}
        </select>
        <div className="segmented-control">
          {concepts.map((concept) => (
            <button
              type="button"
              key={concept}
              className={selectedConcept === concept ? "active" : ""}
              onClick={() => setSelectedConcept(concept)}
            >
              {concept}
            </button>
          ))}
        </div>
      </div>

      <div className="cash-grid">
        {filtered.map((row) => (
          <label key={row.id} className="cash-denomination">
            <span>${row.denominacion}</span>
            <input
              type="number"
              min="0"
              step="1"
              value={row.cantidad}
              onChange={(event) => updateCount(row.id, event.target.value)}
              placeholder="0"
            />
            <strong>{formatMoney(toNumber(row.cantidad) * row.denominacion)}</strong>
          </label>
        ))}
      </div>
    </section>
  );
}
