const { generateReply, isConfigured } = require('../src/services/llm');

describe('Servicio de IA generativa', () => {
  const originalFetch = global.fetch;
  const originalEnv = {
    key: process.env.LLM_API_KEY,
    base: process.env.LLM_BASE_URL,
    model: process.env.LLM_MODEL,
  };

  const restoreEnv = (name, value) => {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  };

  afterEach(() => {
    global.fetch = originalFetch;
    restoreEnv('LLM_API_KEY', originalEnv.key);
    restoreEnv('LLM_BASE_URL', originalEnv.base);
    restoreEnv('LLM_MODEL', originalEnv.model);
  });

  test('sin clave no llama al proveedor y devuelve null', async () => {
    process.env.LLM_API_KEY = '';
    global.fetch = jest.fn();

    expect(isConfigured()).toBe(false);
    await expect(generateReply({ message: 'Hola' })).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('envia contexto y devuelve la respuesta del modelo', async () => {
    process.env.LLM_API_KEY = 'clave-de-prueba';
    process.env.LLM_BASE_URL = 'https://llm.example/v1';
    process.env.LLM_MODEL = 'modelo-prueba';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '  Respuesta generativa  ' } }] }),
    });

    const reply = await generateReply({
      message: 'Que me recomiendas para el estres?',
      history: [{ role: 'user', text: 'Hola' }, { role: 'bot', text: 'Hola, ¿en que te ayudo?' }],
      context: 'Horario: lunes a viernes de 08:00 a 20:00.',
    });

    expect(reply).toBe('Respuesta generativa');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('https://llm.example/v1/chat/completions');
    expect(options.headers.Authorization).toBe('Bearer clave-de-prueba');

    const body = JSON.parse(options.body);
    expect(body.model).toBe('modelo-prueba');
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[0].content).toContain('ReservaPro');
    expect(body.messages.some((item) => item.content.includes('08:00'))).toBe(true);
    expect(body.messages.at(-1)).toEqual({
      role: 'user',
      content: 'Que me recomiendas para el estres?',
    });
  });

  test('si el proveedor responde con error devuelve null', async () => {
    process.env.LLM_API_KEY = 'clave-de-prueba';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(generateReply({ message: 'Hola' })).resolves.toBeNull();
  });

  test('si falla la red devuelve null en lugar de romper la peticion', async () => {
    process.env.LLM_API_KEY = 'clave-de-prueba';
    global.fetch = jest.fn().mockRejectedValue(new Error('sin conexion'));

    await expect(generateReply({ message: 'Hola' })).resolves.toBeNull();
  });

  test('limita el largo de la respuesta', async () => {
    process.env.LLM_API_KEY = 'clave-de-prueba';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'a'.repeat(1500) } }] }),
    });

    const reply = await generateReply({ message: 'Hola' });
    expect(reply).toHaveLength(900);
  });
});
