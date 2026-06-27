# Auditoria backend WorldFit

Fecha de ejecucion: 2026-06-27

## Alcance

Proyecto auditado: `worldfit-backend`.

Se reviso estructura Hexagonal, rutas REST, autenticacion JWT, validaciones Joi, reglas de negocio, borrado logico y ejecucion real de endpoints.

## Hallazgos principales

| Severidad | Hallazgo | Evidencia | Riesgo |
| --- | --- | --- | --- |
| Critica | La base configurada en `.env` no permite iniciar el backend actual. | Al levantar con `DB_SCHEMA=worldfit`, TypeORM falla con `ALTER TABLE "worldfit"."user" ADD "role_id" integer NOT NULL`: existen filas sin valor para esa columna. | El backend auditado no arranca sobre la base principal. Se necesita migracion controlada o limpieza de datos. |
| Critica | El registro publico permitia enviar `roleId` de admin. | Antes del ajuste, `POST /users` aceptaba `roleId` admin y generaba token con rol admin. | Escalada de privilegios sin autenticacion. Corregido en el codigo actual. |
| Critica | El registro publico sin `roleId` creaba usuario con rol `1`. | Antes del ajuste, `user-validation.ts` usaba `roleId.default(1)`. En el seed, el rol `1` era admin. | Un registro normal podia quedar como administrador por defecto. Corregido en el codigo actual. |
| Alta | `PUT /users/:id` aceptaba `roleId` cuando el usuario editaba su propio perfil. | Antes del ajuste, `user-update-validation.ts` permitia `roleId`; el controlador no lo bloqueaba para usuarios normales. | Intento de cambio de rol no debe estar disponible para usuarios normales. Corregido en el codigo actual. |
| Media | `synchronize: true` esta activo. | `database.ts` linea 20. | En bases con datos reales puede romper arranque o modificar esquema sin migraciones. |
| Media | El contrato del backend usa valores en ingles para `difficulty` y `muscleGroup`. | `beginner/intermediate/advanced`, `chest/back/legs/...`. | El frontend/documentacion en espanol debe mapear valores para evitar 400. |
| Baja | CORS permite `origin: *`. | `app.ts`. | Correcto para desarrollo, pero debe restringirse para presentacion/despliegue. |

## Cobertura revisada

- CRUD completos: usuarios, roles, categorias, ejercicios, rutinas, objetivos.
- Autenticacion JWT: login, rutas privadas, token invalido/ausente.
- Autorizacion: escritura de categorias, ejercicios, rutinas, roles y objetivos restringida a admin.
- Borrado logico: usuarios, categorias, ejercicios, rutinas y objetivos usan `softDelete` o `DeleteDateColumn`.
- Reglas de negocio: limite de rutinas activas por usuario, usuario asignado debe existir, ejercicios deben existir, flujo aceptar/rechazar rutina.
- Validaciones: Joi en entradas principales, regex en nombre de usuario/categoria/objetivo y password.

## Entorno de prueba

El puerto `4000` estaba ocupado por `worldfit-backend-v2`, por eso se levanto `worldfit-backend` en:

```text
http://127.0.0.1:4001/api/v1
```

La base principal fallo al iniciar por incompatibilidad de esquema. Para ejecutar endpoints sin modificar datos existentes se creo el esquema aislado:

```text
worldfit_qa_auditoria
```

## Casos de prueba manuales ejecutados

| ID | Caso | Resultado |
| --- | --- | --- |
| QA-01 | Health publico `GET /health` | Paso |
| QA-02 | Login admin correcto | Paso |
| QA-03 | Login admin con password incorrecta | Paso |
| QA-04 | Acceso a ruta privada sin token | Paso |
| QA-05 | Listar roles con token admin | Paso |
| QA-06 | Registro publico de usuario normal con `roleId` user | Paso |
| QA-07 | Login de usuario normal creado | Paso |
| QA-08 | Usuario normal no puede crear categoria | Paso |
| QA-09 | Usuario normal intenta cambiar su `roleId` a admin | Paso despues de correccion: respondio 403 |
| QA-10 | Usuario normal no queda como admin tras intento anterior | Paso |
| QA-11 | Registro publico no debe permitir `roleId` admin | Paso despues de correccion: respondio 201 pero con rol `user` |
| QA-12 | Usuario creado con `roleId` admin no debe obtener token admin | Paso despues de correccion: obtuvo token con rol `user` |
| QA-13 | Registro publico sin `roleId` debe quedar como usuario normal | Paso |
| QA-14 | Token de registro sin `roleId` no debe ser admin | Paso |
| QA-15 | Admin crea categoria | Paso |
| QA-16 | Regex rechaza nombre invalido de categoria | Paso |
| QA-17 | Categoria duplicada retorna 409 | Paso |
| QA-18 | Admin actualiza categoria | Paso |
| QA-19 | Admin crea ejercicio | Paso |
| QA-20 | Grupo muscular invalido retorna 400 | Paso |
| QA-21 | Usuario normal lista ejercicios | Paso |
| QA-22 | Buscar ejercicios por musculo | Paso |
| QA-23 | Admin crea rutina con ejercicio asociado | Paso |
| QA-24 | Usuario normal consulta rutinas | Paso |
| QA-25 | Usuario asignado acepta rutina | Paso |
| QA-26 | No permite decidir rutina ya aceptada/rechazada | Paso |
| QA-27 | Usuario normal no puede actualizar rutina | Paso |
| QA-28 | Admin elimina rutina logicamente | Paso |
| QA-29 | Rutina eliminada no se consulta por id | Paso |
| QA-30 | Admin elimina ejercicio logicamente | Paso |
| QA-31 | Ejercicio eliminado no se consulta por id | Paso |
| QA-32 | Admin elimina categoria logicamente | Paso |
| QA-33 | Categoria eliminada no se consulta por id | Paso |

Resumen final inicial: 29 casos pasaron, 4 fallaron.

## Verificacion posterior a correccion

Se corrigieron los tres hallazgos de roles y se ejecuto una verificacion focalizada:

| Caso | Resultado |
| --- | --- |
| Alta publica con `roleId` admin | Paso: el usuario quedo con rol `user` |
| Alta publica con `roleId` admin y login posterior | Paso: el token devolvio rol `user` |
| Alta con token admin y `roleId` admin | Paso: el usuario quedo con rol `admin` |
| Actualizacion de `roleId` por usuario normal | Paso: respondio `403` |

## Recomendaciones

1. Cambiar el registro publico para ignorar cualquier `roleId` enviado por el cliente y asignar siempre el rol `user`.
2. Cambiar el valor por defecto de `roleId` de `1` al id real del rol `user`, o resolverlo por nombre desde base de datos.
3. Quitar `roleId` de la validacion de actualizacion para usuarios normales; solo admin deberia poder cambiar roles.
4. Reemplazar `synchronize: true` por migraciones controladas para evitar errores al modificar tablas con datos.
5. Reparar la base `worldfit` con una migracion que cree roles y rellene `user.role_id` antes de marcar la columna como `NOT NULL`.
6. Alinear frontend/documentacion con los enums reales del backend o traducirlos en el frontend.
