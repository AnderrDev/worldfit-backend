# Auditoria backend WorldFit

Fecha de ejecucion: 2026-06-27

## Alcance

Proyecto auditado: `worldfit-backend`.

Se reviso estructura Hexagonal, rutas REST, autenticacion JWT, validaciones Joi, reglas de negocio, borrado logico y ejecucion real de endpoints.

---

## Hallazgos principales (auditoria v1)

| Severidad | Hallazgo | Evidencia | Estado |
| --- | --- | --- | --- |
| Critica | La base configurada en `.env` no permite iniciar el backend actual. | Al levantar con `DB_SCHEMA=worldfit`, TypeORM falla con `ALTER TABLE "worldfit"."user" ADD "role_id" integer NOT NULL`. | Pendiente de migracion |
| Critica | El registro publico permitia enviar `roleId` de admin. | `POST /users` aceptaba `roleId` admin y generaba token con rol admin. | **Corregido** |
| Critica | El registro publico sin `roleId` creaba usuario con rol `1`. | `user-validation.ts` usaba `roleId.default(1)` y el rol 1 era admin. | **Corregido** |
| Alta | `PUT /users/:id` aceptaba `roleId` para usuarios normales. | `user-update-validation.ts` permitia `roleId`. | **Corregido** |
| Media | `synchronize: true` activo en produccion. | `database.ts` linea 20. | Pendiente |
| Media | Contrato usa valores en ingles (`difficulty`, `muscleGroup`). | `beginner/intermediate/advanced`, `chest/back/...` | Documentar |
| Baja | CORS permite `origin: *`. | `app.ts`. | Pendiente (produccion) |

---

## Hallazgos nuevos (auditoria v2 - 2026-06-27)

| ID | Severidad | Modulo | Hallazgo | Evidencia |
| --- | --- | --- | --- | --- |
| H-08 | Alta | Usuarios | Nombre sin validacion `.max(255)`: strings >255 chars pasan Joi, llegan a la DB y retornan 500 en vez de 400. | QA-90: `name` de 256+ chars -> `{"message":"Error interno del servidor"}` |
| H-09 | Alta | Ejercicios | Mismo problema en `name` de ejercicios. | QA-90b: nombre 300 chars -> 500 |
| H-10 | Alta | Rutinas | Mismo problema en `name` de rutinas. | QA-90c: nombre 300 chars -> 500 |
| H-11 | Media | Admin | No hay proteccion para que un admin se elimine a si mismo. | QA-95: `DELETE /users/1` con token admin propio retorno 200. Login posterior: 401. |
| H-12 | Media | Ejercicios | El query param de busqueda es `?muscle=` pero el campo en respuesta se llama `muscleGroup`. Inconsistencia de contrato. | QA-47: `?muscleGroup=chest` -> `{"message":"Parametro muscle requerido"}`. Correcto: `?muscle=chest` |
| H-13 | Baja | Ejercicios | Busqueda con grupo muscular invalido retorna `[]` en vez de 400. El cliente no puede diferenciar "sin resultados" de "parametro invalido". | QA-48b: `?muscle=piernas` -> `[]` |
| H-14 | Baja | Categorias | La descripcion acepta etiquetas HTML crudas (`<script>`). Almacena y devuelve sin sanitizar. Risk en el frontend si no escapa el HTML. | QA-91: `description: "<script>alert(1)</script>"` almacenado textualmente. |

---

## Entorno de prueba

```
Servidor: http://127.0.0.1:4002/api/v1
Esquema DB aislado: worldfit_qa_v2 (limpio, creado para esta auditoria)
DB: PostgreSQL 16 (Docker) - localhost:5433
```

Credenciales de seed usadas en pruebas:
- Admin: `admin@worldfit.com` / `Admin123`
- Usuario demo: `demo@worldfit.com` / `Demo123`

---

## Casos de prueba ejecutados — Auditoria v2

### Autenticacion y JWT

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-01 | Ruta no existente retorna mensaje claro | PASO | 404 |
| QA-02 | Login admin correcto | PASO | 200 |
| QA-03 | Login con password incorrecta | PASO | 401 |
| QA-04 | Login con email inexistente | PASO | 401 |
| QA-05 | Ruta privada sin token retorna error | PASO | 401 |
| QA-06 | Ruta privada con token invalido | PASO | 401 |
| QA-07 | Ruta privada con token valido | PASO | 200 |
| QA-83 | Login con cuerpo vacio | PASO | 400 |
| QA-84 | Login con email malformado | PASO | 401 |
| QA-85 | Token con firma invalida rechazado | PASO | 401 |
| QA-86 | Inyeccion SQL en email de login bloqueada | PASO | 401 |

### Usuarios

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-08 | Registro sin `roleId` queda como `user` | PASO | 201 |
| QA-09 | Registro publico con `roleId=1` queda como `user` | PASO | 201 |
| QA-10 | Admin crea usuario con `roleId=1` queda como `admin` | PASO | 201 |
| QA-11 | Registro sin password retorna 400 | PASO | 400 |
| QA-12 | Password sin numero rechazada | PASO | 400 |
| QA-13 | Nombre con caracteres especiales rechazado | PASO | 400 |
| QA-14 | Email duplicado retorna error claro | PASO | 409 |
| QA-15 | Buscar usuario por email | PASO | 200 |
| QA-16 | Buscar por email malformado retorna 400 | PASO | 400 |
| QA-17 | Buscar por email inexistente retorna 404 | PASO | 404 |
| QA-18 | Usuario normal actualiza su propio perfil | PASO | 200 |
| QA-19 | Usuario normal intenta cambiar `roleId` propio | PASO | 403 |
| QA-20 | Usuario normal intenta modificar otro usuario | PASO | 403 |
| QA-21 | Admin actualiza cualquier usuario | PASO | 200 |
| QA-22 | ID no numerico retorna 400 | PASO | 400 |
| QA-87 | ID negativo retorna 400 | PASO | 400 |
| QA-88 | ID cero retorna 400 | PASO | 400 |
| QA-89 | ID flotante retorna 400 | PASO | 400 |
| QA-90 | Nombre >255 chars retorna 500 en vez de 400 | **FALLO** | 500 |
| QA-92 | Admin elimina usuario (softdelete) | PASO | 200 |
| QA-93 | Usuario eliminado no puede loguearse | PASO | 401 |
| QA-94 | Usuario eliminado no aparece en listado | PASO | 200 |
| QA-95 | Admin puede eliminarse a si mismo (sin proteccion) | **FALLO** | 200 |
| QA-96 | Usuario normal puede eliminarse a si mismo | PASO | 200 |
| QA-101 | Content-Type incorrecto no rompe el servidor | PASO | 400 |
| QA-102 | DELETE usuario inexistente retorna 404 | PASO | 404 |

### Roles

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-23 | Admin lista roles | PASO | 200 |
| QA-24 | Usuario normal lista roles | PASO | 200 |
| QA-25 | Admin crea rol | PASO | 201 |
| QA-26 | Usuario normal intenta crear rol | PASO | 403 |
| QA-27 | Admin actualiza rol | PASO | 200 |
| QA-28 | Obtener rol por ID | PASO | 200 |
| QA-29 | Rol inexistente retorna 404 | PASO | 404 |
| QA-30 | Admin elimina rol | PASO | 200 |
| QA-31 | Rol eliminado no aparece | PASO | 404 |

### Categorias

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-32 | Admin crea categoria | PASO | 201 |
| QA-33 | Nombre invalido (chars especiales) rechazado | PASO | 400 |
| QA-34 | Nombre duplicado retorna 409 | PASO | 409 |
| QA-35 | Usuario normal no puede crear categoria | PASO | 403 |
| QA-36 | Usuario normal lista categorias | PASO | 200 |
| QA-37 | Obtener categoria por ID | PASO | 200 |
| QA-38 | Admin actualiza categoria | PASO | 200 |
| QA-39 | Admin elimina categoria (softdelete) | PASO | 200 |
| QA-40 | Categoria eliminada no aparece por ID | PASO | 404 |
| QA-41 | Categoria eliminada no aparece en listado | PASO | 200 |
| QA-91 | Descripcion acepta HTML crudo sin sanitizar | **FALLO** | 201 |
| QA-103 | PUT con body vacio retorna error claro | PASO | 400 |

### Ejercicios

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-42 | Admin crea ejercicio valido | PASO | 201 |
| QA-43 | Grupo muscular invalido rechazado | PASO | 400 |
| QA-44 | Categoria inexistente rechazada | PASO | 404 |
| QA-45 | Usuario normal no puede crear ejercicio | PASO | 403 |
| QA-46 | Usuario normal lista ejercicios | PASO | 200 |
| QA-47 | Busqueda con `?muscleGroup=` falla (param correcto es `?muscle=`) | **FALLO** | 400 |
| QA-47b | Busqueda correcta con `?muscle=back` | PASO | 200 |
| QA-48b | Busqueda con grupo invalido `?muscle=piernas` retorna `[]` (sin 400) | **FALLO** | 200 |
| QA-49 | Obtener ejercicio por ID | PASO | 200 |
| QA-50 | Admin actualiza ejercicio | PASO | 200 |
| QA-51 | Admin elimina ejercicio (softdelete) | PASO | 200 |
| QA-52 | Ejercicio eliminado no aparece por ID | PASO | 404 |
| QA-90b | Nombre ejercicio >255 chars retorna 500 en vez de 400 | **FALLO** | 500 |
| QA-106 | `sets=0` rechazado por validacion | PASO | 400 |

### Rutinas

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-53 | Admin crea rutina con ejercicios | PASO | 201 |
| QA-54 | Dificultad invalida rechazada | PASO | 400 |
| QA-55 | Usuario asignado inexistente rechazado | PASO | 404 |
| QA-56 | Ejercicio inexistente en rutina rechazado | PASO | 404 |
| QA-57 | Usuario normal no puede crear rutina | PASO | 403 |
| QA-58 | Usuario normal lista rutinas | PASO | 200 |
| QA-59 | Obtener rutina por ID con ejercicios | PASO | 200 |
| QA-60 | Usuario no asignado no puede aceptar rutina | PASO | 403 |
| QA-61 | Usuario asignado acepta su rutina | PASO | 200 |
| QA-62 | Estado cambia a `accepted` | PASO | 200 |
| QA-63 | No se puede aceptar rutina ya aceptada | PASO | 400 |
| QA-64 | No se puede rechazar rutina ya aceptada | PASO | 400 |
| QA-65 | Usuario asignado rechaza rutina en pending | PASO | 200 |
| QA-66 | Estado cambia a `rejected` | PASO | 200 |
| QA-67 | No se puede aceptar rutina ya rechazada | PASO | 400 |
| QA-68 | Admin actualiza rutina | PASO | 200 |
| QA-69 | Usuario normal no puede actualizar rutina | PASO | 403 |
| QA-70 | Admin elimina rutina (softdelete) | PASO | 200 |
| QA-71 | Rutina eliminada no aparece por ID | PASO | 404 |
| QA-90c | Nombre rutina >255 chars retorna 500 en vez de 400 | **FALLO** | 500 |
| QA-99 | Admin no puede aceptar/rechazar rutina (no es asignado) | PASO | 403 |
| QA-100 | Rutina con ejercicio eliminado rechazada | PASO | 404 |
| QA-105 | `durationMinutes=0` rechazado por validacion | PASO | 400 |

### Objetivos (Goals)

| ID | Caso | Resultado | HTTP |
| --- | --- | --- | --- |
| QA-72 | Admin crea objetivo para usuario | PASO | 201 |
| QA-73 | Nombre invalido rechazado | PASO | 400 |
| QA-74 | Usuario inexistente rechazado | PASO | 404 |
| QA-75 | Usuario normal no puede crear objetivo | PASO | 403 |
| QA-76 | Usuario normal lista objetivos | PASO | 200 |
| QA-77 | Obtener objetivo por ID | PASO | 200 |
| QA-78 | Objetivo inexistente retorna 404 | PASO | 404 |
| QA-79 | Admin actualiza objetivo | PASO | 200 |
| QA-80 | Admin elimina objetivo (softdelete) | PASO | 200 |
| QA-81 | Objetivo eliminado no aparece por ID | PASO | 404 |
| QA-82 | Objetivo eliminado no aparece en listado | PASO | 200 |
| QA-104 | Objetivo duplicado para mismo usuario rechazado | PASO | 409 |

---

## Resumen de resultados

| Modulo | Total | Pasaron | Fallaron |
| --- | --- | --- | --- |
| Autenticacion / JWT | 11 | 11 | 0 |
| Usuarios | 24 | 22 | 2 |
| Roles | 9 | 9 | 0 |
| Categorias | 12 | 11 | 1 |
| Ejercicios | 14 | 11 | 3 |
| Rutinas | 21 | 20 | 1 |
| Objetivos | 12 | 12 | 0 |
| **TOTAL** | **103** | **96** | **7** |

---

## Recomendaciones (priorizadas)

### Alta prioridad

1. **Agregar `.max(255)` en los campos `name` de usuarios, ejercicios y rutinas** en sus respectivos archivos de validacion Joi. Actualmente un string >255 chars pasa la validacion y genera un 500 desde la base de datos.

   Archivos a modificar:
   - `src/infrastructure/util/user-validation.ts` — campo `name`
   - `src/infrastructure/util/exercise-validation.ts` — campo `name`
   - `src/infrastructure/util/routine-validation.ts` — campo `name`

2. **Proteger al admin de eliminarse a si mismo.** En `user.controller.ts > deleteUser`, verificar si `requester.id === id && requester.role === 'admin'` y rechazarlo con 403. Opcional: verificar que quede al menos un admin activo antes de proceder.

### Media prioridad

3. **Homogeneizar el nombre del query param en busqueda de ejercicios.** El endpoint `GET /exercises/search` espera `?muscle=` pero el campo en la respuesta y en la validacion se llama `muscleGroup`. Cambiar a `?muscleGroup=` para mantener consistencia.

4. **Validar `muscleGroup` al buscar y retornar 400 si el valor no es valido.** Actualmente `?muscle=piernas` retorna `[]` sin indicar que el parametro es incorrecto.

5. **Reparar la base `worldfit` con una migracion** que cree roles y rellene `user.role_id` antes de marcar la columna como `NOT NULL`. Reemplazar `synchronize: true` por migraciones controladas.

### Baja prioridad

6. **Sanitizar o rechazar HTML en campos de descripcion.** La descripcion de categorias (y por extension otros modulos) almacena etiquetas HTML crudas. El riesgo es bajo en un API REST puro, pero el frontend debe escapar el contenido antes de renderizarlo.

7. **Restringir CORS** a los dominios especificos del frontend antes del despliegue a produccion.
