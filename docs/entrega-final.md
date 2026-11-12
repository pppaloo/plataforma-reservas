# Checklist de entrega final

## Proyecto
- Nombre: ReservaPro
- Repositorio: https://github.com/pppaloo/proyecto-cesar
- URL pública: https://proyecto-cesar.onrender.com

## Estado general
- [x] Aplicación desplegada en Render
- [x] Health check verificado: `/api/health`
- [x] Chatbot en modo `llm`
- [x] Base de datos MongoDB Atlas conectada
- [x] Seed ejecutado
- [x] Panel admin funcional
- [x] Edición completa en panel admin
- [x] CI/CD configurado
- [x] Informe de seguridad en Markdown y Word

## Seguridad
- [x] SCA: 0 vulnerabilidades
- [x] CodeQL: 0 alertas
- [x] OWASP ZAP ejecutado: 0 High, 2 Medium, 1 Low, 9 Informational
- [x] Pruebas manuales: 401, 403, NoSQL injection, rate limit, prompt injection
- [x] XSS guardado como texto (evidencia API + captura)
- [x] Cabeceras HTTP documentadas
- [ ] Capturas visuales de CodeQL en `docs/evidencias/`
- [ ] Reporte ZAP guardado en `docs/evidencias/zap-inicial.html` y `.json`

## Evidencias
- [x] `docs/evidencias/db-evidencia.md`
- [x] `docs/evidencias/backup-local/`
- [x] `docs/evidencias/prueba-401.txt`
- [x] `docs/evidencias/prueba-403.txt`
- [x] `docs/evidencias/prueba-nosql.txt`
- [x] `docs/evidencias/prueba-prompt-injection.txt`
- [x] `docs/evidencias/prueba-rate-limit.txt`
- [x] `docs/evidencias/prueba-xss.txt`
- [x] `docs/evidencias/prueba-xss-panel.txt`
- [x] `docs/evidencias/xss-panel.png`
- [x] `docs/evidencias/cabeceras-http.txt`
- [x] `docs/evidencias/pruebas-manuales-resumen.md`
- [ ] `docs/evidencias/zap-inicial.html`
- [ ] `docs/evidencias/zap-inicial.json`
- [ ] `docs/evidencias/codeql-alertas.png`
- [ ] `docs/evidencias/codeql-final.png`

## Entrega en EVA
- [x] URL pública
- [x] Enlace al repositorio
- [x] Informe de seguridad con evidencias
- [x] Manual técnico
- [ ] Credenciales de demostración por canal seguro
- [x] Identificación de los 3 integrantes

## Integrantes
1. Paloma Andrea Chávez Proboste
2. Javiera Belén Zambrano Chávez
3. Benjamín Esteban Grez Rivas
