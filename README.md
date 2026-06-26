# WorldFit – Backend

API REST del proyecto **WorldFit** construida con **arquitectura hexagonal
(puertos y adaptadores)** siguiendo el patrón enseñado en el curso.

## Stack

| Categoría | Herramienta |
|---|---|
| Runtime / framework | Node.js (LTS), Express |
| Lenguaje | TypeScript (se ejecuta con `tsx`) |
| ORM / BD | TypeORM + PostgreSQL (driver `pg`) |
| Seguridad | `jsonwebtoken` (JWT), `bcryptjs` (hash de contraseñas) |
| Validación / config | `joi`, `dotenv` |
| Peticiones | `cors` |
| Desarrollo | `nodemon`, `tsx` |

## Arquitectura (estructura de carpetas)

```
src/
├── index.ts                          # función autoinvocada: connectDB() + ServerBootstrap.init()
│
├── domain/                           # NÚCLEO — no depende de ninguna otra capa
│   ├── entities/                     # modelos de dominio (interfaces): user, exercise, routine
│   ├── user.port.ts                  # puertos (contratos: solo firmas)
│   ├── exercise.port.ts
│   └── routine.port.ts
│
├── application/                      # lógica de negocio — depende de domain
│   ├── auth.application.ts           # JWT: generateToken / verifyToken
│   ├── user.application.ts           # recibe el puerto por constructor
│   ├── exercise.application.ts
│   └── routine.application.ts
│
└── infrastructure/                   # detalles técnicos — depende de domain
    ├── config/                       # environment-vars (Joi) + database (DataSource TypeORM)
    ├── bootstrap/                    # ServerBootstrap (http.createServer + listen)
    ├── entities/                     # entidades TypeORM (@Entity, @Column)
    ├── adapter/                      # adaptadores que implementan los puertos (toDomain/toEntity)
    ├── util/                         # esquemas Joi por caso de uso
    ├── controller/                   # controladores HTTP
    ├── routes/                       # routers de Express + inyección de dependencias
    └── web/                          # App (middlewares + rutas, prefijo /api) + auth.middleware
```

**Regla de oro:** las dependencias apuntan siempre **hacia el dominio**. El dominio
no sabe nada de Express ni de TypeORM.

### Convenciones aplicadas

- Tres capas: `domain`, `application`, `infrastructure` (con `config/` y `bootstrap/` dentro de infraestructura).
- Cada entidad tiene: interface de dominio, puerto, servicio (application), entidad TypeORM, adaptador, validación Joi, controlador y rutas.
- El servicio recibe el **puerto** por constructor; el controlador recibe el **servicio** por constructor.
- El adaptador `implements` el puerto y convierte con `toDomain()` / `toEntity()`.
- **Borrado lógico** con campo `status` (1 = activo, 0 = inactivo): `delete` actualiza el status, no elimina la fila.
- Validación con **módulos Joi** por caso de uso (crear / actualizar parcial / email).
- Seguridad: `bcrypt.hash(password, 12)` antes de guardar; JWT (`Authorization: Bearer <token>`).
- Códigos HTTP: 201 crear, 200 consultar/actualizar, 400 datos inválidos, 401 autenticación, 404 no encontrado, 500 error interno.

## Puesta en marcha

### 1. Requisitos
- Node.js LTS
- PostgreSQL (con pgAdmin). Anota la contraseña del usuario `postgres` (puerto 5432).

### 2. Crear la base de datos

**Opción A — Docker (recomendada, no requiere instalar PostgreSQL):**
```bash
docker compose up -d        # levanta PostgreSQL en localhost:5432
```
El contenedor crea la base `worldfit` y el esquema `worldfit` automáticamente
(ver `docker-compose.yml` y `docker/init/`). Usuario `postgres` / contraseña `postgres`.
Para detenerlo: `docker compose down` (los datos persisten en el volumen `pgdata`;
`docker compose down -v` los borra).

**Opción B — PostgreSQL instalado localmente:** en pgAdmin (o `psql`):
```sql
CREATE DATABASE worldfit;
CREATE SCHEMA worldfit;
```

### 3. Variables de entorno
```bash
cp .env.example .env   # y completa tus valores locales
```
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=worldfit
DB_SCHEMA=worldfit
```

### 4. Instalar y ejecutar
```bash
npm install
npm run dev      # desarrollo (nodemon + tsx, recarga en caliente)
```
Con `synchronize: true` (solo en desarrollo) TypeORM crea las tablas a partir de las entidades.

Para producción:
```bash
npm run build
npm start
```

## Endpoints (prefijo `/api`)

### Users
| Método | Ruta | Protegido | Descripción |
|---|---|---|---|
| POST | `/api/users` | No | Crear usuario |
| POST | `/api/login` | No | Login (devuelve JWT) |
| GET | `/api/users` | Sí | Listar usuarios |
| GET | `/api/users/:id` | Sí | Obtener por id |
| GET | `/api/users/email/:email` | Sí | Obtener por email |
| PUT | `/api/users/:id` | Sí | Actualizar |
| DELETE | `/api/users/:id` | Sí | Baja lógica (status = 0) |

### Exercises (todas protegidas con JWT)
`POST /api/exercises` · `GET /api/exercises` · `GET /api/exercises/:id` · `PUT /api/exercises/:id` · `DELETE /api/exercises/:id`

### Routines (todas protegidas con JWT)
`POST /api/routines` · `GET /api/routines` · `GET /api/routines/:id` · `PUT /api/routines/:id` · `DELETE /api/routines/:id`

> Para las rutas protegidas, envía el token en el header `Authorization: Bearer <token>`.

## Nota académica

El informe escrito (marco teórico, justificación, patrones) se redacta aparte y con
sus propias palabras; este repositorio es la implementación técnica de la arquitectura.
