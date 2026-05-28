// Configuracion de migrate-mongo (https://github.com/seppevs/migrate-mongo).
// Las migraciones viven en ./migrations y se escriben en TypeScript: aqui
// registramos ts-node (transpileOnly = sin type-check, mas rapido) para que
// migrate-mongo pueda cargar archivos .ts en tiempo de ejecucion.
require('dotenv').config();
require('ts-node').register({ transpileOnly: true });

const url = process.env.MONGO_URI || 'mongodb://localhost:27017/worldfit';

/** @type {import('migrate-mongo').config.Config} */
const config = {
  mongodb: {
    url,
    // El nombre de la base de datos se toma de la propia MONGO_URI (.../worldfit).
    options: {}
  },
  // Carpeta con los archivos de migracion (se versiona en git).
  migrationsDir: 'migrations',
  // Coleccion donde migrate-mongo registra que migraciones ya se aplicaron.
  changelogCollectionName: 'changelog',
  // Escribimos migraciones en TypeScript.
  migrationFileExtension: '.ts',
  // Desactivado: ordenamos por nombre de archivo (timestamp), no por hash.
  useFileHash: false,
  moduleSystem: 'commonjs'
};

module.exports = config;
