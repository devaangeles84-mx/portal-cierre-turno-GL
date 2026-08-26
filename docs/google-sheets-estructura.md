# Estructura de Google Sheets

## CierresTurno

`cierreId`, `createdAt`, `fechaCierre`, `turno`, `usuarioCaptura`, `estatus`, `totalEfectivo`, `totalKashpay`, `totalTerminal`, `totalTransferencia`, `totalPendientes`, `totalPensiones`, `totalGeneral`, `diferenciaGeneral`, `observaciones`, `entregaNombre`, `recibeNombre`, `trasladaNombre`

## CierreMovimientos

`movimientoId`, `cierreId`, `oficina`, `tipoMovimiento`, `metodoPago`, `folioOS`, `clienteRazonSocial`, `division`, `autorizo`, `importe`, `comentarios`

## CierreConteoEfectivo

`conteoId`, `cierreId`, `oficina`, `concepto`, `denominacion`, `cantidad`, `importe`

## CierreValesAseguradora

`valeId`, `cierreId`, `oficina`, `ordenGrips`, `aseguradora`, `folioVale`, `vehiculo`, `marca`, `modelo`, `color`, `anio`, `comentarios`

## CierreOficinasResumen

`resumenId`, `cierreId`, `oficina`, `efectivoReportado`, `efectivoContado`, `egresos`, `ingresos`, `liberaciones`, `kashpay`, `terminalBBVA`, `transferencia`, `pensiones`, `pendientes`, `importeSinPensiones`, `importeConPensiones`, `diferencia`

## Catalogos

`tipoCatalogo`, `clave`, `valor`, `activo`, `orden`
