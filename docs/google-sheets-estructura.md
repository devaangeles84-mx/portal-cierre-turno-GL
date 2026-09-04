# Estructura de Google Sheets

## Usuarios

`usuario`, `passwordHash`, `passwordTemporal`, `nombre`, `rol`, `oficina`, `activo`

Roles permitidos: `OFICINA`, `ADMIN`, `CONTABILIDAD`.

## CierresTurno

`cierreId`, `createdAt`, `fechaCierre`, `turno`, `oficina`, `usuarioCaptura`, `usuarioNombre`, `estatus`, `efectivoReportado`, `efectivoContado`, `egresos`, `osPendientes`, `ingresosOS`, `liberaciones`, `clip`, `kashpay`, `terminalBBVA`, `transferencia`, `pensiones`, `sobrantes`, `faltantes`, `totalEfectivo`, `totalClip`, `totalKashpay`, `totalTerminal`, `totalTransferencia`, `totalPendientes`, `totalPensiones`, `totalGeneral`, `diferenciaGeneral`, `observaciones`, `entregaNombre`, `recibeNombre`, `trasladaNombre`, `rutaValija`, `timestampGuardado`, `timestampEnviado`, `validadoPorUsuarioId`, `validadoPorNombre`, `validadoTimestamp`, `observacionValidacion`

`kashpay` y `totalKashpay` se conservan solo por compatibilidad; en interfaz se muestran como `CLIP`.

## CierreMovimientos

`movimientoId`, `cierreId`, `oficina`, `tipoMovimiento`, `metodoPago`, `folioOS`, `clienteRazonSocial`, `division`, `autorizo`, `importe`, `comentarios`

## CierreConteoEfectivo

`conteoId`, `cierreId`, `oficina`, `concepto`, `denominacion`, `cantidad`, `importe`

El concepto nuevo se guarda como `Consolidado`; ya no se separa el arqueo fisico entre Liberaciones y Pensiones.

## CierreValesAseguradora

`valeId`, `cierreId`, `oficina`, `ordenGrips`, `aseguradora`, `folioVale`, `vehiculo`, `marca`, `modelo`, `color`, `anio`, `comentarios`

## CierreOficinasResumen

`resumenId`, `cierreId`, `oficina`, `efectivoReportado`, `efectivoContado`, `egresos`, `ingresos`, `liberaciones`, `clip`, `kashpay`, `terminalBBVA`, `transferencia`, `pensiones`, `sobrantes`, `faltantes`, `pendientes`, `importeSinPensiones`, `importeConPensiones`, `diferencia`

## CierreAuditoria

`auditId`, `cierreId`, `usuarioId`, `usuarioNombre`, `oficinaHabitual`, `oficinaSeleccionada`, `fechaCierre`, `turno`, `estatus`, `accion`, `timestamp`

Acciones principales: `GUARDAR_BORRADOR`, `ENVIAR_CIERRE`, `VALIDAR_CIERRE`, `ELIMINAR_BORRADOR`.

## Catalogos

`tipoCatalogo`, `clave`, `valor`, `activo`, `orden`

Catalogos usados: `Oficinas`, `MetodosPago`, `TiposMovimiento`, `Divisiones`, `Autorizo`, `Denominaciones`, `Turnos`.

## Calculos

`efectivoEsperado = movimientos en efectivo - egresos`

`efectivoContado = suma de cantidad * denominacion en el arqueo consolidado`

`totalGeneral = efectivoEsperado + CLIP + Terminal BBVA + Transferencia`

`diferenciaGeneral = efectivoContado - efectivoEsperado`

`Sobrante` y `Faltante` se registran como movimientos de control y aparecen en reportes, pero no se suman al metodo de pago para evitar doble conteo.
