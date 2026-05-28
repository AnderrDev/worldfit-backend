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

Necesitas MongoDB en local (o ajusta `MONGO_URI` a un Atlas).

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
