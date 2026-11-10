const app = require('./app');
const { env, validateEnvironment } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');

async function main() {
  validateEnvironment();
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`[api] escuchando en http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal) => {
    console.log(`[api] ${signal} recibido: cerrando servidor...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('[api] error fatal:', error.message);
  process.exit(1);
});
