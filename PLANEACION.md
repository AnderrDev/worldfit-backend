# Planeación WorldFit — Cierre del proyecto

Documento de planeación para completar WorldFit según el Acta de Constitución,
alineado con la arquitectura hexagonal (puertos y adaptadores) que evalúa la
profesora: estructura **plana** `domain / application / infrastructure`, con
Node.js + Express + TypeScript + TypeORM + PostgreSQL, JWT, bcrypt y Joi.

> Nota de contexto: la primera entrega se calificó mal por NO seguir la
> arquitectura de la profesora (se usó MongoDB y una estructura modular). El
> backend ya fue reconstruido con la estructura plana correcta; este documento
> planifica lo que falta para cumplir el 100% del Acta.

---

## 1. Análisis de brechas (Acta vs. backend actual)

| Requisito del Acta | Referencia | Estado | Acción |
|---|---|---|---|
| Registro / Login JWT | HU-01, HU-02, PB01-02 | ✅ Hecho | — |
| CRUD Usuarios | PB03 | ✅ Hecho | — |
| CRUD Ejercicios | HU-07, PB04 | ✅ Hecho | — |
| CRUD Rutinas | HU-06, PB05 | ✅ Hecho | — |
| Validaciones Joi | PB08 | ✅ Hecho | — |
| Rutas privadas protegidas (JWT) | HU-08, PB09 | ✅ Hecho | — |
| Rol administrador vs usuario | HU-06, HU-07 | ❌ Falta | Añadir `role` a User + guard de admin |
| Ejercicio con descripción | HU-05 | ⚠️ Falta campo | Añadir `description` |
| Rutina con duración aproximada | HU-03 | ⚠️ Falta campo | Añadir `duration` (minutos) |
| Series/repeticiones por ejercicio | HU-04 | ✅ Global en el ejercicio | Se mantiene global (decisión tomada) |
| Seguimiento de progreso | Objetivo general, PB06/07/10 | ❌ Falta | Nueva entidad `Progress` |
| Frontend Angular | Objetivo, HU-03/04/05/09/10 | ❌ No iniciado | Proyecto Angular completo |
| Cerrar sesión | HU-10 | ❌ Falta (front) | Logout en Angular |
| Diagrama de arquitectura del Acta | Sección final del Acta | ⚠️ Muestra estructura modular | Actualizar a estructura plana |

> **Importante:** el diagrama "Arquitectura hexagonal real de WorldFit" del Acta
> muestra la estructura **modular** que la profesora rechazó. Debe actualizarse en
> el documento a la estructura plana ya implementada (ver sección 4).

---

## 2. Plan por fases (alineado con los Sprints del Acta)

### FASE A — Completar el backend al 100% del Acta (Sprint 2-3)
Prioridad alta. Es lo que la profesora evalúa más de cerca y deja la API lista
para el frontend.

1. **Roles**: añadir campo `role` (`user` | `admin`) a la entidad User; incluirlo
   en el payload del JWT.
2. **Guard de admin**: middleware `requireAdmin` que protege crear / editar /
   eliminar rutinas y ejercicios (HU-06, HU-07). Los usuarios normales solo
   consultan (GET).
3. **Ejercicio**: añadir campo `description` (HU-05). Series y repeticiones se
   mantienen como propiedad global del ejercicio (decisión tomada).
4. **Rutina**: añadir campo `duration` en minutos (HU-03).
5. **Entidad `Progress`** (seguimiento básico): registra qué rutina realizó el
   usuario, fecha y notas/observación. Sigue el mismo molde canónico
   (dominio → puerto → application → entidad TypeORM → adaptador → Joi →
   controlador → rutas).
6. Actualizar esquemas Joi y la colección Postman.

### FASE B — Frontend Angular (Sprint 4)
El bloque más grande pendiente.

7. Scaffold del proyecto Angular + servicio HTTP que consume la API REST.
8. Autenticación: pantallas de registro y login, almacenamiento del token,
   **logout** (HU-10) y guard de rutas privadas (HU-08).
9. Vistas de usuario: lista de rutinas (HU-03), detalle con ejercicios (HU-04),
   información de ejercicio (HU-05) e interfaz sencilla con menú claro (HU-09).
10. Vistas de administrador: CRUD de rutinas y ejercicios (HU-06, HU-07),
    visibles solo cuando `role = admin`.

### FASE C — Pruebas, documentación y entrega
11. Probar todo contra PostgreSQL (Docker) con Postman.
12. Actualizar el Acta (diagrama de arquitectura) y el README.
13. Evidencias para la entrega: estructura de carpetas, capturas de la base de
    datos y endpoints funcionando.

---

## 3. Mapeo Historias de Usuario → Estado

| HU | Descripción | Capa | Estado |
|---|---|---|---|
| HU-01 | Registro de usuario | Backend | ✅ |
| HU-02 | Inicio de sesión | Backend | ✅ |
| HU-03 | Visualización de rutinas (con duración) | Backend + Front | ⚠️ falta `duration` y front |
| HU-04 | Ejercicios de una rutina (series/reps) | Backend + Front | ⚠️ falta front |
| HU-05 | Info de ejercicio (descripción, músculo) | Backend + Front | ⚠️ falta `description` y front |
| HU-06 | Gestión de rutinas (admin) | Backend + Front | ⚠️ falta rol admin y front |
| HU-07 | Gestión de ejercicios (admin) | Backend + Front | ⚠️ falta rol admin y front |
| HU-08 | Protección de rutas privadas | Backend + Front | ✅ backend / ⚠️ front |
| HU-09 | Interfaz sencilla e intuitiva | Front | ❌ |
| HU-10 | Cierre de sesión | Front | ❌ |

---

## 4. Estructura objetivo del backend (la que evalúa la profesora)

```
src/
├── index.ts                     # función autoinvocada: connectDB() + ServerBootstrap.init()
├── domain/                      # núcleo: entidades (interfaces) + puertos
│   ├── entities/                # user, exercise, routine, progress
│   ├── user.port.ts
│   ├── exercise.port.ts
│   ├── routine.port.ts
│   └── progress.port.ts
├── application/                 # servicios + lógica de negocio + auth (JWT)
└── infrastructure/              # config, bootstrap, entities (TypeORM), adapter,
                                 # util (Joi), controller, routes, web
```

Esta es la estructura **plana** que debe reemplazar al diagrama modular del Acta.

---

## 5. Próximos pasos inmediatos

1. Ejecutar la Fase A (backend) — ~1 a 2 días.
2. Probar la API contra PostgreSQL con Postman.
3. Iniciar la Fase B (Angular).

> Decisiones ya tomadas:
> - Series y repeticiones: **globales** en el ejercicio (no por rutina).
> - Base de datos: PostgreSQL (local vía Docker para desarrollo).
> - Identidad de commits: Anderson Pulido.
