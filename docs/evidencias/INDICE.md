# Índice de evidencias

## Base de datos
- [x] `db-evidencia.md` — conteos e índices generados desde MongoDB local.
- [x] `backup-local/` — respaldo JSON por colección.
- [ ] Captura de Atlas: cluster, database user `reservas_app` y rol `readWrite` sobre `reservas`.
- [ ] Captura de Network Access (`0.0.0.0/0`) y justificación del riesgo R-02.
- [ ] Captura de `getIndexes()` por colección en Atlas.
- [ ] Evidencia de respaldo/restauración con fecha y responsable.

## Seguridad
- [ ] Reporte OWASP ZAP Baseline (`zap-baseline-report.html`).
- [ ] Resultado de CodeQL (captura o enlace al run de GitHub Actions).
- [ ] `npm audit` de backend y frontend.
- [ ] Pruebas 401/403 (`pruebas-autorizacion.md`).
- [ ] Evidencia de correos enviados (SMTP) sin exponer credenciales.

## Despliegue
- [ ] URL pública verificada.
- [ ] Health check `/api/health`.
- [ ] Credenciales de demo entregadas por canal seguro.
- [ ] Deploy hook documentado y probado.
