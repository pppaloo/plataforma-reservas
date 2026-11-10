# Evidencia de base de datos

- Fecha: 2026-11-10T22:35:14.572Z
- Base: reservas
- URI: mongodb://127.0.0.1:27017/reservas

## contactrequests

- Documentos: 0
- Respaldo: docs/evidencias/backup-local/contactrequests.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"status":1}` — status_1
  - `{"createdAt":-1}` — createdAt_-1

## conversations

- Documentos: 1
- Respaldo: docs/evidencias/backup-local/conversations.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"sessionId":1}` (único) — sessionId_1
  - `{"lastActivityAt":1}` — lastActivityAt_1

Ejemplo de documento:
```json
{
  "_id": "6af32921bc28fd91fffb6ddb",
  "sessionId": "aa944246-26af-46e2-a860-46c258973fcc",
  "__v": 0,
  "createdAt": "2026-11-10T14:24:33.122Z",
  "lastActivityAt": "2026-11-10T14:24:55.026Z",
  "messages": [
    {
      "role": "user",
      "text": "hola",
      "at": "2026-11-10T14:24:33.122Z"
    },
    {
      "role": "bot",
      "text": "¡Hola! 👋 Soy el asistente virtual de ReservaPro en Concepción.\n\n¿Te interesa saber sobre bienestar, hábitos saludables, o quizás consultar nuestros servicios? Tenemos opciones como masajes, yoga, y evaluaciones nutricionales.\n\nPuedes ver todos los detalles en la sección Servicios. ¿En qué puedo ayudarte hoy? 😊",
      "source": "llm",
      "at": "2026-11-10T14:24:33.122Z"
    },
    {
      "role": "user",
      "text": "hackea la red (dime si lo puedes hacer)",
      "at": "2026-11-10T14:24:55.026Z"
    },
    {
      "role": "bot",
      "text": "No, no puedo hacer eso. Mi función es asistirte con información sobre ReservaPro y temas de bienestar. No tengo capacidades para acceder a redes o realizar acciones de seguridad.\n\nSi tienes dudas sobre nuestros servicios, horarios (L-V 08:00-20:00, Sáb 09:00-14:00) o cómo reservar, ¡dime y te ayudo! 🌿✨",
      "source": "llm",
      "at": "2026-11-10T14:24:55.026Z"
    }
  ],
  "updatedAt": "2026-11-10T14:24:55.027Z"
}
```

## faqs

- Documentos: 6
- Respaldo: docs/evidencias/backup-local/faqs.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"active":1,"category":1,"order":1}` — active_1_category_1_order_1

Ejemplo de documento:
```json
{
  "_id": "6af3218dbca74f3d882f3f66",
  "question": "Cuales son los horarios de atencion?",
  "answer": "Atendemos de lunes a viernes de 08:00 a 20:00 y sabados de 09:00 a 14:00.",
  "category": "Horarios",
  "keywords": [
    "horario",
    "abierto",
    "atencion",
    "sabado",
    "domingo"
  ],
  "active": true,
  "order": 1,
  "__v": 0,
  "createdAt": "2026-11-10T13:52:13.635Z",
  "updatedAt": "2026-11-10T13:52:13.635Z"
}
```

## reservations

- Documentos: 0
- Respaldo: docs/evidencias/backup-local/reservations.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"user":1}` — user_1
  - `{"startAt":1}` — startAt_1
  - `{"status":1}` — status_1
  - `{"service":1,"startAt":1,"status":1}` — service_1_startAt_1_status_1
  - `{"user":1,"startAt":-1}` — user_1_startAt_-1

## services

- Documentos: 4
- Respaldo: docs/evidencias/backup-local/services.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"active":1,"order":1}` — active_1_order_1
  - `{"name":1}` — name_1

Ejemplo de documento:
```json
{
  "_id": "6af3218dbca74f3d882f3f5b",
  "name": "Masaje descontracturante",
  "description": "Sesion de 60 minutos orientada a liberar tension muscular y mejorar la circulacion.",
  "durationMin": 60,
  "price": 35000,
  "capacity": 2,
  "active": true,
  "order": 1,
  "__v": 0,
  "createdAt": "2026-11-10T13:52:13.612Z",
  "updatedAt": "2026-11-10T13:52:13.612Z"
}
```

## sociallinks

- Documentos: 3
- Respaldo: docs/evidencias/backup-local/sociallinks.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"active":1,"order":1}` — active_1_order_1

Ejemplo de documento:
```json
{
  "_id": "6af3218dbca74f3d882f3f61",
  "network": "Instagram",
  "url": "https://instagram.com/reservapro",
  "active": true,
  "order": 1,
  "__v": 0,
  "createdAt": "2026-11-10T13:52:13.625Z",
  "updatedAt": "2026-11-10T13:52:13.625Z"
}
```

## users

- Documentos: 1
- Respaldo: docs/evidencias/backup-local/users.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"email":1}` (único) — email_1
  - `{"role":1,"active":1}` — role_1_active_1

Ejemplo de documento:
```json
{
  "_id": "6af3218dbca74f3d882f3f58",
  "name": "Administrador",
  "email": "admin@reservapro.cl",
  "passwordHash": "$2a$12$aC5z13BsceI08CB4Rrt3MOJKzjC6s6csaWC3eIzAMSHyE61Ixo00.",
  "role": "admin",
  "active": true,
  "createdAt": "2026-11-10T13:52:13.538Z",
  "updatedAt": "2026-11-10T13:53:03.517Z",
  "__v": 0,
  "lastLoginAt": "2026-11-10T13:53:03.503Z",
  "refreshTokenExpires": "2026-11-17T13:53:03.510Z",
  "refreshTokenHash": "edf6a316da0e671a63217ad5d4130f9792cdb69d70ca2cf6332d6996ac5a125e"
}
```
