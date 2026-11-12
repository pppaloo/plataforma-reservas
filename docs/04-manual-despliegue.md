# 04 · Manual de despliegue y operación

Arquitectura de producción: **un solo Web Service en Render** que sirve la API y el build de React,
más **MongoDB Atlas** como base de datos. El correo se envía por SMTP.

## 1. Requisitos previos

- Repositorio en GitHub con el código.
- Cuenta gratuita en MongoDB Atlas.
- Cuenta gratuita en Render.
- Cuenta SMTP (Brevo, Gmail con contraseña de aplicación, Mailtrap para pruebas, etc.).

## 2. MongoDB Atlas

1. Crear un cluster **M0 (Free)** en la región más cercana (por ejemplo, `us-east-1` o `sa-east-1`).
2. **Database Access → Add New Database User**
   - Usuario: `reservas_app`
   - Contraseña: generada y guardada en un lugar seguro
   - Privilegios: rol personalizado `readWrite` sobre la base `reservas`
3. **Network Access → Add IP Address**
   - Para Render Free (IP dinámica): `0.0.0.0/0`.
   - Registrar esta decisión como riesgo aceptado R-02 en el informe de seguridad.
4. **Database → Connect → Drivers**: copiar la cadena `mongodb+srv://...` y agregar el nombre de la
   base:

```
mongodb+srv://reservas_app:CLAVE@cluster0.xxxxx.mongodb.net/reservas?retryWrites=true&w=majority
```

5. Probar la conexión:

```bash
mongosh "CADENA_DE_CONEXION" --eval "db.runCommand({ ping: 1 })"
```

## 3. Render

### Despliegue con `render.yaml` (recomendado)

1. Subir el repositorio a GitHub.
2. En Render: **New → Blueprint** y seleccionar el repositorio.
3. Render detecta `render.yaml` y solicita los valores marcados con `sync: false`:
   `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_*`, `MAIL_*`, `LLM_API_KEY`.
4. Confirmar. El build ejecuta:

```
npm ci --prefix backend
npm ci --prefix frontend
npm run build --prefix frontend
npm start --prefix backend
```

### Despliegue manual del Web Service

| Campo | Valor |
| --- | --- |
| Runtime | Node |
| Build Command | `npm ci --prefix backend && npm ci --prefix frontend && npm run build --prefix frontend` |
| Start Command | `npm start --prefix backend` |
| Health Check Path | `/api/health` |

### Variables de entorno obligatorias en Render

| Variable | Valor |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Cadena de Atlas con el usuario de aplicación |
| `JWT_ACCESS_SECRET` | 48 bytes aleatorios en hex (o `generateValue`) |
| `JWT_REFRESH_SECRET` | Otro valor distinto de 48 bytes |
| `COOKIE_SAMESITE` | `lax` (mismo dominio) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales iniciales del administrador |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Proveedor de correo |
| `MAIL_FROM` | Remitente verificado |
| `MAIL_INSTITUTIONAL_TO` | Buzón que recibe las solicitudes |
| `LLM_API_KEY` | Clave del proveedor generativo (obligatoria para el chatbot con IA) |
| `LLM_BASE_URL` | `https://api.openai.com/v1` u otro proveedor compatible |
| `LLM_MODEL` | Modelo, por ejemplo `gpt-4o-mini` |

### Chatbot generativo

El asistente usa un proveedor **compatible con la API de OpenAI**. La clave se configura solo en el
servidor y nunca se envía al navegador.

| Proveedor | `LLM_BASE_URL` | Ejemplo de `LLM_MODEL` |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.0-flash` |
| OpenRouter | `https://openrouter.ai/api/v1` | `openai/gpt-4o-mini` |

Verificación: `GET /api/chatbot/welcome` debe responder `"mode":"llm"`. Si responde `"rules"`, falta
la clave o el proveedor no está configurado. Para controlar costos se limita el largo del mensaje, el
tope de tokens, el tiempo de espera y la frecuencia por IP; además el modelo solo recibe información
pública del negocio y el texto de la conversación.

`CLIENT_ORIGIN` es opcional: si no se define, se usa `RENDER_EXTERNAL_URL` automáticamente para CORS.

> **Importante:** si más adelante separan el frontend en Vercel, deberán definir
> `CLIENT_ORIGIN=https://su-frontend.vercel.app`, `COOKIE_SAMESITE=none` y mantener HTTPS en ambos.

## 4. Datos iniciales

El seed se ejecuta una vez contra Atlas desde un equipo local o desde una Shell de Render:

```bash
cd backend
# con backend/.env apuntando a Atlas
npm run seed
```

Crea:

- Administrador (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Cuatro servicios de ejemplo.
- Tres redes sociales.
- Seis preguntas frecuentes del chatbot.

Es idempotente: si el administrador ya existe no cambia su contraseña y no duplica colecciones.

**Cambiar la contraseña del administrador** antes de la entrega. Para rotarla:

```bash
cd backend
node -e "require('dotenv').config(); const m=require('mongoose'); const b=require('bcryptjs'); m.connect(process.env.MONGODB_URI).then(async()=>{const h=await b.hash('NuevaClaveSegura123',12); await m.connection.collection('users').updateOne({email:'admin@reservapro.cl'},{\$set:{passwordHash:h,refreshTokenHash:null}}); console.log('ok'); process.exit(0)})"
```

## 5. Verificación posterior al despliegue

| Verificación | Comando / acción | Resultado esperado |
| --- | --- | --- |
| Salud | `curl https://proyecto-cesar.onrender.com/api/health` | `{"ok":true,"status":"up"}` |
| HTTPS | Abrir la URL en el navegador | Candado válido |
| Cabeceras | `curl -I https://proyecto-cesar.onrender.com` | `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Permissions-Policy` |
| Registro | Crear cuenta desde `/registro` | 201 y sesión iniciada |
| Login admin | `/login` con las credenciales del seed | Acceso a `/admin` |
| Autorización | Con sesión de cliente abrir `/admin` | Mensaje de permisos; API responde 403 |
| Reserva | Reservar una hora | Registro visible en “Mis reservas” y en el panel |
| Contacto | Enviar formulario | Registro en panel + dos correos |
| Chatbot | Preguntar “¿Cuál es el horario?” y luego algo general (“¿cómo duermo mejor?”) | Respuesta con datos de MongoDB y respuesta generativa; `source` indica `llm` o `rules` |
| Modo del chatbot | `curl https://proyecto-cesar.onrender.com/api/chatbot/welcome` | `"mode":"llm"` si la clave está configurada |
| Base de datos | Atlas → Browse Collections | Documentos creados |
| Secretos | Buscar en GitHub | Sin `.env`, claves ni tokens |

## 6. Escaneos de seguridad

### SCA y SAST

Se ejecutan automáticamente en cada push/PR mediante `.github/workflows/security.yml`.

### DAST con OWASP ZAP

1. Ir a GitHub → **Actions → Security (DevSecOps) → Run workflow**.
2. Tener configurado el secreto `PUBLIC_URL` con `https://proyecto-cesar.onrender.com`.
3. Descargar el artefacto `zap-baseline-report`.
4. Guardar copia en `docs/evidencias/`.
5. Documentar cada alerta en `docs/03-informe-seguridad.md`.

**Importante:** Render Free suspende el servicio tras inactividad. Antes de escanear, abrir la URL
durante 30–60 segundos hasta que responda; de lo contrario ZAP recibirá un error de arranque.

### Ajuste de reglas

Cada excepción en `zap/rules.tsv` debe tener justificación en el informe. No se debe exceptuar un
hallazgo solo para “dejar el pipeline en verde”.

## 7. Operación y mantenimiento

- **Logs:** Render → Logs. No contienen contraseñas ni tokens; no registrar cuerpos de solicitudes.
- **Actualizaciones:** Dependabot o `npm audit fix`; abrir PR y dejar que CI valide.
- **Respaldos:** seguir el procedimiento de `docs/02-modelo-datos.md`.
- **Rotación de secretos:** cambiar `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` invalida todas las
  sesiones activas (comportamiento esperado).
- **Cuentas desactivadas:** el middleware recarga el usuario, por lo que pierden acceso de inmediato.

## 8. Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `Falta la variable de entorno obligatoria` | Variables no configuradas en Render | Revisar Environment |
| Error de conexión a MongoDB | IP no autorizada o usuario sin permisos | Network Access / Database Access |
| CORS bloqueado | `CLIENT_ORIGIN` no coincide con el dominio real | Ajustar la variable |
| La sesión no persiste | Cookie `SameSite=None` sin HTTPS o dominios cruzados | Usar `lax` con servicio único |
| El primer acceso tarda ~50 s | Cold start de Render Free | Esperar o usar plan pago |
| ZAP falla por timeout | Servicio dormido | Precalentar la URL antes del escaneo |
| Correos no llegan | SMTP mal configurado o remitente no verificado | Revisar logs y proveedor |
| El chatbot responde con reglas y no con IA | Falta `LLM_API_KEY`, proveedor caído o timeout | Revisar variables y logs `[llm]`; el respaldo mantiene el servicio operativo |
| `npm ci` falla en Render | Falta `package-lock.json` | Commitear los lockfiles |

## 9. Entrega en EVA

Adjuntar:

1. URL pública.
2. Enlace al repositorio GitHub.
3. Informe de seguridad con evidencias.
4. Manual técnico (este documento + README).
5. Credenciales de demostración (admin y cliente) por canal seguro.
6. Identificación de los tres integrantes.
