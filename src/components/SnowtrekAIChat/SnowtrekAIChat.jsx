import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./SnowtrekAIChat.module.css";
import { sendSnowtrekAiMessage } from "../../services/snowtrekAiClient";

const MAX_RESULTS_PER_GROUP = 3;

const GROUP_LABELS = {
  services: "Servicios",
  destinations: "Destinos",
  activities: "Actividades",
  shops: "Shops",
  businesses: "Negocios",
};

const getItemTitle = (item) => item?.name || item?.title || "Resultado Snowtrek";

function ResultCard({ item }) {
  const meta = [item?.city, item?.country, item?.address, item?.phone, item?.category, item?.type, item?.price !== undefined ? `$${item.price}` : null].filter(Boolean);

  return (
    <div className={styles.card}>
      <strong>{getItemTitle(item)}</strong>
      {item?.description ? <p>{item.description}</p> : null}
      {meta.length ? (
        <div className={styles.cardMeta}>
          {meta.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ResultGroups({ results }) {
  const groups = useMemo(() => {
    if (!results) return [];

    return Object.entries(GROUP_LABELS)
      .map(([key, label]) => ({
        key,
        label,
        items: Array.isArray(results[key]) ? results[key].slice(0, MAX_RESULTS_PER_GROUP) : [],
      }))
      .filter((group) => group.items.length > 0);
  }, [results]);

  if (results && !groups.length) {
    return <p className={styles.emptyResults}>No encontré resultados cargados para esta consulta.</p>;
  }

  if (!groups.length) return null;

  return (
    <div className={styles.resultGroups}>
      {groups.map((group) => (
        <section key={group.key}>
          <p className={styles.groupTitle}>{group.label}</p>
          {group.items.map((item, index) => (
            <ResultCard key={item?.id || `${group.key}-${index}`} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
}

function SnowtrekAIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hola, soy SnowtrekIA. Puedo ayudarte con ski, montaña, rentals, destinos y servicios disponibles.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [panelPosition, setPanelPosition] = useState(null);
  const [dragState, setDragState] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!dragState) return undefined;

    const handlePointerMove = (event) => {
      const panel = panelRef.current;
      if (!panel) return;

      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const margin = 12;
      const maxLeft = window.innerWidth - width - margin;
      const maxTop = window.innerHeight - height - margin;
      const nextLeft = Math.min(Math.max(event.clientX - dragState.offsetX, margin), Math.max(maxLeft, margin));
      const nextTop = Math.min(Math.max(event.clientY - dragState.offsetY, margin), Math.max(maxTop, margin));

      setPanelPosition({ left: nextLeft, top: nextTop });
    };

    const handlePointerUp = () => setDragState(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  const toggleOpen = () => {
    setOpen((current) => !current);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleHeaderPointerDown = (event) => {
    if (window.innerWidth <= 560 || event.target.closest("button")) return;

    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    setPanelPosition({ left: rect.left, top: rect.top });
    setDragState({ offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await sendSnowtrekAiMessage(text);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: response.reply || "SnowtrekIA recibió tu consulta.",
          results: response.results,
        },
      ]);
    } catch (requestError) {
      setError(requestError.message || "No se pudo conectar con SnowtrekIA. Verificá que el backend esté activo.");
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = panelPosition
    ? {
        left: `${panelPosition.left}px`,
        top: `${panelPosition.top}px`,
        right: "auto",
        bottom: "auto",
      }
    : undefined;

  return (
    <div className={styles.wrapper}>
      {open ? (
        <div
          className={`${styles.panel} ${dragState ? styles.panelDragging : ""}`}
          ref={panelRef}
          role="dialog"
          aria-label="SnowtrekIA chat"
          style={panelStyle}
        >
          <header className={styles.header} onPointerDown={handleHeaderPointerDown}>
            <div className={styles.title}>
              <strong>SnowtrekIA</strong>
              <span>Asistente local de Snowtrek</span>
            </div>
            <button className={styles.closeButton} type="button" onClick={() => setOpen(false)} aria-label="Cerrar SnowtrekIA">
              x
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                className={`${styles.messageRow} ${message.role === "user" ? styles.messageRowUser : styles.messageRowAssistant}`}
                key={message.id}
              >
                <div className={`${styles.bubble} ${message.role === "user" ? styles.userBubble : styles.assistantBubble}`}>
                  <div>{message.text}</div>
                  <ResultGroups results={message.results} />
                </div>
              </div>
            ))}
            {loading ? <div className={styles.loading}>SnowtrekIA está buscando...</div> : null}
            <div ref={messagesEndRef} />
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribí tu consulta"
              disabled={loading}
            />
            <button className={styles.sendButton} type="submit" disabled={loading || !input.trim()}>
              Enviar
            </button>
          </form>
        </div>
      ) : null}

      <button className={styles.floatingButton} type="button" onClick={toggleOpen} aria-label="Abrir SnowtrekIA">
        AI
      </button>
    </div>
  );
}

export default SnowtrekAIChat;
