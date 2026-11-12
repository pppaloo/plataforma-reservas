# Pruebas manuales ejecutadas contra producción

URL evaluada: https://proyecto-cesar.onrender.com
Fecha: 12/11/2026

## Resultados

| Prueba | Endpoint | Resultado esperado | Resultado obtenido | Evidencia |
|---|---|---|---|---|
| 401 sin token | `GET /api/auth/me` | 401 `TOKEN_MISSING` | 401 `TOKEN_MISSING` | `prueba-401.txt` |
| NoSQL injection | `POST /api/auth/login` | 400 validación | 400 `VALIDATION_ERROR` | `prueba-nosql.txt` |
| 403 con token de cliente | `GET /api/users` | 403 `FORBIDDEN` | 403 `FORBIDDEN` | `prueba-403.txt` |
| Prompt injection | `POST /api/chatbot/message` | Mantiene rol, no revela reglas | Respuesta controlada, `source: llm` | `prueba-prompt-injection.txt` |
| Rate limit | `POST /api/contact` | 429 en la 6ta solicitud | 5 respuestas 201 y 6ta con 429 | `prueba-rate-limit.txt` |

## Conclusión
Las pruebas manuales mínimas del certamen se ejecutaron contra la URL pública y los resultados coinciden con lo esperado. Las capturas de XSS y cabeceras HTTP deben adjuntarse por separado si se requiere evidencia visual.
