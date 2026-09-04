# Datos de Prueba

Usa estos datos para simular un cierre completo.

## Login

- Oficina: `union` / `union123`
- Administrador: `admin` / `admin123`
- Contabilidad: `conta` / `conta123`

## Captura Operativa

- Fecha: fecha actual
- Turno: General
- Oficina: La Union

Movimientos:

| Tipo | Metodo | Folio | Cliente | Division | Autorizo | Importe | Comentarios |
|---|---|---|---|---|---|---:|---|
| Liberacion | Efectivo | OS-1001 | Cliente Norte | Gruas de Arrastre | HGG | 2500 | Servicio liquidado |
| Pension | Efectivo | PEN-210 | Pension La Union | Encierro | HSG | 900 | Pension diaria |
| Egreso | Efectivo | EG-77 | Papeleria | Encierro | MGA | 300 | Compra autorizada |
| O.S. pendiente | No aplica | OS-1004 | Cliente Centro | Industrial | KGA | 1250 | Pendiente de recibir |
| Liberacion | Terminal BBVA | OS-1008 | Cliente Express | Gruas de Arrastre | HGG | 1800 | Pago con terminal |
| Pension | CLIP | PEN-312 | Cliente Movil | Encierro | HSG | 650 | Pago CLIP |

Conteo de efectivo consolidado:

| Denominacion | Cantidad |
|---|---:|
| 1000 | 3 |
| 500 | 1 |
| 200 | 2 |
| 100 | 2 |

Total contado: `4100`.

Resultado esperado:

- Efectivo esperado: `3100`
- Efectivo contado: `4100`
- Diferencia: `1000`

Para probar validacion contable con diferencia, agrega una observacion de validacion antes de presionar `Validar cierre`.
