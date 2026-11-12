# Índice de capturas

Capturas tomadas directamente contra la plataforma desplegada
(`https://proyecto-cesar.onrender.com`) durante la verificación manual de la tabla 5 del
informe de seguridad. Cada imagen muestra la solicitud enviada y la respuesta real del servidor.

| Archivo | Riesgo verificado | Resultado observado |
| --- | --- | --- |
| `01-token-ausente.png` | Autenticación débil | `401` con `TOKEN_MISSING` |
| `02-token-invalido.png` | Autenticación débil | `401` con `TOKEN_INVALID` |
| `03-403-cliente.png` | Control de acceso deficiente | `403` con `FORBIDDEN` al pedir `/api/users` con rol client |
| `04-nosql-injection.png` | Inyección NoSQL | `400` con `VALIDATION_ERROR` |
| `05-rate-limit.png` | Formulario insuficiente | `429` con `RATE_LIMITED` al superar el límite del formulario |
| `06-prompt-injection.png` | Prompt injection | El asistente se niega a revelar su configuración interna |
| `07-mensaje-largo.png` | Abuso del chatbot | `400` con `VALIDATION_ERROR` por mensaje de 600 caracteres |
| `08-cabeceras-http.png` | Configuración insegura | CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options` presentes |
| `09-exposicion-datos.png` | Exposición de datos | `/api/auth/me` devuelve el usuario sin `passwordHash` ni tokens |
| `10-enumeracion-usuarios.png` | Enumeración de usuarios | Misma respuesta `401 INVALID_CREDENTIALS` para correo existente e inexistente |
| `11-npm-audit.png` | Dependencias vulnerables | `npm audit` del backend y frontend: 0 vulnerabilidades |

Los archivos `.txt` de `docs/evidencias/` contienen la salida completa de cada
prueba para quien prefiera revisar el texto sin abrir la imagen.
