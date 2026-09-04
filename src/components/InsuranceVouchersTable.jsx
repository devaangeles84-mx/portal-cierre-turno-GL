import React from "react";
import { createId } from "../utils/id";

function newVoucher(oficina) {
  return {
    id: createId("vale"),
    oficina,
    ordenGrips: "",
    aseguradora: "",
    folioVale: "",
    vehiculo: "",
    marca: "",
    modelo: "",
    color: "",
    anio: "",
    comentarios: ""
  };
}

export default function InsuranceVouchersTable({ oficina, vales, onChange }) {
  const updateVoucher = (id, field, value) => {
    onChange(vales.map((vale) => (vale.id === id ? { ...vale, [field]: value } : vale)));
  };

  const addVoucher = () => onChange([...vales, newVoucher(oficina)]);
  const removeVoucher = (id) => onChange(vales.filter((vale) => vale.id !== id));

  return (
    <section className="section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Valija CXC</p>
          <h2>Vales físicos de aseguradora</h2>
        </div>
        <button type="button" className="secondary icon-button" onClick={addVoucher}>
          <span aria-hidden="true">+</span>
          <span>Agregar vale</span>
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table vouchers-table">
          <thead>
            <tr>
              <th>Orden GRIPS</th>
              <th>Aseguradora</th>
              <th>Folio vale</th>
              <th>Vehículo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Año</th>
              <th>Comentarios</th>
              <th aria-label="Eliminar" />
            </tr>
          </thead>
          <tbody>
            {vales.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table-cell">
                  No hay vales físicos agregados para enviar a CXC.
                </td>
              </tr>
            ) : (
              vales.map((vale) => (
                <tr key={vale.id}>
                  <td>
                    <input
                      value={vale.ordenGrips}
                      onChange={(event) => updateVoucher(vale.id, "ordenGrips", event.target.value)}
                      placeholder="Orden"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.aseguradora}
                      onChange={(event) => updateVoucher(vale.id, "aseguradora", event.target.value)}
                      placeholder="Aseguradora"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.folioVale}
                      onChange={(event) => updateVoucher(vale.id, "folioVale", event.target.value)}
                      placeholder="Folio"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.vehiculo}
                      onChange={(event) => updateVoucher(vale.id, "vehiculo", event.target.value)}
                      placeholder="Vehiculo"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.marca}
                      onChange={(event) => updateVoucher(vale.id, "marca", event.target.value)}
                      placeholder="Marca"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.modelo}
                      onChange={(event) => updateVoucher(vale.id, "modelo", event.target.value)}
                      placeholder="Modelo"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.color}
                      onChange={(event) => updateVoucher(vale.id, "color", event.target.value)}
                      placeholder="Color"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      step="1"
                      value={vale.anio}
                      onChange={(event) => updateVoucher(vale.id, "anio", event.target.value)}
                      placeholder="Año"
                    />
                  </td>
                  <td>
                    <input
                      value={vale.comentarios}
                      onChange={(event) => updateVoucher(vale.id, "comentarios", event.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" className="ghost square-button" onClick={() => removeVoucher(vale.id)} title="Eliminar vale">
                    <span aria-hidden="true">x</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
