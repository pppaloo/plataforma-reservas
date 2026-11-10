/* Carga datos iniciales: administrador, servicios, redes y preguntas del chatbot.
   Uso: npm run seed  (idempotente: no duplica si ya existen) */
const { connectDatabase, disconnectDatabase } = require('./config/db');
const { env } = require('./config/env');
const { hashPassword } = require('./utils/password');
const User = require('./models/User');
const Service = require('./models/Service');
const SocialLink = require('./models/SocialLink');
const Faq = require('./models/Faq');

async function seed() {
  await connectDatabase();

  // --- Administrador ---
  const existingAdmin = await User.findOne({ email: env.admin.email });
  if (!existingAdmin) {
    await User.create({
      name: env.admin.name,
      email: env.admin.email,
      passwordHash: await hashPassword(env.admin.password),
      role: 'admin',
    });
    console.log(`[seed] administrador creado: ${env.admin.email}`);
    console.log('[seed] cambia ADMIN_PASSWORD antes de desplegar en produccion.');
  } else {
    console.log('[seed] el administrador ya existe, no se modifica su contrasena.');
  }

  // --- Servicios ---
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        name: 'Masaje descontracturante',
        description:
          'Sesion de 60 minutos orientada a liberar tension muscular y mejorar la circulacion.',
        durationMin: 60,
        price: 35000,
        capacity: 2,
        order: 1,
      },
      {
        name: 'Kinesiologia deportiva',
        description:
          'Evaluacion y tratamiento de lesiones deportivas con plan de recuperacion personalizado.',
        durationMin: 45,
        price: 42000,
        capacity: 1,
        order: 2,
      },
      {
        name: 'Evaluacion nutricional',
        description:
          'Analisis de composicion corporal y plan alimentario adaptado a tus objetivos.',
        durationMin: 50,
        price: 30000,
        capacity: 3,
        order: 3,
      },
      {
        name: 'Clase de yoga privada',
        description:
          'Sesion guiada de yoga y respiracion para reducir el estres, hasta 6 participantes.',
        durationMin: 60,
        price: 18000,
        capacity: 6,
        order: 4,
      },
    ]);
    console.log('[seed] servicios de ejemplo creados.');
  }

  // --- Redes sociales ---
  if ((await SocialLink.countDocuments()) === 0) {
    await SocialLink.insertMany([
      { network: 'Instagram', url: 'https://instagram.com/reservapro', order: 1 },
      { network: 'Facebook', url: 'https://facebook.com/reservapro', order: 2 },
      { network: 'LinkedIn', url: 'https://linkedin.com/company/reservapro', order: 3 },
    ]);
    console.log('[seed] redes sociales de ejemplo creadas.');
  }

  // --- Preguntas frecuentes del chatbot ---
  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany([
      {
        question: 'Cuales son los horarios de atencion?',
        answer:
          'Atendemos de lunes a viernes de 08:00 a 20:00 y sabados de 09:00 a 14:00.',
        category: 'Horarios',
        keywords: ['horario', 'abierto', 'atencion', 'sabado', 'domingo'],
        order: 1,
      },
      {
        question: 'Cuanto cuestan los servicios?',
        answer:
          'Los valores van desde $18.000 y dependen del servicio. Puedes ver el detalle en la seccion Servicios.',
        category: 'Precios',
        keywords: ['precio', 'valor', 'costo', 'cuanto', 'tarifa'],
        order: 2,
      },
      {
        question: 'Como puedo cancelar o reagendar una reserva?',
        answer:
          'Ingresa a Mis reservas, selecciona la reserva y presiona Cancelar. Las reagendas se coordinan por telefono.',
        category: 'Reservas',
        keywords: ['cancelar', 'reagendar', 'anular', 'cambiar', 'reserva'],
        order: 3,
      },
      {
        question: 'Donde estan ubicados?',
        answer:
          'Estamos en Av. Los Carrera 1234, Concepcion. Hay estacionamiento disponible en el mismo edificio.',
        category: 'Ubicacion',
        keywords: ['ubicacion', 'direccion', 'donde', 'llegar', 'estacionamiento'],
        order: 4,
      },
      {
        question: 'Como puedo contactar a un ejecutivo?',
        answer:
          'Escríbenos desde la seccion Contacto o al correo contacto@reservapro.cl. Respondemos en menos de 24 horas habiles.',
        category: 'Contacto',
        keywords: ['contacto', 'ejecutivo', 'telefono', 'correo', 'hablar', 'persona'],
        order: 5,
      },
      {
        question: 'Que medios de pago aceptan?',
        answer:
          'Aceptamos transferencia bancaria, tarjetas de debito y credito, y pago presencial en recepcion.',
        category: 'Pagos',
        keywords: ['pago', 'tarjeta', 'transferencia', 'efectivo', 'debito'],
        order: 6,
      },
    ]);
    console.log('[seed] preguntas frecuentes creadas.');
  }

  console.log('[seed] proceso completado.');
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('[seed] error:', error.message);
  await disconnectDatabase();
  process.exit(1);
});
