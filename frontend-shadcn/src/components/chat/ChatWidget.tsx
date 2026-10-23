import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Route,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import ChatText from "@/components/chat/ChatText";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { askAssistant } from "@/services/chatService";
import type { ChatLink, ChatMessage } from "@/types/Chat";

type Entry = ChatMessage & { links?: ChatLink[]; error?: boolean };

const STORAGE_KEY = "andalusia.chat";
const SIZE_KEY = "andalusia.chat.expanded";
const MAX_LENGTH = 1000;
// Only the latest messages are sent, so the model stays fast
const HISTORY_SENT = 12;

const WELCOME: Entry = {
  role: "assistant",
  content:
    "Hi! I'm the Andalusia assistant 👋 Ask me anything about our courses, programs and career paths, or tell me your goal and I'll suggest where to start.",
};

const LINK_META: Record<ChatLink["type"], { to: string; icon: typeof BookOpen }> = {
  Course: { to: "/courses", icon: BookOpen },
  Program: { to: "/programs", icon: Layers },
  CareerPath: { to: "/career-paths", icon: Route },
};

function loadSaved(): Entry[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const parsed = saved ? (JSON.parse(saved) as Entry[]) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

// Floating "Ask Andalusia" chat: answers from the live catalog via POST /api/chat
function ChatWidget() {
  const { pathname } = useLocation();
  const { hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  // Small side panel by default; the learner can make it bigger (remembered while the tab is open)
  const [expanded, setExpanded] = useState(() => {
    try {
      return sessionStorage.getItem(SIZE_KEY) === "1";
    } catch {
      return false;
    }
  });

  function toggleSize() {
    setExpanded((value) => {
      try {
        sessionStorage.setItem(SIZE_KEY, value ? "0" : "1");
      } catch {
        // storage can be blocked; the size just won't be remembered
      }
      return !value;
    });
  }
  const [entries, setEntries] = useState<Entry[]>(loadSaved);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Remember the chat while the tab is open
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage can be blocked (private mode); the chat still works
    }
  }, [entries]);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, thinking, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Staff areas have their own tools
  if (pathname.startsWith("/instructor") || pathname.startsWith("/admin")) return null;

  const suggestions = [
    "Help me choose a course",
    "What's open for enrollment?",
    "I want to become a data analyst",
    ...(hasRole("Learner") ? ["What should I take next?"] : ["Which course is best for beginners?"]),
  ];

  // base = the conversation to continue from (retry passes it without the failed question)
  async function send(text: string, base: Entry[] = entries) {
    const content = text.trim().slice(0, MAX_LENGTH);
    if (!content || thinking) return;

    const next: Entry[] = [...base.filter((e) => !e.error), { role: "user", content }];
    setEntries(next);
    setInput("");
    setThinking(true);

    // The welcome message and failed answers are not part of the real conversation
    const history = next
      .filter((e) => e !== WELCOME && e.content !== WELCOME.content && !e.error)
      .slice(-HISTORY_SENT)
      // Long old answers are shortened so the request stays small and fast
      .map(({ role, content: c }) => ({ role, content: c.slice(0, 1500) }));

    try {
      const result = await askAssistant(history);
      setEntries((prev) => [...prev, { role: "assistant", content: result.reply, links: result.links }]);
    } catch (error) {
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: getApiErrorMessage(error, "Sorry, I couldn't answer right now. Please try again."), error: true },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function retry() {
    // Drop the failed answer and the question it was for, then ask that question again
    const withoutErrors = entries.filter((e) => !e.error);
    const lastUser = withoutErrors[withoutErrors.length - 1];
    if (!lastUser || lastUser.role !== "user") return;
    void send(lastUser.content, withoutErrors.slice(0, -1));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter adds a new line
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  const onlyWelcome = entries.length === 1;

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Andalusia assistant"
          className={cn(
            "fixed right-4 bottom-24 z-50 flex origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border/80 bg-background shadow-2xl shadow-primary/20 transition-[width,height] duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 sm:right-6 motion-reduce:transition-none",
            expanded
              ? "h-[calc(100svh-8rem)] w-[min(56rem,calc(100vw-2rem))]"
              : "h-[min(38rem,calc(100svh-8rem))] w-[min(25rem,calc(100vw-2rem))]",
          )}
        >
          {/* Header */}
          <header className="relative overflow-hidden bg-primary px-5 py-4 text-primary-foreground">
            <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15" />
            <div className="relative flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-sand text-primary">
                <Sparkles aria-hidden className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Andalusia assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-primary-foreground/70">
                  <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
                  Courses, programs & career advice
                </p>
              </div>
              <button
                type="button"
                aria-label={expanded ? "Make the chat smaller" : "Make the chat bigger"}
                title={expanded ? "Smaller" : "Bigger"}
                aria-pressed={expanded}
                onClick={toggleSize}
                className="hidden rounded-full p-2 text-primary-foreground/70 transition outline-none hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-sand/60 sm:block"
              >
                {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
              <button
                type="button"
                aria-label="Start a new chat"
                title="New chat"
                onClick={() => setEntries([WELCOME])}
                className="rounded-full p-2 text-primary-foreground/70 transition outline-none hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-sand/60"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-primary-foreground/70 transition outline-none hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-sand/60"
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          {/* Messages */}
          <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto bg-secondary/30 px-4 py-4">
            {entries.map((entry, index) =>
              entry.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <p className={cn("rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground", expanded ? "max-w-[70%]" : "max-w-[85%]")}>
                    {entry.content}
                  </p>
                </div>
              ) : (
                <div key={index} className={cn("flex flex-col gap-2 duration-300 animate-in fade-in slide-in-from-bottom-1", expanded ? "max-w-[80%] text-[0.95rem]" : "max-w-[90%]")}>
                  <div
                    className={cn(
                      "rounded-2xl rounded-bl-md border px-3.5 py-2.5 text-sm leading-relaxed",
                      entry.error ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-border/80 bg-card",
                    )}
                  >
                    <ChatText text={entry.content} />
                    {entry.error && (
                      <button
                        type="button"
                        onClick={retry}
                        className="mt-2 rounded-full border border-destructive/30 px-3 py-1 text-xs font-medium transition hover:bg-destructive/10"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                  {entry.links && entry.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.links.map((link) => {
                        const meta = LINK_META[link.type];
                        return (
                          <Link
                            key={`${link.type}-${link.id}`}
                            to={`${meta.to}/${link.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-sand/60 bg-sand/10 px-3 py-1 text-xs font-medium text-sand-deep transition outline-none hover:bg-sand/25 focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            <meta.icon aria-hidden className="size-3.5" />
                            {link.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            )}

            {thinking && (
              <div role="status" aria-label="The assistant is typing" className="flex w-fit gap-1 rounded-2xl rounded-bl-md border border-border/80 bg-card px-4 py-3.5">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="size-2 animate-bounce rounded-full bg-sand-deep/70" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            )}

            {onlyWelcome && !thinking && (
              <div className="mt-1 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition outline-none hover:-translate-y-0.5 hover:border-sand hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border/70 bg-background p-3">
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={MAX_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a course, price, schedule…"
              className="field-sizing-content max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim() || thinking}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40"
            >
              <SendHorizontal className="size-4" />
            </button>
          </form>
          <p className="bg-background px-4 pb-2 text-center text-[0.65rem] text-muted-foreground">
            AI answers can be wrong — check the course page before applying.
          </p>
        </section>
      )}

      {/* Floating button */}
      <button
        type="button"
        aria-label={open ? "Close the assistant" : "Open the assistant"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="group fixed right-4 bottom-5 z-50 flex h-14 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-primary-foreground shadow-xl shadow-primary/30 transition duration-300 outline-none hover:-translate-y-0.5 hover:bg-primary/95 focus-visible:ring-3 focus-visible:ring-sand/60 sm:right-6"
      >
        {!open && onlyWelcome && (
          <span aria-hidden className="absolute -top-1 -right-1 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sand opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-3.5 rounded-full bg-sand" />
          </span>
        )}
        {open ? <X className="size-5" /> : <Sparkles className="size-5 text-sand transition-transform group-hover:rotate-12" />}
        <span className="text-sm font-semibold">{open ? "Close" : "Ask Andalusia"}</span>
      </button>
    </>
  );
}

export default ChatWidget;
