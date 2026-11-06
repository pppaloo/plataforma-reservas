# 05 · Plan de trabajo, reparto y guion de defensa

## 1. Reparto de responsabilidades

Las tres personas deben conocer la arquitectura completa. El reparto es de **ejecución**, no de
conocimiento: cada módulo tiene un dueño, pero todos participan en la revisión y en la defensa.

| Integrante | Módulos principales | Entregables |
| --- | --- | --- |
| **Paloma Chávez** | Backend de autenticación y seguridad: `authController`, `middleware/auth`, `requireRole`, `validators`, `utils/token`, `utils/password`, configuración de Helmet/CORS/rate limit | Evidencia de JWT, roles, bcrypt y expiración; informe de seguridad (coordinación) |
| **Javiera Zambrano** | Frontend y experiencia: páginas públicas, `AuthContext`, cliente HTTP con refresh, chatbot, formulario de contacto y plantillas de correo | Evidencia de interfaz responsiva, chatbot administrable y doble correo |
| **Benjamín Grez** | Datos y operación: modelos Mongoose, Atlas, índices, seed, reservas, panel administrativo, CI/CD, despliegue y ejecución de ZAP | Modelo de datos, respaldo, pipeline en verde y reporte ZAP |

**Regla de revisión cruzada:** ningún cambio llega a `main` sin que otra persona lo haya leído. Cada
integrante debe poder explicar al menos una decisión del módulo de otro.

## 2. Cronograma (6 días)

| Fecha | Objetivo | Responsable principal | Criterio de término |
| --- | --- | --- | --- |
| Vie 6 nov | Repositorio, Atlas, `.env`, seed, ejecución local, ramas `main`/`develop` | Benjamín | `npm run dev` funciona y el admin inicia sesión |
| Sáb 7 nov | Verificar auth completa, roles, expiración y refresh; probar registro/login desde la UI | Paloma | Rutas privadas devuelven 401/403 correctamente |
| Dom 8 nov | Reservas, panel admin completo, contacto, chatbot y redes | Javiera + Benjamín | Los 12 escenarios de defensa son ejecutables en local |
| Lun 9 nov | Despliegue en Render, variables, correos reales, CI en verde | Benjamín | URL HTTPS operativa y pipeline aprobado |
| Mar 10 nov | Escaneo inicial: ZAP + npm audit + CodeQL; registrar hallazgos | Paloma | Informe con tabla inicial y evidencias guardadas |
| Mié 11 nov | Correcciones, re-escaneo, informe comparativo, README, ensayo de defensa | Todos | Tabla antes/después completa y ensayo cronometrado |
| Jue 12 nov | Entrega en EVA y verificación final | Todos | Enlaces, documentos y credenciales cargados y visibles |

> El día 11 es colchón real. No planificar correcciones para el mismo día de la entrega.

## 3. Paquetes de trabajo y definición de “terminado”

### PT-1 · Autenticación (Paloma)

- [ ] Registro con validación Zod y hash bcrypt de 12 rondas.
- [ ] Login con mensaje uniforme ante credenciales inválidas.
- [ ] Access token 15 min; refresh 7 días en cookie `httpOnly`.
- [ ] Rotación y revocación del refresh (hash SHA-256 en BD).
- [ ] `authenticate` y `requireRole` aplicados a todas las rutas privadas.
- [ ] Pruebas: sin token, token inválido, token expirado, rol incorrecto.

**Terminado cuando:** `npm test` pasa y se demuestra 401/403 en vivo.

### PT-2 · Datos y reservas (Benjamín)

- [ ] Atlas con usuario `readWrite` solo sobre `reservas`.
- [ ] Siete colecciones con índices y validaciones.
- [ ] CRUD de servicios con baja lógica.
- [ ] Reserva con validación de fecha, capacidad y cupos.
- [ ] Cancelación por dueño y cambio de estado por admin.
- [ ] Respaldo documentado y probado.

**Terminado cuando:** se crea una reserva, se ve en panel y se restaura un respaldo de prueba.

### PT-3 · Interfaz y chatbot (Javiera)

- [ ] Diseño responsivo en móvil y escritorio.
- [ ] Registro, login, mis reservas y rutas protegidas.
- [ ] Formulario de contacto con validación y mensajes claros.
- [ ] Chatbot con bienvenida, sugerencias, fallback y registro.
- [ ] Panel para administrar FAQ y redes.
- [ ] Correos: institucional + confirmación (plantillas escapadas).

**Terminado cuando:** los dos correos llegan y el chatbot responde desde MongoDB.

### PT-4 · DevOps y DevSecOps (Benjamín + Paloma)

- [ ] Ramas `main` y `develop` con Pull Requests.
- [ ] CI: instalación, tests y build en cada push/PR.
- [ ] CD: deploy hook de Render al mergear a `main`.
- [ ] SCA con `npm audit` y umbral High justificado.
- [ ] SAST con CodeQL.
- [ ] DAST con ZAP y reporte adjunto.
- [ ] Informe comparativo antes/después.

**Terminado cuando:** el pipeline está en verde y el informe tiene tabla comparativa con evidencia.

## 4. Guion de defensa (12 escenarios del certamen)

| # | Escenario | Dónde demostrarlo | Qué explicar |
| --- | --- | --- | --- |
| 1 | Registrar usuario y verificar que la contraseña no está en texto plano | `/registro` → Atlas → `users` | bcrypt con sal y 12 rondas; `passwordHash` nunca se devuelve |
| 2 | Login y generación/validación del JWT | `/login` → DevTools → Network | access token en memoria, refresh en cookie; payload solo `sub` y `role` |
| 3 | Ruta protegida sin token | `curl /api/auth/me` o DevTools | 401 `TOKEN_MISSING` |
| 4 | Panel admin con usuario sin permisos | Iniciar como cliente e ir a `/admin` | frontend bloquea + backend responde 403 `FORBIDDEN` |
| 5 | Estructura y administración de la BD | Atlas → Browse Collections → índices | colecciones, referencias, índices y usuario con mínimo privilegio |
| 6 | Enviar formulario y comprobar registro y correos | `/contacto` → panel → buzones | dos correos y `emailStatus`; rate limit si se repite |
| 7 | Modificar un enlace de red social | Panel → Redes → editar/activar | el sitio público refleja el cambio sin recompilar |
| 8 | Interactuar con el chatbot y administrar FAQ | Widget → Panel → Chatbot | coincidencia por palabras clave y fallback; persistencia de la conversación |
| 9 | Repositorio y pipeline CI/CD | GitHub → Actions | CI en verde, CD en `main`, ramas y PR |
| 10 | Resultado del análisis de vulnerabilidades | Informe + artefacto ZAP | herramientas, severidades y alcance autorizado |
| 11 | Explicar una vulnerabilidad, impacto y solución | Ejemplo H-01 | causa, riesgo y commit de corrección |
| 12 | Mostrar el análisis posterior | Re-escaneo | comparación antes/después y alerta ausente |

### Frases que conviene tener preparadas

- “El JWT está firmado, no cifrado: cualquiera puede leer el payload. Por eso solo incluye `sub` y
  `role`.”
- “El access token vive en memoria y dura 15 minutos; el refresh está en una cookie `httpOnly` que
  JavaScript no puede leer.”
- “Cada refresh rota el token y guardamos solo su hash; si alguien reutiliza uno viejo, la sesión se
  invalida.”
- “bcrypt es un hash adaptativo: tiene sal y es lento a propósito, lo que encarece la fuerza bruta.”
- “La validación del cliente mejora la experiencia, pero la que protege es la del servidor.”
- “`sanitizeFilter` evita que un objeto como `{ $ne: null }` se interprete como operador en el login.”
- “SAST analiza el código, SCA las dependencias y DAST la aplicación corriendo.”
- “El umbral del pipeline es High/Critical en dependencias de producción porque las de desarrollo no
  se despliegan.”
- “El riesgo aceptado R-01 se justifica porque la API no usa cookies para mutar estado.”

## 5. Preguntas conceptuales probables

1. **¿Por qué JWT y no sesiones en servidor?**
   Es stateless: el servidor no guarda sesión por usuario. Se complementa con refresh revocable para
   no perder control.
2. **¿Qué pasa si roban el access token?**
   Sirve como máximo 15 minutos. El refresh es `httpOnly` y rotativo; si se detecta reutilización, se
   revoca.
3. **¿Por qué no guardar el token en `localStorage`?**
   Porque cualquier XSS podría leerlo. En memoria desaparece al recargar y se renueva con la cookie
   `httpOnly`.
4. **¿Por qué bcrypt y no SHA-256?**
   SHA-256 es rápido y sin sal; bcrypt es lento, con sal y configurable, lo que dificulta los ataques
   de diccionario y tablas precalculadas.
5. **¿Cómo funciona el control de roles?**
   El rol viaja en el JWT, pero el middleware recarga el usuario desde la base y `requireRole` valida
   el rol actual antes de ejecutar el controlador.
6. **¿Qué es inyección NoSQL?**
   Enviar operadores como `$ne`, `$gt` o `$where` en lugar de valores. Se mitiga validando tipos con
   Zod y activando `sanitizeFilter`.
7. **¿Cómo se previene XSS?**
   React escapa la salida, la CSP restringe orígenes de scripts y los correos escapan HTML antes de
   interpolar datos del usuario.
8. **¿Qué diferencia hay entre SAST, SCA y DAST?**
   SAST revisa código sin ejecutarlo; SCA revisa dependencias; DAST prueba la aplicación desplegada.
9. **¿Qué aporta Helmet?**
   Cabeceras que reducen superficie: CSP, HSTS, `nosniff`, `frame-ancestors`, `Referrer-Policy`,
   `Permissions-Policy`.
10. **¿Por qué CORS no es `*`?**
    Porque con credenciales el navegador lo prohíbe y porque permitir cualquier origen facilita
    peticiones no deseadas. Se usa una lista explícita.
11. **¿Por qué rate limiting en login y contacto?**
    Frena fuerza bruta y spam. El login tiene un límite más estricto que la API general.
12. **¿Por qué el usuario de BD no es administrador?**
    Principio de mínimo privilegio: si la credencial se filtra, el daño se limita a la base de la
    aplicación.
13. **¿Qué información no debe aparecer en logs?**
    Contraseñas, tokens, cuerpos completos de solicitudes, credenciales SMTP y datos personales
    innecesarios.
14. **¿Por qué el formulario no permite elegir el destinatario?**
    Para evitar que se use como relay de spam. El buzón institucional está fijo en configuración.

## 6. Checklist de entrega en EVA

- [ ] URL pública HTTPS funcionando (probar en incógnito).
- [ ] Repositorio GitHub público con README e integrantes.
- [ ] `.env` **no** versionado; `.env.example` sí.
- [ ] Credenciales de demostración entregadas por canal seguro.
- [ ] Informe de seguridad con tabla antes/después y evidencias adjuntas.
- [ ] Manual técnico y de despliegue.
- [ ] Pipeline CI en verde y captura del flujo de ramas/PR.
- [ ] Los tres integrantes identificados en README y en la entrega.
- [ ] Ensayo completo de los 12 escenarios de defensa.
- [ ] Verificar que los archivos quedaron visibles en EVA.
