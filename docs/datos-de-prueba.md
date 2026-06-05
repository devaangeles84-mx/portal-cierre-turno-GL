# Datos de Prueba

Usa estos datos para simular un cierre.

## Encabezado

- Fecha: fecha actual
- Turno: General
- Usuario: Maria Lopez

## Oficina Alvarez

Efectivo reportado: `4800`

Movimientos:

| Tipo | Metodo | Folio | Cliente | Division | Autorizo | Importe | Comentarios |
|---|---|---|---|---|---|---:|---|
| Liberacion | Efectivo | OS-1001 | Cliente Norte | Admin | Luis | 2500 | Servicio liquidado |
| Pension | Efectivo | PEN-210 | Pension Alvarez | Caja | Ana | 900 | Pension diaria |
| Egreso | Efectivo | EG-77 | Papeleria | Admin | Luis | 300 | Compra autorizada |
| O.S. pendiente | No aplica | OS-1004 | Cliente Centro | Operacion | Ana | 1250 | Pendiente de recibir |
| Liberacion | Terminal BBVA | OS-1008 | Cliente Express | Admin | Luis | 1800 | Pago con terminal |

Conteo de efectivo:

| Concepto | Denominacion | Cantidad |
|---|---:|---:|
| Liberaciones | 1000 | 3 |
| Liberaciones | 500 | 2 |
| Liberaciones | 200 | 1 |
| Liberaciones | 100 | 3 |
| Pensiones | 500 | 1 |
| Pensiones | 200 | 2 |

Total contado: `5400`. Como el efectivo reportado es `4800`, habra diferencia de `600`; agrega observacion.

## Oficina La Partida (Matamoros)

Efectivo reportado: `3100`

Movimientos:

| Tipo | Metodo | Folio | Cliente | Division | Autorizo | Importe | Comentarios |
|---|---|---|---|---|---|---:|---|
| Liberacion | Efectivo | OS-2001 | Cliente Sur | Caja | Karla | 1500 | Recibido |
| O.S. recibida | Transferencia | FAC-330 | Empresa Delta | Admin | Raul | 2200 | Transferencia aplicada |
| Kashpay | Kashpay | KP-99 | Cliente Movil | Caja | Karla | 650 | Pago app |
| Pension | Efectivo | PEN-312 | Pension Matamoros | Caja | Raul | 700 | Pension diaria |

Conteo de efectivo:

| Concepto | Denominacion | Cantidad |
|---|---:|---:|
| Liberaciones | 1000 | 1 |
| Liberaciones | 500 | 3 |
| Liberaciones | 100 | 4 |
| Pensiones | 500 | 1 |
| Pensiones | 100 | 2 |

Total contado: `3600`. Como el efectivo reportado es `3100`, habra diferencia de `500`; agrega observacion.
