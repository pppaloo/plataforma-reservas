const mongoose = require('mongoose');
const { env } = require('./env');

// Bloquea operadores NoSQL inyectados en los filtros (ej. { email: { $ne: null } }).
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

async function connectDatabase(uri = env.mongoUri) {
  if (!uri) throw new Error('MONGODB_URI no esta configurada.');

  mongoose.connection.on('error', (error) => {
    console.error('[db] error de conexion:', error.message);
  });

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[db] conectado a la base "${mongoose.connection.name}"`);
  return mongoose.connection;
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
