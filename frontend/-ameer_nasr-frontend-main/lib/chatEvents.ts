/**
 * Tiny typed event bus that lets any component request the floating
 * Chatbot to open without having to share React state. Avoids adding
 * one more provider to `app/layout.tsx` for a single piece of UI.
 *
 * Producer:  `openChat()`     anywhere on the client.
 * Consumer:  `onChatOpen(fn)` inside a `useEffect`; returns a cleanup.
 */

const OPEN_CHAT_EVENT = "afunotec:open-chat";

export function openChat(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

export function onChatOpen(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(OPEN_CHAT_EVENT, handler);
  return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
}
