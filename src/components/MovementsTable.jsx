import React from "react";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.js";
import { createId } from "../utils/id";

function newMovement(catalogos) {
  return {
    id: createId("movimiento"),
    oficina: catalogos.oficinas[0] || "",
    tipoMovimiento: "Liberacion",
    metodoPago: "Efectivo",
    folioOS: "",
    clienteRazonSocial: "",
    division: "",
    autorizo: "",
    importe: "",
    comentarios: ""
  };
}

export default function MovementsTable({ catalogos, movimientos, onChange }) {
  const updateMovement = (id, field, value) => {
    onChange(movimientos.map((mov) => (mov.id === id ? { ...mov, [field]: value } : mov)));
  };

  const addMovement = () => onChange([...movimientos, newMovement(catalogos)]);
  const removeMovement = (id) => onChange(movimientos.filter((mov) => mov.id !== id));

  return (
    <section className="section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Captura</p>
          <h2>Movimientos</h2>
        </div>
        <button type="button" className="secondary icon-button" onClick={addMovement}>
          <Plus size={18} />
          <span>Agregar fila</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table movements-table">
          <thead>
            <tr>
              <th>Oficina</th>
              <th>Tipo</th>
              <th>Metodo</th>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Division</th>
              <th>Autorizo</th>
              <th>Importe</th>
              <th>Comentarios</th>
              <th aria-label="Eliminar" />
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id}>
                <td>
                  <select value={mov.oficina} onChange={(event) => updateMovement(mov.id, "oficina", event.target.value)}>
                    {catalogos.oficinas.map((oficina) => (
                      <option key={oficina} value={oficina}>
                        {oficina}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={mov.tipoMovimiento}
                    onChange={(event) => updateMovement(mov.id, "tipoMovimiento", event.target.value)}
                  >
                    {catalogos.tiposMovimiento.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={mov.metodoPago}
                    onChange={(event) => updateMovement(mov.id, "metodoPago", event.target.value)}
                  >
                    {catalogos.metodosPago.map((metodo) => (
                      <option key={metodo} value={metodo}>
                        {metodo}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input value={mov.folioOS} onChange={(event) => updateMovement(mov.id, "folioOS", event.target.value)} />
                </td>
                <td>
                  <input
                    value={mov.clienteRazonSocial}
                    onChange={(event) => updateMovement(mov.id, "clienteRazonSocial", event.target.value)}
                  />
                </td>
                <td>
                  <input value={mov.division} onChange={(event) => updateMovement(mov.id, "division", event.target.value)} />
                </td>
                <td>
                  <input value={mov.autorizo} onChange={(event) => updateMovement(mov.id, "autorizo", event.target.value)} />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={mov.importe}
                    onChange={(event) => updateMovement(mov.id, "importe", event.target.value)}
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    value={mov.comentarios}
                    onChange={(event) => updateMovement(mov.id, "comentarios", event.target.value)}
                  />
                </td>
                <td>
                  <button type="button" className="ghost square-button" onClick={() => removeMovement(mov.id)} title="Eliminar fila">
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
