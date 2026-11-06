const { z } = require('zod');

const noNewlines = (label) =>
  z.string().regex(/^[^\r\n]*$/, `${label} no puede contener saltos de linea`);

const password = z
  .string()
  .min(10, 'La contrasena debe tener al menos 10 caracteres')
  .max(128, 'La contrasena no puede superar los 128 caracteres')
  .regex(/[A-Za-z]/, 'La contrasena debe incluir al menos una letra')
  .regex(/[0-9]/, 'La contrasena debe incluir al menos un numero');

const objectId = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, 'Identificador invalido');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es demasiado corto').max(80),
  email: z.string().trim().toLowerCase().email('El correo no es valido').max(120),
  password,
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('El correo no es valido'),
  password: z.string().min(1, 'La contrasena es obligatoria').max(128),
});

const serviceSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  durationMin: z.coerce.number().int().min(15).max(480),
  price: z.coerce.number().min(0).max(1000000),
  capacity: z.coerce.number().int().min(1).max(100),
  active: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
});

const serviceUpdateSchema = serviceSchema.partial();

const reservationSchema = z.object({
  serviceId: objectId,
  startAt: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Fecha y hora invalidas')
    .transform((value) => new Date(value)),
  partySize: z.coerce.number().int().min(1).max(20).default(1),
  contactPhone: noNewlines('El telefono').max(30).optional().default(''),
  notes: z.string().trim().max(500).optional().default(''),
});

const reservationStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

const contactSchema = z.object({
  name: noNewlines('El nombre').trim().min(2).max(80),
  email: noNewlines('El correo').trim().toLowerCase().email('El correo no es valido').max(120),
  phone: noNewlines('El telefono').max(30).optional().default(''),
  subject: noNewlines('El asunto').trim().min(3).max(120),
  message: z.string().trim().min(10, 'El mensaje es demasiado corto').max(2000),
});

const socialSchema = z.object({
  network: z.string().trim().min(2).max(40),
  url: z.string().trim().url('La URL no es valida').max(300),
  active: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
});

const socialUpdateSchema = socialSchema.partial();

const faqSchema = z.object({
  question: z.string().trim().min(3).max(200),
  answer: z.string().trim().min(3).max(1000),
  category: z.string().trim().max(60).optional().default('General'),
  keywords: z
    .string()
    .max(300)
    .optional()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 20)
    ),
  active: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
});

const faqUpdateSchema = faqSchema.partial();

const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'El mensaje esta vacio').max(500, 'El mensaje es demasiado largo'),
  sessionId: z
    .string()
    .regex(/^[A-Za-z0-9-]{8,64}$/, 'Identificador de sesion invalido')
    .optional(),
});

const contactStatusSchema = z.object({
  status: z.enum(['new', 'in_progress', 'answered', 'closed']),
});

const userUpdateSchema = z.object({
  role: z.enum(['admin', 'client']).optional(),
  active: z.boolean().optional(),
  name: z.string().trim().min(2).max(80).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  serviceSchema,
  serviceUpdateSchema,
  reservationSchema,
  reservationStatusSchema,
  contactSchema,
  socialSchema,
  socialUpdateSchema,
  faqSchema,
  faqUpdateSchema,
  chatMessageSchema,
  contactStatusSchema,
  userUpdateSchema,
};
