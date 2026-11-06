const nodemailer = require('nodemailer');
const { env } = require('../config/env');

// Si no hay SMTP configurado, la aplicacion sigue funcionando y solo registra en consola.
// Esto permite desarrollar sin depender del proveedor de correo.
const isConfigured = Boolean(env.mail.host && env.mail.user && env.mail.pass);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: { user: env.mail.user, pass: env.mail.pass },
    })
  : null;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function institutionalTemplate(request) {
  return `
    <h2>Nueva solicitud de contacto</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(request.name)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(request.email)}</p>
    <p><strong>Telefono:</strong> ${escapeHtml(request.phone || 'No informado')}</p>
    <p><strong>Asunto:</strong> ${escapeHtml(request.subject)}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(request.message).replace(/\n/g, '<br>')}</p>
  `;
}

function clientTemplate(request) {
  return `
    <h2>Recibimos tu mensaje</h2>
    <p>Hola ${escapeHtml(request.name)},</p>
    <p>Registramos tu solicitud "<strong>${escapeHtml(request.subject)}</strong>".
    Nuestro equipo te respondera dentro de las proximas 24 horas habiles.</p>
    <p>Este es un correo automatico, por favor no respondas a esta direccion.</p>
    <p>Equipo ReservaPro</p>
  `;
}

/**
 * Envia los dos correos exigidos por el certamen:
 *  1) notificacion al buzon institucional (fijo en configuracion)
 *  2) confirmacion al cliente que completo el formulario
 */
async function sendContactEmails(request) {
  if (!isConfigured) {
    console.warn('[mail] SMTP no configurado: se omite el envio de correos.');
    return { status: 'skipped' };
  }

  try {
    await Promise.all([
      transporter.sendMail({
        from: env.mail.from,
        to: env.mail.institutionalTo,
        replyTo: request.email,
        subject: `Nueva solicitud: ${request.subject}`,
        html: institutionalTemplate(request),
        text: `Nueva solicitud de ${request.name} (${request.email}): ${request.message}`,
      }),
      transporter.sendMail({
        from: env.mail.from,
        to: request.email,
        subject: 'Recibimos tu solicitud - ReservaPro',
        html: clientTemplate(request),
        text: `Hola ${request.name}, recibimos tu solicitud "${request.subject}".`,
      }),
    ]);
    return { status: 'sent' };
  } catch (error) {
    // No se registran credenciales ni el cuerpo completo del correo.
    console.error('[mail] fallo el envio:', error.message);
    return { status: 'failed' };
  }
}

module.exports = { sendContactEmails, isConfigured };
