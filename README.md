cd# Cierre de Turno

Aplicacion web para capturar cierres diarios de operacion administrativa/caja, calcular totales en tiempo real, validar diferencias de efectivo y guardar la informacion en Google Sheets mediante Netlify Functions y Google Apps Script.

## Lo Que Incluye

- Frontend en React + Vite.
- Captura por oficina/sucursal.
- Tabla dinamica de movimientos.
- Arqueo fisico de efectivo por denominacion.
- Resumen automatico con diferencias.
- Borrador local en el navegador.
- Vista de impresion.
- Netlify Functions para no exponer tokens en el frontend.
- Google Apps Script para crear hojas, catalogos y guardar cierres.

## Estructura

```text
src/
  components/
  services/
  styles/
  utils/
netlify/functions/
google-apps-script/Code.gs
docs/
```

## Configuracion Local

1. Instala Node.js LTS.
2. Instala dependencias:

```bash
npm.cmd install
```

3. Copia `.env.example` a `.env` y llena:

```bash
GAS_WEBAPP_URL=https://script.google.com/macros/s/TU_WEB_APP_ID/exec
GAS_EXECUTION_TOKEN=un-token-largo-y-secreto
```

4. Ejecuta la app:

```bash
npm.cmd run dev
```

5. Abre la URL local que muestre Vite.

Sin Google Apps Script configurado, la app carga catalogos locales para que puedas revisar la interfaz.

## Usuarios Iniciales

Apps Script crea la hoja `Usuarios` con usuarios temporales para pruebas. Cambia las contrasenas antes de usarlo en produccion.

| Usuario | Contrasena temporal | Rol | Oficina |
|---|---|---|---|
| admin | admin123 | ADMIN | Todas |
| alvarez | alvarez123 | OFICINA | Alvarez |
| partida | partida123 | OFICINA | La Partida (Matamoros) |
| union | union123 | OFICINA | La Union |
| triunfo | triunfo123 | OFICINA | El Triunfo |
| gomez | gomez123 | OFICINA | Encierro Gomez (Walmart) |

En `localhost` hay un modo demo para poder navegar la app aunque las funciones de Netlify no esten corriendo. En Netlify, el login pasa por Netlify Functions y Google Apps Script.

### Si La Pantalla Sale En Blanco

No abras `index.html` con doble clic. React/Vite necesita un servidor local.

Usa:

```bash
npm.cmd run dev
```

Despues abre normalmente:

```text
http://localhost:5173
```

En Windows, si `npm` muestra un error de permisos de PowerShell, usa siempre `npm.cmd`.

## Crear Google Sheet

1. Entra a Google Drive.
2. Crea una hoja nueva.
3. Nombra el archivo: `Cierre de Turno DB`.
4. Abre `Extensiones > Apps Script`.
5. Borra el contenido inicial del editor.
6. Pega todo el contenido de `google-apps-script/Code.gs`.
7. Guarda el proyecto con el nombre `Cierre de Turno API`.

## Configurar Token en Apps Script

1. En Apps Script abre `Configuracion del proyecto`.
2. En `Propiedades de la secuencia de comandos`, agrega:

```text
GAS_EXECUTION_TOKEN = un-token-largo-y-secreto
```

Usa el mismo token despues en Netlify.

## Crear Hojas y Catalogos

1. En Apps Script, selecciona la funcion `setupSheets`.
2. Presiona `Ejecutar`.
3. Acepta los permisos de Google.
4. Regresa al Google Sheet y confirma que existan estas hojas:
   - `CierresTurno`
   - `CierreMovimientos`
   - `CierreConteoEfectivo`
   - `CierreOficinasResumen`
   - `Catalogos`

Puedes editar el catalogo de oficinas directamente en la hoja `Catalogos`.

## Publicar Apps Script Como Web App

1. En Apps Script presiona `Implementar > Nueva implementacion`.
2. Tipo: `Aplicacion web`.
3. Ejecutar como: `Yo`.
4. Quien tiene acceso: `Cualquier usuario`.
5. Presiona `Implementar`.
6. Copia la URL que termina en `/exec`.

Esa URL sera `GAS_WEBAPP_URL`.

## Subir a GitHub

Cuando estes listo:

1. Crea un repositorio nuevo en GitHub, por ejemplo `cierre-turno`.
2. En esta carpeta, inicializa Git y sube el proyecto:

```bash
git init
git add .
git commit -m "Primera version de cierre de turno"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cierre-turno.git
git push -u origin main
```

Si prefieres, tambien puedes crear el repositorio con GitHub Desktop y arrastrar esta carpeta.

## Deploy en Netlify

1. Entra a Netlify.
2. Presiona `Add new site > Import an existing project`.
3. Conecta GitHub.
4. Selecciona el repositorio `cierre-turno`.
5. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. En `Environment variables`, agrega:
   - `GAS_WEBAPP_URL`
   - `GAS_EXECUTION_TOKEN`
7. Presiona `Deploy`.

## Probar Guardado

1. Abre la URL publicada por Netlify.
2. Captura fecha, turno y usuario.
3. Agrega uno o varios movimientos.
4. Captura efectivo reportado por oficina.
5. Captura el conteo fisico en `Conteo de efectivo`.
6. Si hay diferencia, escribe una observacion.
7. Presiona `Enviar cierre`.
8. Abre Google Sheets y valida que se hayan llenado:
   - `CierresTurno`
   - `CierreMovimientos`
   - `CierreConteoEfectivo`
   - `CierreOficinasResumen`

## Recomendaciones Futuras

- Login por usuario y roles.
- Historial de cierres con busqueda por fecha/oficina.
- Edicion controlada de cierres enviados.
- Firma digital con canvas.
- Adjuntar comprobantes o fotos.
- Dashboard semanal/mensual.
- Exportacion a PDF.
- Auditoria de cambios.
