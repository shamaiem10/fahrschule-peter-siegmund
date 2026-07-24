import { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

const NAMESPACE = "Fahrschule-Peter-Siegmund";
const WEBHOOK_URL = "https://barista-confined-headset.ngrok-free.dev/webhook/chat";

function getSessionId() {
  let id = localStorage.getItem('ai_chat_session');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2);
    localStorage.setItem('ai_chat_session', id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const sessionId = useRef(getSessionId());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !greeted) {
      const t = setTimeout(() => {
        setMessages([{ role: 'bot', text: "Hi there! I'm your AI assistant. Ask me anything about our services — I'm here to help." }]);
        setGreeted(true);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open, greeted]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current && inputRef.current.focus(), 400);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ message: text, namespace: NAMESPACE, sessionId: sessionId.current })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'bot', text: data.reply || "Sorry, I didn't quite catch that. Could you try again?" }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'bot', text: "I'm having trouble connecting right now — please try again in a moment." }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      <button
        id="aiw-launcher"
        className={open ? 'is-open' : ''}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        onClick={() => setOpen(o => !o)}
      >
        <span id="aiw-launcher-ring" aria-hidden="true" />
        <span id="aiw-launcher-core" aria-hidden="true">
          <i className="bi bi-stars" id="aiw-icon-open" />
          <i className="bi bi-x-lg" id="aiw-icon-close" />
        </span>
        {!open && <span id="aiw-launcher-badge" aria-hidden="true" />}
      </button>

      <div id="aiw-panel" className={open ? 'is-open' : ''} role="dialog" aria-label="AI chat assistant" aria-hidden={!open}>
        <div id="aiw-header">
          <span id="aiw-header-glow" aria-hidden="true" />
          <div id="aiw-header-row">
            <div id="aiw-avatar">
              <i className="bi bi-cpu-fill" />
              <span id="aiw-avatar-pulse" aria-hidden="true" />
            </div>
            <div id="aiw-header-text">
              <span id="aiw-title">AI Assistant</span>
              <span id="aiw-subtitle">
                <span id="aiw-status-dot" aria-hidden="true" />
                Ready to help
              </span>
            </div>
            <button id="aiw-minimize" aria-label="Minimize chat" onClick={() => setOpen(false)}>
              <i className="bi bi-dash-lg" />
            </button>
          </div>
        </div>

        <div id="aiw-messages" ref={scrollRef}>
          {messages.length === 0 && (
            <div id="aiw-empty-state">
              <i className="bi bi-chat-heart" />
              <p>Ask a question to get started</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={'aiw-row aiw-row-' + m.role} style={{ animationDelay: (i * 0.03) + 's' }}>
              {m.role === 'bot' && (
                <span className="aiw-bubble-icon"><i className="bi bi-stars" /></span>
              )}
              <div className={'aiw-bubble aiw-bubble-' + m.role}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="aiw-row aiw-row-bot">
              <span className="aiw-bubble-icon"><i className="bi bi-stars" /></span>
              <div className="aiw-bubble aiw-bubble-bot aiw-typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <form id="aiw-form" onSubmit={handleSubmit}>
          <div id="aiw-input-wrap">
            <input
              id="aiw-input"
              ref={inputRef}
              type="text"
              placeholder="Type your message…"
              autoComplete="off"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
            <button type="submit" id="aiw-send" aria-label="Send message" disabled={!input.trim()}>
              <i className="bi bi-send-fill" />
            </button>
          </div>
          <span id="aiw-footer-note">Powered by AI · Responses may take a moment</span>
        </form>
      </div>

      {open && <div id="aiw-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  );
}
