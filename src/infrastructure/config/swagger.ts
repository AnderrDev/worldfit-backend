import { ENV } from './environment-vars';

const bearerAuth = [{ bearerAuth: [] }];
const API_BASE = `${ENV.API_PREFIX}/${ENV.API_VERSION}`;

function catalogPaths(resource: string, tag: string, singular: string) {
  return {
    [`/${resource}`]: {
      get: {
        tags: [tag],
        summary: `Listar ${tag.toLowerCase()}`,
        security: bearerAuth,
        responses: { '200': { description: 'OK' }, '401': { description: 'No autenticado' } },
      },
      post: {
        tags: [tag],
        summary: `Crear ${singular} (admin)`,
        security: bearerAuth,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogInput' } } },
        },
        responses: { '201': { description: 'Creado' }, '400': { description: 'Datos invalidos' }, '403': { description: 'Solo admin' } },
      },
    },
    [`/${resource}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Obtener ${singular} por id`,
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
      put: {
        tags: [tag],
        summary: `Actualizar ${singular} (admin)`,
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CatalogInput' } } },
        },
        responses: { '200': { description: 'Actualizado' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
      delete: {
        tags: [tag],
        summary: `Eliminar ${singular} (admin)`,
        security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Eliminado' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
    },
  };
}

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'WorldFit API',
    version: '1.0.0',
    description:
      'API REST de WorldFit (Node + Express + TypeORM + PostgreSQL, arquitectura hexagonal). ' +
      'Para endpoints protegidos: haz login, copia el token y pulsa "Authorize".',
  },
  servers: [{ url: API_BASE, description: 'Servidor local (versionado)' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@worldfit.com' },
          password: { type: 'string', example: 'Admin123' },
        },
      },
      UserInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Nuevo Usuario' },
          email: { type: 'string', example: 'nuevo@worldfit.com' },
          password: { type: 'string', example: 'Nuevo123' },
          roleId: { type: 'integer', example: 1, description: 'ID del rol (1=admin, 2=user)' },
          isActive: { type: 'boolean', example: true },
        },
      },
      RoleInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'entrenador' },
          description: { type: 'string', example: 'Entrenador personal' },
        },
      },
      ExerciseInput: {
        type: 'object',
        required: ['categoryId', 'name', 'muscleGroup'],
        properties: {
          categoryId: { type: 'integer', example: 1, description: 'ID de la categoria' },
          name: { type: 'string', example: 'Peso muerto' },
          description: { type: 'string', example: 'Levantar la barra desde el suelo' },
          muscleGroup: {
            type: 'string',
            enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'],
            example: 'back',
          },
          isActive: { type: 'boolean', example: true },
        },
      },
      RoutineExerciseItem: {
        type: 'object',
        required: ['exerciseId'],
        properties: {
          exerciseId: { type: 'integer', example: 1 },
          sets: { type: 'integer', example: 4 },
          repetitions: { type: 'integer', example: 10 },
          exerciseOrder: { type: 'integer', example: 1 },
          description: { type: 'string', example: 'Agarre cerrado' },
          notes: { type: 'string', example: 'Descanso 90s entre series' },
        },
      },
      RoutineInput: {
        type: 'object',
        required: ['name', 'difficulty', 'assignedUserId'],
        properties: {
          name: { type: 'string', example: 'Rutina de fuerza' },
          description: { type: 'string', example: 'Enfocada en pecho y espalda' },
          difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], example: 'intermediate' },
          durationMinutes: { type: 'integer', example: 60 },
          exercises: {
            type: 'array',
            items: { $ref: '#/components/schemas/RoutineExerciseItem' },
            example: [{ exerciseId: 1, sets: 4, repetitions: 10, exerciseOrder: 1 }],
          },
          assignedUserId: { type: 'integer', example: 2 },
        },
      },
      GoalInput: {
        type: 'object',
        required: ['userId', 'name'],
        properties: {
          userId: { type: 'integer', example: 2 },
          name: { type: 'string', example: 'Perder peso' },
          description: { type: 'string', example: 'Reducir 5kg en 3 meses' },
          isActive: { type: 'boolean', example: true },
        },
      },
      CatalogInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Fuerza' },
          description: { type: 'string', example: 'Descripcion del elemento' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: { tags: ['Infra'], summary: 'Estado de la API', security: [], responses: { '200': { description: 'OK' } } },
    },

    // ---- Roles ----
    '/roles': {
      get: { tags: ['Roles'], summary: 'Listar roles', security: bearerAuth, responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Roles'], summary: 'Crear rol (admin)', security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RoleInput' } } } },
        responses: { '201': { description: 'Creado' }, '400': { description: 'Datos invalidos' }, '403': { description: 'Solo admin' } },
      },
    },
    '/roles/{id}': {
      get: {
        tags: ['Roles'], summary: 'Obtener rol por id', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
      put: {
        tags: ['Roles'], summary: 'Actualizar rol (admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RoleInput' } } } },
        responses: { '200': { description: 'Actualizado' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
      delete: {
        tags: ['Roles'], summary: 'Eliminar rol (admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Eliminado' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
    },

    // ---- Auth & Users ----
    '/login': {
      post: {
        tags: ['Auth'], summary: 'Iniciar sesion (devuelve JWT)', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: { '200': { description: 'Login exitoso (token)' }, '401': { description: 'Credenciales invalidas' } },
      },
    },
    '/users': {
      post: {
        tags: ['Auth'], summary: 'Registrar usuario (publico)', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
        responses: { '201': { description: 'Usuario creado' }, '400': { description: 'Datos invalidos' } },
      },
      get: { tags: ['Users'], summary: 'Listar usuarios', security: bearerAuth, responses: { '200': { description: 'OK' }, '401': { description: 'No autenticado' } } },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'], summary: 'Obtener usuario por id', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
      put: {
        tags: ['Users'], summary: 'Actualizar usuario', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserInput' } } } },
        responses: { '200': { description: 'Actualizado' }, '404': { description: 'No encontrado' } },
      },
      delete: {
        tags: ['Users'], summary: 'Eliminar usuario (baja logica)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Dado de baja' }, '404': { description: 'No encontrado' } },
      },
    },
    '/users/email/{email}': {
      get: {
        tags: ['Users'], summary: 'Obtener usuario por email', security: bearerAuth,
        parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } } ],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
    },

    // ---- Exercises ----
    '/exercises': {
      get: { tags: ['Exercises'], summary: 'Listar ejercicios', security: bearerAuth, responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Exercises'], summary: 'Crear ejercicio (admin)', security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseInput' } } } },
        responses: { '201': { description: 'Creado' }, '400': { description: 'Datos invalidos' }, '403': { description: 'Solo admin' } },
      },
    },
    '/exercises/{id}': {
      get: {
        tags: ['Exercises'], summary: 'Obtener ejercicio por id', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
      put: {
        tags: ['Exercises'], summary: 'Actualizar ejercicio (admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseInput' } } } },
        responses: { '200': { description: 'Actualizado' }, '403': { description: 'Solo admin' } },
      },
      delete: {
        tags: ['Exercises'], summary: 'Eliminar ejercicio (baja logica, admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Dado de baja' }, '403': { description: 'Solo admin' } },
      },
    },

    // ---- Routines ----
    '/routines': {
      get: { tags: ['Routines'], summary: 'Listar rutinas', security: bearerAuth, responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Routines'], summary: 'Crear rutina (admin)', security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RoutineInput' } } } },
        responses: { '201': { description: 'Creada' }, '400': { description: 'Datos invalidos o regla de negocio' }, '403': { description: 'Solo admin' } },
      },
    },
    '/routines/{id}': {
      get: {
        tags: ['Routines'], summary: 'Obtener rutina por id', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrada' } },
      },
      put: {
        tags: ['Routines'], summary: 'Actualizar rutina (admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RoutineInput' } } } },
        responses: { '200': { description: 'Actualizada' }, '403': { description: 'Solo admin' } },
      },
      delete: {
        tags: ['Routines'], summary: 'Eliminar rutina (baja logica, admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Dada de baja' }, '403': { description: 'Solo admin' } },
      },
    },
    '/routines/{id}/accept': {
      patch: {
        tags: ['Routines'], summary: 'Aceptar rutina asignada (usuario)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Rutina aceptada' }, '403': { description: 'No es el usuario asignado' }, '409': { description: 'Ya fue decidida' } },
      },
    },
    '/routines/{id}/reject': {
      patch: {
        tags: ['Routines'], summary: 'Rechazar rutina asignada (usuario)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Rutina rechazada' }, '403': { description: 'No es el usuario asignado' }, '409': { description: 'Ya fue decidida' } },
      },
    },

    // ---- Categories & Goals ----
    ...catalogPaths('categories', 'Categories', 'categoria'),
    '/goals': {
      get: { tags: ['Goals'], summary: 'Listar objetivos', security: bearerAuth, responses: { '200': { description: 'OK' } } },
      post: {
        tags: ['Goals'], summary: 'Crear objetivo (admin)', security: bearerAuth,
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GoalInput' } } } },
        responses: { '201': { description: 'Creado' }, '400': { description: 'Datos invalidos' }, '403': { description: 'Solo admin' } },
      },
    },
    '/goals/{id}': {
      get: {
        tags: ['Goals'], summary: 'Obtener objetivo por id', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
      },
      put: {
        tags: ['Goals'], summary: 'Actualizar objetivo (admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/GoalInput' } } } },
        responses: { '200': { description: 'Actualizado' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
      delete: {
        tags: ['Goals'], summary: 'Eliminar objetivo (baja logica, admin)', security: bearerAuth,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Dado de baja' }, '403': { description: 'Solo admin' }, '404': { description: 'No encontrado' } },
      },
    },
  },
};
