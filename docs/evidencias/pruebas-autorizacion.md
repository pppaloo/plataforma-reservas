# Pruebas de autorización (401 / 403)

## Casos ejecutados

| # | Endpoint | Rol usado | Resultado esperado | Resultado obtenido | Evidencia |
|---|----------|-----------|--------------------|--------------------|-----------|
| 1 | `GET /api/auth/me` sin token | anónimo | 401 |  | captura |
| 2 | `GET /api/users` con token de cliente | client | 403 |  | captura |
| 3 | `GET /api/reservations` con token de cliente | client | 403 |  | captura |
| 4 | `PATCH /api/users/:id` con token de cliente | client | 403 |  | captura |
| 5 | `GET /api/users` con token de admin | admin | 200 |  | captura |

## Comandos de ejemplo

```bash
# 401: sin Authorization
curl -i https://<APP>/api/auth/me

# 403: token de cliente en endpoint admin
curl -i -H "Authorization: Bearer <TOKEN_CLIENTE>" https://<APP>/api/users
```

## Conclusión
Completar con los resultados reales del entorno desplegado.
