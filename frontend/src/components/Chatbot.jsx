import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

const WELCOME =
  'Hola, soy el asistente de ReservaPro. Puedo ayudarte con horarios, precios, reservas y contacto. ¿Que necesitas saber?';

function getSessionId() {
  const key = 'reservapro_chat_session';
  let value = localStorage.getItem(key);
  if (!value) {
    value =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }]);
  const [suggestions, setSuggestions] = useState(['Horarios', 'Precios', 'Reservas']);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(getSessionId);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || busy) return;

    setMessages((current) => [...current, { role: 'user', text: clean }]);
    setInput('');
    setBusy(true);

    try {
      const data = await api.chat({ message: clean, sessionId });
      setMessages((current) => [...current, { role: 'bot', text: data.reply }]);
      const next = data.matched ? [] : data.suggestions || [];
      setSuggestions(next.slice(0, 4));
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'bot',
          text:
            error.status === 429
              ? 'Estas escribiendo muy rapido. Espera un momento y vuelve a intentarlo.'
              : 'No pude procesar tu mensaje. Puedes usar el formulario de contacto.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    send(input);
  };

  return (
    <div className="chatbot">
      {open && (
        <section className="chat-panel" aria-label="Asistente virtual">
          <header className="chat-header">
            <div>
              <strong>Asistente ReservaPro</strong>
              <small>Respuestas automaticas</small>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Cerrar asistente"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
            {busy && <div className="chat-bubble bot">Escribiendo...</div>}
            <div ref={endRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="chat-suggestions">
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => send(item)} disabled={busy}>
                  {item}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chat-message">
              Escribe tu mensaje
            </label>
            <input
              id="chat-message"
              type="text"
              value={input}
              maxLength={500}
              placeholder="Escribe tu consulta..."
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !input.trim()}>
              Enviar
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        aria-label={open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? '×' : '?'}
      </button>
    </div>
  );
}
