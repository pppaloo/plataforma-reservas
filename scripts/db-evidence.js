const fs = require('fs');
const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'backend', 'node_modules', 'mongoose'));

require(path.join(__dirname, '..', 'backend', 'node_modules', 'dotenv')).config({
  path: path.join(__dirname, '..', 'backend', '.env'),
});

const outputDir = path.join(__dirname, '..', 'docs', 'evidencias');
const backupDir = path.join(outputDir, 'backup-local');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const lines = [];
  const date = new Date().toISOString();

  lines.push('# Evidencia de base de datos');
  lines.push('');
  lines.push(`- Fecha: ${date}`);
  lines.push(`- Base: ${db.databaseName}`);
  lines.push(`- URI: ${String(process.env.MONGODB_URI).replace(/\/\/[^@]+@/, '//***:***@')}`);
  lines.push('');

  fs.mkdirSync(backupDir, { recursive: true });

  for (const col of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    const collection = db.collection(col.name);
    const count = await collection.countDocuments();
    const indexes = await collection.indexes();
    const sample = await collection.find({}).limit(3).toArray();

    const backupFile = path.join(backupDir, `${col.name}.json`);
    const allDocs = await collection.find({}).toArray();
    fs.writeFileSync(backupFile, JSON.stringify(allDocs, null, 2));

    lines.push(`## ${col.name}`);
    lines.push('');
    lines.push(`- Documentos: ${count}`);
    lines.push(`- Respaldo: docs/evidencias/backup-local/${col.name}.json`);
    lines.push('- Índices:');
    for (const idx of indexes) {
      lines.push(`  - \`${JSON.stringify(idx.key)}\`${idx.unique ? ' (único)' : ''}${idx.name ? ` — ${idx.name}` : ''}`);
    }
    lines.push('');
    if (sample.length) {
      lines.push('Ejemplo de documento:');
      lines.push('```json');
      lines.push(JSON.stringify(sample[0], null, 2));
      lines.push('```');
      lines.push('');
    }
  }

  const reportPath = path.join(outputDir, 'db-evidencia.md');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, lines.join('\n'));
  console.log(`Evidencia generada en ${reportPath}`);
  console.log(`Respaldo JSON en ${backupDir}`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
