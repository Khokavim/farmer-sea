import { useEffect, useMemo, useState } from "react";
import { HeroButton } from "@/components/ui/hero-button";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import farmerImage from "@/assets/jos-farmer-potatoes.jpg";
import kitchenImage from "@/assets/restaurant-kitchen.jpg";
import { apiService } from "@/services/api";

const roles = [
  { id: "buyer", label: "Buyer", prompt: "I want to buy fresh produce for my business." },
  { id: "supplier", label: "Supplier", prompt: "I want to onboard and list bulk supply." },
  { id: "farmer", label: "Farmer", prompt: "I want to sell my harvest directly." },
  { id: "logistics", label: "Logistics", prompt: "I want to onboard my logistics fleet." }
];

const suggestionsByRole: Record<string, string[]> = {
  buyer: [
    "Find 2 tonnes of Irish potatoes",
    "Compare verified suppliers for tomatoes",
    "Set up a recurring supply contract",
    "Track delivery and escrow release",
    "Request cold-chain logistics"
  ],
  supplier: [
    "Onboard my cooperative with verified pricing",
    "List bulk supply availability",
    "Share weekly volume commitments",
    "Set buyer tiers and pricing",
    "Confirm delivery timelines"
  ],
  farmer: [
    "Register my harvest for the season",
    "Upload certifications and farm details",
    "Set pricing for bulk buyers",
    "Schedule pickups and deliveries",
    "Connect with verified logistics"
  ],
  logistics: [
    "Register my dispatch riders",
    "Share fleet routes and coverage",
    "Confirm cold-chain availability",
    "List capacity for weekly runs",
    "Coordinate delivery windows"
  ]
};

const STORAGE_KEY = "farmsea_agent_state";
const SESSION_STORAGE_KEY = "farmsea_agent_session_id";

const buildReply = (role: string, message: string) => {
  if (role === "buyer") {
    return `Got it. I can curate suppliers and open the marketplace for "${message}". Want fastest delivery or best price?`;
  }
  if (role === "supplier") {
    return `Perfect. I will guide your onboarding, verify inventory, and set your buyer tiers. Ready to share your volumes for "${message}"?`;
  }
  return `Great. I will set up your farm profile, harvest calendar, and buyer pricing. What quantities do you have for "${message}"?`;
};

const defaultMessages = {
  buyer: [
    { id: 1, sender: "agent", text: "Welcome to Farmer Sea. I can guide your entire transaction. What do you want to do today?" }
  ],
  supplier: [
    { id: 1, sender: "agent", text: "Welcome supplier. I can help you onboard inventory and pricing. What would you like to do first?" }
  ],
  farmer: [
    { id: 1, sender: "agent", text: "Welcome farmer. I can help list your harvest and connect buyers. What crop are you selling?" }
  ],
  logistics: [
    { id: 1, sender: "agent", text: "Welcome logistics partner. I can help register routes and capacity. What coverage do you offer?" }
  ]
};

const maskSensitiveText = (text: string) => {
  return text.replace(/(password\s*[:=]\s*)([^\s,]+)/gi, (_, label) => `${label}••••••••`);
};

const Hero = () => {
  const [role, setRole] = useState("buyer");
  const [prompt, setPrompt] = useState("");
  const [messagesByRole, setMessagesByRole] = useState<Record<string, {
    id: number;
    sender: string;
    text: string;
    metadata?: {
      paymentLink?: string | null;
      products?: Array<{ id: string; name: string; price: string; unit: string; image?: string | null }>;
    };
  }[]>>(
    defaultMessages
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rolePrompt = useMemo(() => roles.find((item) => item.id === role)?.prompt, [role]);
  const roleSuggestions = useMemo(() => suggestionsByRole[role] || suggestionsByRole.buyer, [role]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.role) {
        setRole(parsed.role);
      }
      if (parsed?.messagesByRole) {
        setMessagesByRole((prev) => ({ ...prev, ...parsed.messagesByRole }));
      }
    } catch (error) {
      console.warn("Failed to restore agent state", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ role, messagesByRole })
    );
  }, [role, messagesByRole]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
  }, [sessionId]);

  const handleSend = async (text?: string, intentAnchor?: string) => {
    const content = (text ?? prompt).trim();
    if (!content) return;
    const currentMessages = messagesByRole[role] || [];
    const nextId = currentMessages.length + 1;
    const maskedContent = maskSensitiveText(content);
    setMessagesByRole((prev) => ({
      ...prev,
      [role]: [
        ...(prev[role] || []),
        { id: nextId, sender: "user", text: maskedContent },
        { id: nextId + 1, sender: "agent", text: "Typing..." }
      ]
    }));
    setPrompt("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const history = (messagesByRole[role] || []).slice(-6).map((message) => ({
        role: message.sender === "agent" ? "assistant" : "user",
        content: message.text
      }));
      const response = await apiService.chatWithAgent({
        message: content,
        role,
        history,
        intentAnchor,
        sessionId: sessionId || undefined
      }) as {
        data?: {
          reply?: string;
          sessionId?: string;
          paymentLink?: string | null;
          products?: Array<{ id: string; name: string; price: string; unit: string; image?: string | null }>;
        };
      };
      const reply = response.data?.reply ?? buildReply(role, content);
      if (response.data?.sessionId && response.data?.sessionId !== sessionId) {
        setSessionId(response.data.sessionId);
      }
      setMessagesByRole((prev) => {
        const updated = [...(prev[role] || [])];
        updated[updated.length - 1] = {
          id: nextId + 1,
          sender: "agent",
          text: reply,
          metadata: {
            paymentLink: response.data?.paymentLink ?? null,
            products: response.data?.products || []
          }
        };
        return { ...prev, [role]: updated };
      });
    } catch (error: unknown) {
      setMessagesByRole((prev) => {
        const updated = [...(prev[role] || [])];
        updated[updated.length - 1] = { id: nextId + 1, sender: "agent", text: buildReply(role, content) };
        return { ...prev, [role]: updated };
      });
      const message = error instanceof Error ? error.message : "Agent is offline right now. Try again soon.";
      setErrorMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#f6f2ea]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f2] via-[#f4eee6] to-[#e4efe4]"></div>
        <img
          src={farmerImage}
          alt="Fresh harvest"
          className="absolute left-[-8%] bottom-8 w-[40%] max-w-xl rounded-[40px] object-cover opacity-35 shadow-2xl"
        />
        <img
          src={kitchenImage}
          alt="Restaurant kitchen"
          className="absolute right-10 top-20 w-[30%] max-w-md rounded-[32px] object-cover opacity-30 shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f2ea] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto flex min-h-[90vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase tracking-tight text-[#2b241e]">
              Your interactive marketplace.
            </h1>
            <p className="text-lg text-[#4f3b2f] max-w-2xl mx-auto">
              A unified digital marketplace that connects buyers, farmers, suppliers, and logistics partners, streamlining onboarding and driving trade from inquiry to delivery through intelligent interaction.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {roles.map((item) => (
              <button
                key={item.id}
                onClick={() => setRole(item.id)}
                data-testid={`role-button-${item.id}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  role === item.id
                    ? "border-[#2b241e] bg-[#2b241e] text-white"
                    : "border-[#d8cbb7] bg-white text-[#2b241e] hover:border-[#2b241e]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            id="agent-prompt"
            className="mt-6 mb-4 w-full max-w-3xl rounded-3xl border border-[#d8cbb7] bg-white/90 p-6 text-left shadow-lg"
          >
            <div
              data-testid="chat-messages"
              className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-2xl border border-[#efe3d1] bg-white/80 p-4"
            >
              {(messagesByRole[role] || []).map((message) => {
                const urls = message.sender === "agent"
                  ? (message.text.match(/https?:\/\/[^\s)]+/g) || [])
                  : [];
                const displayText = message.sender === "agent"
                  ? message.text.replace(/https?:\/\/[^\s)]+/g, "").replace(/\s+/g, " ").trim()
                  : message.text;
                return (
                <div
                  key={message.id}
                  data-testid={`chat-message-${message.sender}`}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      message.sender === "user"
                        ? "bg-[#2b241e] text-white"
                        : "bg-white text-[#2b241e] border border-[#e5d8c5]"
                    }`}
                  >
                    {displayText || message.text}
                    {message.sender === "agent" && message.metadata?.products?.length ? (
                      <div className="mt-3 space-y-2">
                        {message.metadata.products.map((product) => (
                          <div
                            key={product.id}
                            data-testid="chat-product-card"
                            className="flex items-center gap-3 rounded-xl border border-[#efe3d1] bg-[#fdf8f2] p-3"
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-[#e5d8c5]" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#2b241e]">{product.name}</p>
                              <p className="text-xs text-[#6b4f3f]">₦{product.price} per {product.unit}</p>
                              <p className="text-[10px] text-[#8a6b58]">ID: {product.id}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {message.sender === "agent" && (message.metadata?.paymentLink || urls.length > 0) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(message.metadata?.paymentLink ? [message.metadata.paymentLink] : urls).filter(Boolean).map((link) => (
                          <a
                            key={link}
                            data-testid="chat-link-button"
                            href={link || undefined}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-[#2b241e] bg-[#2b241e] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#1f1915]"
                          >
                            Open Farmer Sea Link
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
              })}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                data-testid="chat-input"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask the agent anything…"
                className="h-12 flex-1 rounded-xl border border-[#d8cbb7] bg-white px-4 text-sm text-[#2b241e] focus:outline-none focus:ring-2 focus:ring-[#7c4a2f]/40"
              />
              <HeroButton
                data-testid="chat-send"
                size="default"
                variant="accent"
                onClick={() => handleSend()}
                disabled={isSending}
              >
                {isSending ? "Sending" : "Send"}
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </HeroButton>
            </div>
            {errorMessage && (
              <p className="mt-3 text-xs text-red-600">{errorMessage}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {roleSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSend(item, item)}
                  className="rounded-full border border-[#d8cbb7] bg-[#fdf8f2] px-3 py-1 text-xs text-[#4f3b2f] hover:border-[#7c4a2f]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
