# WorldFit - Backend (Node + Express + TypeScript)

API REST de WorldFit construida con **Express**, **TypeScript** y **MongoDB**.
Arquitectura **hexagonal (puertos y adaptadores)** modular.

---

## Arquitectura hexagonal

Cada modulo tiene esta estructura:

```
modules/<feature>/
  domain/
    entities/          <- Entidades de negocio
    value-objects/     <- VOs (Email, Password, ...)
    ports/
      in/              <- Puertos de entrada (driving): interfaces de Use Cases
      out/             <- Puertos de salida (driven): repositorios y servicios externos
  application/
    use-cases/         <- Implementacion de los puertos de entrada
  infrastructure/
    adapters/
      in/http/         <- Adaptador HTTP (controllers + routers)
      out/persistence/ <- Adaptadores Mongo (schemas + repos)
      out/             <- Otros adaptadores (bcrypt, jwt, etc)
```

Regla de oro: **el dominio y la aplicacion no dependen de Express, Mongo, JWT ni nada externo**.
Todo se inyecta a traves de puertos. La composicion concreta vive en el `*.router.ts` de cada modulo (composition root del modulo).

### Modulos incluidos

| Modulo      | Endpoints                                      |
|-------------|------------------------------------------------|
| `users`     | `POST /api/auth/register`, `POST /api/auth/login` |
| `routines`  | `GET /api/routines`, `POST /api/routines`      |
| `exercises` | `GET /api/exercises`, `POST /api/exercises`    |
| (health)    | `GET /api/health`                              |

---

## Setup local

```bash
cp .env.example .env       # configura MONGO_URI y JWT_SECRET
npm install
npm run dev                # ts-node-dev en hot reload
npm test                   # Jest + supertest
npm run lint
npm run build              # tsc -> dist/
npm start                  # node dist/server.js
```

Necesitas una base de datos MongoDB. La forma mas sencilla (gratis, sin instalar nada) es **MongoDB Atlas** (ver abajo).

---

## Base de datos: MongoDB Atlas (gratis, recomendado)

El codigo de conexion ya esta hecho (`src/config/database.ts` usa Mongoose y se conecta solo al arrancar). Lo unico que necesitas es crear una base en la nube y pegar su "connection string" en tu `.env`. **No instalas nada en tu computadora.**

### Pasos (una sola vez por persona, ~5 min)

1. Entra a https://www.mongodb.com/cloud/atlas/register y crea una cuenta gratis (puedes usar tu cuenta de Google).
2. Cuando pregunte el tipo de cluster, elige **M0 (Free)**. Deja el proveedor/region por defecto y dale **Create**.
3. **Database Access** (menu izquierdo) -> **Add New Database User**:
   - Authentication Method: **Password**.
   - Pon un usuario y una contrasena (anotalos; evita simbolos raros como `@` `:` `/` en la contrasena, complican la URL).
   - Built-in Role: **Read and write to any database** -> **Add User**.
4. **Network Access** (menu izquierdo) -> **Add IP Address** -> **Allow Access from Anywhere** (`0.0.0.0/0`) -> **Confirm**.
   (Esto hace que les funcione a los 3 desde cualquier red. Para algo serio se restringe, pero para la uni esta bien.)
5. **Database** (menu izquierdo) -> en tu cluster, boton **Connect** -> **Drivers** -> copia la **connection string**. Se ve asi:
   ```
   mongodb+srv://USUARIO:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. En el proyecto: `cp .env.example .env` y pega esa cadena en `MONGO_URI`, reemplazando:
   - `USUARIO` y `<db_password>` por los del paso 3.
   - Agrega el nombre de la base antes del `?`, por ejemplo `.../worldfit?retryWrites=...`:
   ```
   MONGO_URI=mongodb+srv://USUARIO:MICONTRASENA@cluster0.xxxxx.mongodb.net/worldfit?retryWrites=true&w=majority
   ```
7. `npm install` y `npm run dev`. Si todo esta bien veras en consola:
   `[db] connected to mongodb+srv://...` y `[server] WorldFit backend listening on :3000`.

> **Compartir o no la base:** lo mas simple es que el equipo use **una sola** connection string (la misma para los 3, datos compartidos). Si prefieren datos aislados, cada quien crea su propio cluster M0 y usa su propia cadena. El `.env` es personal y no se sube a git.

> **Importante:** nunca subas tu `.env` ni la connection string a GitHub. Ya esta ignorado por git.

### Alternativa offline (opcional): Mongo local con Docker

Si no quieres usar la nube y tienes Docker: `docker run -d -p 27017:27017 --name worldfit-mongo mongo` y deja `MONGO_URI=mongodb://localhost:27017/worldfit` (el valor por defecto). Requiere tener Docker instalado.

---

## SonarCloud

`sonar-project.properties` listo. Edita los placeholders:

- `sonar.projectKey=<TU_ORG>_worldfit-backend`
- `sonar.organization=<TU_ORG>`

Configura el secret `SONAR_TOKEN` en GitHub (ver `docs/SETUP_GITHUB.md` en la raiz del monorepo).

---

## CI/CD

`.github/workflows/ci.yml` corre en cada PR a `dev`, `test` y `main`:

1. Install deps
2. Lint (ESLint)
3. Build (`tsc`)
4. Tests con coverage (Jest)
5. Subida de coverage a SonarCloud
