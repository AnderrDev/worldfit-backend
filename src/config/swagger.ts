/**
 * Especificacion OpenAPI 3 de la API de WorldFit.
 *
 * Se centraliza aqui (en lugar de anotaciones dispersas en los routers) para
 * mantener limpios los adaptadores HTTP de la arquitectura hexagonal.
 * Se sirve con swagger-ui-express en GET /api/docs (ver app.ts).
 */
import { env } from './env.config';

// Rutas derivadas de la config (parametrizables via .env), no hardcodeadas.
const healthPath = `${env.apiPrefix}/health`;
const authBase = `${env.apiBasePath}/auth`;
const exercisesBase = `${env.apiBasePath}/exercises`;
const routinesBase = `${env.apiBasePath}/routines`;

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'WorldFit API',
    version: env.apiVersion,
    description:
      'API del backend WorldFit (Node/Express + arquitectura hexagonal). ' +
      'Usa esta interfaz para explorar y probar los endpoints.'
  },
  servers: [{ url: `http://localhost:${env.port}`, description: 'Local' }],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Auth', description: 'Registro y autenticacion de usuarios' },
    { name: 'Routines', description: 'Rutinas de entrenamiento' },
    { name: 'Exercises', description: 'Ejercicios' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Mensaje de error' } }
      },
      AuthResult: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '665f1c2a3b...' },
              email: { type: 'string', example: 'ana@worldfit.com' },
              fullName: { type: 'string', example: 'Ana Perez' }
            }
          }
        }
      },
      RegisterUserCommand: {
        type: 'object',
        required: ['email', 'password', 'fullName'],
        properties: {
          email: { type: 'string', format: 'email', example: 'ana@worldfit.com' },
          password: { type: 'string', format: 'password', example: 'secret123' },
          fullName: { type: 'string', example: 'Ana Perez' }
        }
      },
      LoginUserCommand: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'ana@worldfit.com' },
          password: { type: 'string', format: 'password', example: 'secret123' }
        }
      },
      Exercise: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665f1c2a3b...' },
          name: { type: 'string', example: 'Press de banca' },
          muscleGroup: {
            type: 'string',
            enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'],
            example: 'chest'
          },
          sets: { type: 'integer', example: 4 },
          reps: { type: 'integer', example: 12 }
        }
      },
      CreateExerciseCommand: {
        type: 'object',
        required: ['name', 'muscleGroup', 'sets', 'reps'],
        properties: {
          name: { type: 'string', example: 'Press de banca' },
          muscleGroup: {
            type: 'string',
            enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'fullbody'],
            example: 'chest'
          },
          sets: { type: 'integer', example: 4 },
          reps: { type: 'integer', example: 12 }
        }
      },
      Routine: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665f1c2a3b...' },
          name: { type: 'string', example: 'Full body principiante' },
          description: { type: 'string', example: 'Rutina de cuerpo completo 3 dias/semana' },
          difficulty: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
            example: 'beginner'
          },
          exerciseIds: { type: 'array', items: { type: 'string' }, example: ['665f...'] },
          ownerId: { type: 'string', example: '665f...' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateRoutineCommand: {
        type: 'object',
        required: ['name', 'description', 'difficulty', 'exerciseIds', 'ownerId'],
        properties: {
          name: { type: 'string', example: 'Full body principiante' },
          description: { type: 'string', example: 'Rutina de cuerpo completo 3 dias/semana' },
          difficulty: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
            example: 'beginner'
          },
          exerciseIds: { type: 'array', items: { type: 'string' }, example: ['665f...'] },
          ownerId: { type: 'string', example: '665f...' }
        }
      }
    }
  },
  paths: {
    [healthPath]: {
      get: {
        tags: ['Health'],
        summary: 'Estado del servicio',
        responses: {
          200: {
            description: 'Servicio operativo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'worldfit-backend' }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${authBase}/register`]: {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterUserCommand' } }
          }
        },
        responses: {
          201: {
            description: 'Usuario creado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } }
            }
          },
          400: {
            description: 'Datos invalidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    [`${authBase}/login`]: {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginUserCommand' } }
          }
        },
        responses: {
          200: {
            description: 'Autenticacion correcta',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthResult' } }
            }
          },
          401: {
            description: 'Credenciales invalidas',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    [exercisesBase]: {
      get: {
        tags: ['Exercises'],
        summary: 'Listar ejercicios',
        responses: {
          200: {
            description: 'Lista de ejercicios',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Exercise' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Exercises'],
        summary: 'Crear un ejercicio',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateExerciseCommand' } }
          }
        },
        responses: {
          201: {
            description: 'Ejercicio creado',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Exercise' } }
            }
          },
          400: {
            description: 'Datos invalidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    [routinesBase]: {
      get: {
        tags: ['Routines'],
        summary: 'Listar rutinas',
        responses: {
          200: {
            description: 'Lista de rutinas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Routine' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Routines'],
        summary: 'Crear una rutina',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateRoutineCommand' } }
          }
        },
        responses: {
          201: {
            description: 'Rutina creada',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Routine' } }
            }
          },
          400: {
            description: 'Datos invalidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    }
  }
} as const;
