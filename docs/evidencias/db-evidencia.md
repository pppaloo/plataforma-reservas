# Evidencia de base de datos

- Fecha: 2026-11-10T23:33:12.485Z
- Base: reservas
- URI: mongodb://***:***@ac-7j1i188-shard-00-00.kqljsww.mongodb.net:27017,ac-7j1i188-shard-00-01.kqljsww.mongodb.net:27017,ac-7j1i188-shard-00-02.kqljsww.mongodb.net:27017/reservas?ssl=true&replicaSet=atlas-f3dyxv-shard-0&authSource=admin&retryWrites=true&w=majority

## contactrequests

- Documentos: 0
- Respaldo: docs/evidencias/backup-local/contactrequests.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"status":1}` — status_1
  - `{"createdAt":-1}` — createdAt_-1

## conversations

- Documentos: 0
- Respaldo: docs/evidencias/backup-local/conversations.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"sessionId":1}` (único) — sessionId_1
  - `{"lastActivityAt":1}` — lastActivityAt_1

## faqs

- Documentos: 6
- Respaldo: docs/evidencias/backup-local/faqs.json
- Índices:
  - `{"_id":1}` — _id_
  - `{"active":1,"category":1,"order":1}` — active_1_category_1_order_1

Ejemplo de documento:
```json
{
  "_id": "6af3a99af8677e2e4fdaf57e",
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
  "createdAt": "2026-11-10T23:32:42.136Z",
  "updatedAt": "2026-11-10T23:32:42.136Z"
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
  "_id": "6af3a999f8677e2e4fdaf573",
  "name": "Masaje descontracturante",
  "description": "Sesion de 60 minutos orientada a liberar tension muscular y mejorar la circulacion.",
  "durationMin": 60,
  "price": 35000,
  "capacity": 2,
  "active": true,
  "order": 1,
  "__v": 0,
  "createdAt": "2026-11-10T23:32:41.835Z",
  "updatedAt": "2026-11-10T23:32:41.835Z"
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
  "_id": "6af3a999f8677e2e4fdaf579",
  "network": "Instagram",
  "url": "https://instagram.com/reservapro",
  "active": true,
  "order": 1,
  "__v": 0,
  "createdAt": "2026-11-10T23:32:41.980Z",
  "updatedAt": "2026-11-10T23:32:41.980Z"
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
  "_id": "6af3a999f8677e2e4fdaf570",
  "name": "Administrador",
  "email": "admin@reservapro.cl",
  "passwordHash": "$2a$12$F.wkRYJ22YNCueVt3zx9E.Ok0Xwiue0lzbZiuWpvjAOoiRRasbHRK",
  "role": "admin",
  "active": true,
  "createdAt": "2026-11-10T23:32:41.653Z",
  "updatedAt": "2026-11-10T23:32:41.653Z",
  "__v": 0
}
```
