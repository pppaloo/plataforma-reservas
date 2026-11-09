# ReservaPro — Plataforma de reservas con DevSecOps

Plataforma web full stack para la gestión de reservas de un centro de bienestar. Incluye
autenticación JWT, control de acceso por roles, panel administrativo, formulario de contacto con
envío de correos, redes sociales administrables, chatbot generativo con contexto del negocio, pipeline CI/CD y
análisis de seguridad DevSecOps.

**Proyecto César** · Certamen práctico integrador — Desarrollo Web Seguro · DevOps · DevSecOps

## Integrantes

| N.º | Nombre completo |
| --- | --- |
| 1 | Paloma Andrea Chávez Proboste |
| 2 | Javiera Belén Zambrano Chávez |
| 3 | Benjamín Esteban Grez Rivas |

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 18 + Vite + React Router; tipografía Manrope self-hosted |
| Backend | Node.js + Express 4 |
| Base de datos | MongoDB Atlas + Mongoose 8 |
| Autenticación | JWT (access + refresh) + bcrypt |
| Correo | Nodemailer (SMTP) |
| Chatbot | LLM compatible con OpenAI + FAQ/servicios como contexto |
| Validación | Zod (servidor) + validación HTML/JS (cliente) |
| Seguridad | Helmet, CORS restringido, rate limiting, sanitización NoSQL |
| CI/CD | GitHub Actions + Render |
| DevSecOps | npm audit (SCA), CodeQL (SAST), OWASP ZAP (DAST) |

## Funcionalidades implementadas

- Página principal, catálogo de servicios y sección de contacto responsivos.
- Registro, inicio y cierre de sesión con JWT y refresh token rotativo.
- Contraseñas almacenadas con bcrypt (12 rondas); nunca se devuelven en la API.
- Roles `admin` y `client` con middleware de autorización.
- Reservas: creación con validación de disponibilidad, cupos y fechas; cancelación por el dueño;
  cambio de estado por el administrador.
- Panel administrativo: reservas, servicios, usuarios, preguntas del chatbot, redes sociales y
  mensajes de contacto.
- Formulario de contacto con doble validación, registro en MongoDB y dos correos (institucional y
  confirmación al cliente).
- Chatbot generativo (proveedor compatible con OpenAI) que conversa sobre bienestar y responde con
  las FAQ y los servicios como contexto oficial. Si el proveedor falla, degrada a un motor de reglas
  y registra el origen de cada respuesta.
- Enlaces de redes sociales administrables sin tocar código.
- Pipeline CI (pruebas + build), CD (deploy hook de Render) y workflow de seguridad.

## Requisitos

- Node.js 20 o superior
- Cuenta de MongoDB Atlas (o una instancia MongoDB accesible)
- Git

## Instalación y ejecución local

```bash
# 1. Dependencias de la raíz y de cada modulo
npm install
npm run install:all

# 2. Configuracion
#    Copia backend/.env.example a backend/.env y completa los valores
#    PowerShell: Copy-Item backend\.env.example backend\.env
#    Bash:       cp backend/.env.example backend/.env

# 3. Datos iniciales (administrador, servicios, redes y FAQ)
npm run seed

# 4. Desarrollo (API en :4000 y frontend en :5173)
npm run dev
```

Abrir `http://localhost:5173`. El frontend usa un proxy de Vite hacia `/api`, por lo que las cookies
funcionan igual que en producción (mismo origen).

### Variables de entorno

Todas se definen en `backend/.env` (ver `backend/.env.example`). Nunca se versiona el archivo real.

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `MONGODB_URI` | Sí | Cadena de conexión de MongoDB Atlas |
| `JWT_ACCESS_SECRET` | Sí | Secreto del access token (mín. 32 caracteres) |
| `JWT_REFRESH_SECRET` | Sí | Secreto del refresh token, distinto del anterior |
| `JWT_ACCESS_TTL` | No | Vigencia del access token (por defecto `15m`) |
| `JWT_REFRESH_DAYS` | No | Vigencia del refresh token en días (por defecto `7`) |
| `CLIENT_ORIGIN` | No | Orígenes permitidos por CORS, separados por coma |
| `COOKIE_SAMESITE` | No | `lax` (mismo dominio) o `none` (dominios distintos con HTTPS) |
| `SMTP_*`, `MAIL_*` | No | Si faltan, los correos se omiten y queda el registro en MongoDB |
| `LLM_API_KEY` | No* | Clave del proveedor generativo; sin ella el chatbot usa reglas |
| `LLM_BASE_URL` | No | URL compatible con OpenAI (por defecto `https://api.openai.com/v1`) |
| `LLM_MODEL` | No | Modelo a usar (por defecto `gpt-4o-mini`) |
| `LLM_TEMPERATURE` / `LLM_MAX_TOKENS` | No | Creatividad y largo máximo de la respuesta |

\* Para cumplir el requisito de respuestas generativas debe configurarse `LLM_API_KEY`.
| `ADMIN_*` | No | Credenciales usadas por `npm run seed` |

Generar secretos:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## API REST

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/health` | Público | Estado del servicio |
| POST | `/api/auth/register` | Público | Registro de usuario |
| POST | `/api/auth/login` | Público | Inicio de sesión |
| POST | `/api/auth/refresh` | Cookie | Renueva access token y rota refresh |
| POST | `/api/auth/logout` | Público | Revoca el refresh token |
| GET | `/api/auth/me` | Autenticado | Perfil actual |
| GET | `/api/services` | Público | Servicios activos (`?all=1` solo admin) |
| POST / PATCH / DELETE | `/api/services/:id` | Admin | CRUD de servicios |
| POST | `/api/reservations` | Autenticado | Crear reserva |
| GET | `/api/reservations/mine` | Autenticado | Reservas propias |
| PATCH | `/api/reservations/:id/cancel` | Dueño / admin | Cancelar reserva |
| GET | `/api/reservations` | Admin | Todas las reservas |
| PATCH | `/api/reservations/:id` | Admin | Cambiar estado |
| POST | `/api/contact` | Público | Enviar solicitud de contacto |
| GET / PATCH | `/api/contact` | Admin | Listar y gestionar solicitudes |
| GET | `/api/social` | Público | Enlaces activos (`?all=1` solo admin) |
| POST / PATCH / DELETE | `/api/social/:id` | Admin | CRUD de redes |
| GET | `/api/chatbot/welcome` | Público | Bienvenida y modo (`llm` o `rules`) |
| POST | `/api/chatbot/message` | Público | Consulta al chatbot generativo |
| GET | `/api/chatbot/faqs` | Admin | Listar FAQ |
| POST / PATCH / DELETE | `/api/chatbot/faqs/:id` | Admin | CRUD de FAQ |
| GET | `/api/users` | Admin | Listar usuarios |
| PATCH | `/api/users/:id` | Admin | Cambiar rol o estado |

Todas las respuestas de error usan el formato `{ ok: false, message, code }`. En producción no se
incluyen trazas ni detalles internos.

## Seguridad implementada

- **JWT**: access token de 15 minutos con `sub` y `role`; refresh token de 7 días en cookie
  `httpOnly`, `Secure` en producción, `SameSite` y `path=/api/auth`.
- **Rotación y revocación**: el refresh se guarda solo como hash SHA-256; cada renovación invalida
  el anterior y el logout lo elimina.
- **Contraseñas**: bcrypt con 12 rondas mediante callback promisificado.
- **Autorización**: middleware `authenticate` + `requireRole('admin')`; respuestas 401 y 403
  diferenciadas.
- **Validación**: esquemas Zod en todos los endpoints que reciben datos; rechazo de saltos de línea
  en campos usados en correos (previene inyección de cabeceras).
- **NoSQL injection**: `mongoose.set('sanitizeFilter', true)` + validación estricta de tipos.
- **XSS**: React escapa la salida por defecto; CSP restrictiva servida por Helmet.
- **Cabeceras**: Helmet con CSP, HSTS en producción, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'none'`.
- **CORS**: lista explícita de orígenes con credenciales; nunca `*`.
- **Rate limiting**: global, login, registro, contacto y chatbot con límites diferenciados.
- **Chatbot generativo**: la clave del proveedor vive solo en el servidor, el contexto se limita a
  información pública del negocio, se aplican instrucciones contra prompt injection, timeout de 15 s
  y tope de respuesta. No se envían datos personales ni credenciales al modelo.
- **Secretos**: solo en variables de entorno; `.env` fuera del repositorio.
- **Datos sensibles**: `passwordHash` y tokens de refresh usan `select: false` y se eliminan en
  `toJSON`.
- **Errores**: manejador central que oculta trazas en producción.

## DevOps y DevSecOps

| Workflow | Contenido |
| --- | --- |
| `.github/workflows/ci.yml` | `npm ci`, pruebas Jest + Supertest, build de React y deploy hook de Render en `main` |
| `.github/workflows/security.yml` | `npm audit` (SCA), CodeQL (SAST) y OWASP ZAP Baseline (DAST manual) |

El escaneo DAST se ejecuta manualmente (`workflow_dispatch`) y requiere el secreto `PUBLIC_URL` con
la URL HTTPS publicada. El umbral definido es **fallar ante vulnerabilidades High o Critical en
dependencias de producción**; los hallazgos de ZAP se ajustan en `zap/rules.tsv`, con cada excepción
justificada en el informe de seguridad.

## Despliegue

La guía completa está en [`docs/04-manual-despliegue.md`](docs/04-manual-despliegue.md). Resumen:

1. Crear el cluster en MongoDB Atlas y un usuario con rol `readWrite` solo sobre la base `reservas`.
2. Crear un Web Service en Render conectado al repositorio (o usar `render.yaml`).
3. Configurar las variables de entorno en Render; los secretos JWT pueden generarse allí.
4. Ejecutar `npm run seed` apuntando a Atlas para crear el administrador inicial.
5. Verificar `https://TU-APP.onrender.com/api/health` y las credenciales de demostración.

## Estructura del repositorio

```
proyecto-cesar/
├─ backend/
│  ├─ src/
│  │  ├─ config/        variables de entorno y conexión a MongoDB
│  │  ├─ controllers/   lógica de cada recurso
│  │  ├─ middleware/    auth, roles, validación, rate limit, errores
│  │  ├─ models/        7 colecciones Mongoose
│  │  ├─ routes/        definición de endpoints
│  │  ├─ services/      correo, IA generativa y respaldo por reglas
│  │  ├─ utils/         JWT, bcrypt, helpers
│  │  ├─ validators/    esquemas Zod
│  │  ├─ app.js         configuración de Express
│  │  ├─ server.js      arranque y cierre ordenado
│  │  └─ seed.js        datos iniciales
│  └─ tests/            pruebas automatizadas
├─ frontend/
│  └─ src/
│     ├─ api/           cliente HTTP con refresh automático
│     ├─ components/    navbar, footer, chatbot, rutas protegidas
│     ├─ context/       sesión y usuario
│     ├─ pages/         públicas, privadas y panel admin
│     └─ utils/         formatos de fecha y moneda
├─ docs/                arquitectura, modelo de datos, seguridad, despliegue, plan
├─ zap/rules.tsv        ajuste justificado de reglas ZAP
└─ .github/workflows/   CI y seguridad
```

## Documentación

- [`docs/01-arquitectura.md`](docs/01-arquitectura.md) — problema, alcance, arquitectura y decisiones.
- [`docs/02-modelo-datos.md`](docs/02-modelo-datos.md) — colecciones, índices, privilegios y respaldo.
- [`docs/03-informe-seguridad.md`](docs/03-informe-seguridad.md) — metodología, hallazgos y comparación.
- [`docs/04-manual-despliegue.md`](docs/04-manual-despliegue.md) — Atlas, Render, seed y verificación.
- [`docs/05-plan-equipo.md`](docs/05-plan-equipo.md) — reparto de trabajo, cronograma y guion de defensa.

## Credenciales de demostración

El seed crea el administrador con las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD`. **Cambiar la
contraseña antes de desplegar** y entregar las credenciales de demostración por un canal seguro, tal
como exige el certamen. No se incluyen credenciales reales en este repositorio.
