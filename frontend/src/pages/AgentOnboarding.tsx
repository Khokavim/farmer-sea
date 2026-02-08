import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextNew";
import { apiService } from "@/services/api";

const STORAGE_KEY = "farmsea_agent_state";
const DRAFT_SESSION_KEY = "farmsea_onboarding_session";
const ALLOWED_ROLES = ["buyer", "supplier", "farmer", "logistics"] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];
const isAllowedRole = (value: string): value is AllowedRole =>
  ALLOWED_ROLES.includes(value as AllowedRole);

const onboardingSteps: Record<string, string[]> = {
  buyer: [
    "Share what you want to source and your delivery timeline.",
    "Confirm preferred suppliers, grades, and pricing.",
    "Proceed to escrow checkout and tracking."
  ],
  supplier: [
    "Verify your business profile and distribution capacity.",
    "Upload inventory volumes, pricing tiers, and availability.",
    "Match buyers and set recurring supply contracts."
  ],
  farmer: [
    "Capture farm details, harvest calendar, and certifications.",
    "List produce, grades, and wholesale pricing.",
    "Connect with verified buyers and logistics scheduling."
  ],
  logistics: [
    "Register fleet capacity, lanes, and cold-chain capabilities.",
    "Verify insurance and service coverage.",
    "Receive shipping assignments and payouts."
  ]
};

const AgentOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string }[]>([]);
  const [agentInput, setAgentInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState("All changes saved");
  const [suggestedFields, setSuggestedFields] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    location: "",
    volume: "",
    routes: "",
    certifications: "",
    warehouse: "",
    fleetSize: "",
    notes: ""
  });

  const selectedRole = useMemo(() => {
    const roleParam = searchParams.get("role")?.toLowerCase();
    if (roleParam && isAllowedRole(roleParam)) {
      return roleParam;
    }
    return "buyer";
  }, [searchParams]);

  const steps = onboardingSteps[selectedRole] || onboardingSteps.buyer;

  const completion = useMemo(() => {
    const baseFields = [
      formState.name,
      formState.email,
      formState.phone,
      formState.businessName,
      formState.location
    ];
    const roleFields: string[] = [];
    if (selectedRole === "farmer") roleFields.push(formState.certifications);
    if (selectedRole === "supplier") roleFields.push(formState.warehouse);
    if (selectedRole === "logistics") roleFields.push(formState.routes, formState.fleetSize);
    if (selectedRole !== "buyer") roleFields.push(formState.volume);

    const allFields = [...baseFields, ...roleFields];
    const filled = allFields.filter((value) => Boolean(value?.trim())).length;
    const total = Math.max(allFields.length, 1);
    return Math.round((filled / total) * 100);
  }, [formState, selectedRole]);

  const isChecklistComplete = useMemo(() => {
    return [formState.name, formState.email, formState.phone, formState.location].every((value) =>
      Boolean(value?.trim())
    );
  }, [formState.name, formState.email, formState.phone, formState.location]);

  const sessionId = useMemo(() => {
    const existing = localStorage.getItem(DRAFT_SESSION_KEY);
    if (existing) return existing;
    const created = `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(DRAFT_SESSION_KEY, created);
    return created;
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed?.messages)) {
        setMessages(parsed.messages.slice(-6));
      }
      if (parsed?.formState) {
        setFormState((prev) => ({ ...prev, ...parsed.formState }));
      }
      if (parsed?.role && !searchParams.get("role")) {
        navigate(`/agent-onboarding?role=${parsed.role}`);
      }
    } catch (error) {
      console.warn("Failed to restore onboarding messages", error);
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await apiService.getOnboardingDraft({
          sessionId,
          email: formState.email || undefined
        });
        const draftData = (response as { data?: { data?: { data?: { formState?: typeof formState; messages?: typeof messages } } } })?.data?.data?.data;
        if (draftData) {
          setFormState((prev) => ({ ...prev, ...draftData.formState }));
          if (draftData.messages?.length) {
            setMessages(draftData.messages.slice(-6));
          }
        }
      } catch (error) {
        console.warn("Failed to load onboarding draft", error);
      }
    };
    loadDraft();
  }, [sessionId, formState.email]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ role: selectedRole, messages, formState })
    );
  }, [selectedRole, messages, formState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAutosaveStatus("Saving...");
      apiService.saveOnboardingDraft({
        sessionId,
        email: formState.email || undefined,
        role: selectedRole,
        data: { formState, messages }
      }).then(() => setAutosaveStatus("All changes saved"))
        .catch((error) => {
          console.warn("Failed to save draft", error);
          setAutosaveStatus("Autosave failed");
        });
    }, 600);

    return () => clearTimeout(timeout);
  }, [sessionId, formState, messages, selectedRole]);

  const handleAgentSend = async () => {
    const content = agentInput.trim();
    if (!content) return;
    const nextId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: nextId, sender: "user", text: content },
      { id: nextId + 1, sender: "agent", text: "Typing..." }
    ]);
    setAgentInput("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const contextLines = [
        formState.name && `Name: ${formState.name}`,
        formState.email && `Email: ${formState.email}`,
        formState.phone && `Phone: ${formState.phone}`,
        formState.businessName && `Business: ${formState.businessName}`,
        formState.location && `Location: ${formState.location}`,
        formState.volume && `Volume: ${formState.volume}`,
        formState.routes && `Routes: ${formState.routes}`,
        formState.fleetSize && `Fleet size: ${formState.fleetSize}`,
        formState.warehouse && `Warehouse: ${formState.warehouse}`,
        formState.certifications && `Certifications: ${formState.certifications}`,
        formState.notes && `Notes: ${formState.notes}`
      ].filter(Boolean);

      const history = messages.slice(-6).map((message) => ({
        role: message.sender === "agent" ? "assistant" : "user",
        content: message.text
      }));
      if (contextLines.length > 0) {
        history.unshift({
          role: "user",
          content: `Context for onboarding: ${contextLines.join(" | ")}.`
        });
      }
      const response = await apiService.chatWithAgent({ message: content, role: selectedRole, history }) as {
        data?: {
          reply?: string;
        };
      };
      const reply = response.data?.reply || "Tell me more about what you need so I can guide the next step.";
      const nameMatch = reply.match(/name\s*[:-]\s*([A-Za-z\s]+)/i);
      const emailMatch = reply.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const phoneMatch = reply.match(/(\+?\d[\d\s\-()]{8,}\d)/i);
      const businessMatch = reply.match(/business\s*[:-]\s*([^|,\n]+)/i);
      const locationMatch = reply.match(/location\s*[:-]\s*([^|,\n]+)/i);
      const volumeMatch = reply.match(/volume\s*[:-]\s*([^|,\n]+)/i);
      const routesMatch = reply.match(/routes?\s*[:-]\s*([^|,\n]+)/i);
      const fleetMatch = reply.match(/fleet\s*size\s*[:-]\s*([^|,\n]+)/i);
      const warehouseMatch = reply.match(/warehouse\s*[:-]\s*([^|,\n]+)/i);
      const certificationsMatch = reply.match(/certifications?\s*[:-]\s*([^|,\n]+)/i);
      const nextSuggestions: Record<string, string> = {};
      if (nameMatch && !formState.name) updateForm("name", nameMatch[1].trim());
      if (emailMatch && !formState.email) updateForm("email", emailMatch[0].trim());
      if (phoneMatch && !formState.phone) updateForm("phone", phoneMatch[0].trim());
      if (nameMatch) nextSuggestions.name = nameMatch[1].trim();
      if (emailMatch) nextSuggestions.email = emailMatch[0].trim();
      if (phoneMatch) nextSuggestions.phone = phoneMatch[0].trim();
      if (businessMatch) nextSuggestions.businessName = businessMatch[1].trim();
      if (locationMatch) nextSuggestions.location = locationMatch[1].trim();
      if (volumeMatch) nextSuggestions.volume = volumeMatch[1].trim();
      if (routesMatch) nextSuggestions.routes = routesMatch[1].trim();
      if (fleetMatch) nextSuggestions.fleetSize = fleetMatch[1].trim();
      if (warehouseMatch) nextSuggestions.warehouse = warehouseMatch[1].trim();
      if (certificationsMatch) nextSuggestions.certifications = certificationsMatch[1].trim();
      if (Object.keys(nextSuggestions).length > 0) {
        setSuggestedFields((prev) => ({ ...prev, ...nextSuggestions }));
      }
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { id: nextId + 1, sender: "agent", text: reply };
        return updated;
      });
    } catch (error: unknown) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          id: nextId + 1,
          sender: "agent",
          text: "I’m offline right now. Please try again in a moment."
        };
        return updated;
      });
      const message = error instanceof Error ? error.message : "Agent is offline right now. Try again soon.";
      setErrorMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const applySuggestion = (field: string, value: string) => {
    updateForm(field, value);
    setSuggestedFields((prev) => ({ ...prev, [field]: "" }));
  };

  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8f4ed]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-[#2b241e] px-3 py-1 text-xs font-semibold text-white">
              Agent-guided onboarding
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#2b241e]">
              {selectedRole === "buyer"
                ? "Let’s source the right produce"
                : `Let’s onboard your ${selectedRole} profile`}
            </h1>
            <p className="text-[#4f3b2f] max-w-xl">
              The Farmer Sea agent is already preparing your next steps. Review the plan below and continue when you’re ready.
            </p>

            <Card className="border-[#e5d8c5] bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">Your onboarding path</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step) => (
                  <div key={step} className="flex items-start gap-3 text-sm text-[#2b241e]">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#7c4a2f]" />
                    <span>{step}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#e5d8c5] bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">Agent summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#2b241e]">
                <p className="text-[#4f3b2f]">Your agent is tracking the details below to prefill signup.</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7c4a2f]">
                    <span>Onboarding completeness</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#efe4d4]">
                    <div
                      className="h-2 rounded-full bg-[#2b241e] transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#7c4a2f]">{autosaveStatus}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                    <div className="text-xs text-[#7c4a2f]">Name</div>
                    <div className="font-semibold">{formState.name || "Pending"}</div>
                    {suggestedFields.name && suggestedFields.name !== formState.name && (
                      <button
                        type="button"
                        onClick={() => applySuggestion("name", suggestedFields.name)}
                        className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                      >
                        Use suggested: {suggestedFields.name}
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                    <div className="text-xs text-[#7c4a2f]">Email</div>
                    <div className="font-semibold">{formState.email || "Pending"}</div>
                    {suggestedFields.email && suggestedFields.email !== formState.email && (
                      <button
                        type="button"
                        onClick={() => applySuggestion("email", suggestedFields.email)}
                        className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                      >
                        Use suggested: {suggestedFields.email}
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                    <div className="text-xs text-[#7c4a2f]">Phone</div>
                    <div className="font-semibold">{formState.phone || "Pending"}</div>
                    {suggestedFields.phone && suggestedFields.phone !== formState.phone && (
                      <button
                        type="button"
                        onClick={() => applySuggestion("phone", suggestedFields.phone)}
                        className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                      >
                        Use suggested: {suggestedFields.phone}
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                    <div className="text-xs text-[#7c4a2f]">Business</div>
                    <div className="font-semibold">{formState.businessName || "Pending"}</div>
                    {suggestedFields.businessName && suggestedFields.businessName !== formState.businessName && (
                      <button
                        type="button"
                        onClick={() => applySuggestion("businessName", suggestedFields.businessName)}
                        className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                      >
                        Use suggested: {suggestedFields.businessName}
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                    <div className="text-xs text-[#7c4a2f]">Location</div>
                    <div className="font-semibold">{formState.location || "Pending"}</div>
                    {suggestedFields.location && suggestedFields.location !== formState.location && (
                      <button
                        type="button"
                        onClick={() => applySuggestion("location", suggestedFields.location)}
                        className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                      >
                        Use suggested: {suggestedFields.location}
                      </button>
                    )}
                  </div>
                  {selectedRole === "logistics" && (
                    <>
                      <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                        <div className="text-xs text-[#7c4a2f]">Routes</div>
                        <div className="font-semibold">{formState.routes || "Pending"}</div>
                        {suggestedFields.routes && suggestedFields.routes !== formState.routes && (
                          <button
                            type="button"
                            onClick={() => applySuggestion("routes", suggestedFields.routes)}
                            className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                          >
                            Use suggested: {suggestedFields.routes}
                          </button>
                        )}
                      </div>
                      <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                        <div className="text-xs text-[#7c4a2f]">Fleet size</div>
                        <div className="font-semibold">{formState.fleetSize || "Pending"}</div>
                        {suggestedFields.fleetSize && suggestedFields.fleetSize !== formState.fleetSize && (
                          <button
                            type="button"
                            onClick={() => applySuggestion("fleetSize", suggestedFields.fleetSize)}
                            className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                          >
                            Use suggested: {suggestedFields.fleetSize}
                          </button>
                        )}
                      </div>
                      <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                        <div className="text-xs text-[#7c4a2f]">Cold-chain setup</div>
                        <div className="font-semibold">{formState.warehouse || "Pending"}</div>
                        {suggestedFields.warehouse && suggestedFields.warehouse !== formState.warehouse && (
                          <button
                            type="button"
                            onClick={() => applySuggestion("warehouse", suggestedFields.warehouse)}
                            className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                          >
                            Use suggested: {suggestedFields.warehouse}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                  {selectedRole === "supplier" && (
                    <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                      <div className="text-xs text-[#7c4a2f]">Warehouse</div>
                      <div className="font-semibold">{formState.warehouse || "Pending"}</div>
                      {suggestedFields.warehouse && suggestedFields.warehouse !== formState.warehouse && (
                        <button
                          type="button"
                          onClick={() => applySuggestion("warehouse", suggestedFields.warehouse)}
                          className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                        >
                          Use suggested: {suggestedFields.warehouse}
                        </button>
                      )}
                    </div>
                  )}
                  {selectedRole === "farmer" && (
                    <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                      <div className="text-xs text-[#7c4a2f]">Certifications</div>
                      <div className="font-semibold">{formState.certifications || "Pending"}</div>
                      {suggestedFields.certifications && suggestedFields.certifications !== formState.certifications && (
                        <button
                          type="button"
                          onClick={() => applySuggestion("certifications", suggestedFields.certifications)}
                          className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                        >
                          Use suggested: {suggestedFields.certifications}
                        </button>
                      )}
                    </div>
                  )}
                  {selectedRole !== "buyer" && selectedRole !== "logistics" && (
                    <div className="rounded-xl border border-[#e5d8c5] bg-white px-3 py-2">
                      <div className="text-xs text-[#7c4a2f]">Volume</div>
                      <div className="font-semibold">{formState.volume || "Pending"}</div>
                      {suggestedFields.volume && suggestedFields.volume !== formState.volume && (
                        <button
                          type="button"
                          onClick={() => applySuggestion("volume", suggestedFields.volume)}
                          className="mt-2 inline-flex rounded-full border border-[#e5d8c5] bg-[#f6efe6] px-2 py-1 text-[10px] font-semibold text-[#2b241e]"
                        >
                          Use suggested: {suggestedFields.volume}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e5d8c5] bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg">Pre-onboarding details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Full name</label>
                    <Input
                      value={formState.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Email address</label>
                    <Input
                      value={formState.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      placeholder="you@email.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Phone number</label>
                    <Input
                      value={formState.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                      placeholder="+234 801 234 5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Business / Cooperative</label>
                    <Input
                      value={formState.businessName}
                      onChange={(event) => updateForm("businessName", event.target.value)}
                      placeholder="Farm name or company"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Primary location</label>
                    <Input
                      value={formState.location}
                      onChange={(event) => updateForm("location", event.target.value)}
                      placeholder="State / City"
                    />
                  </div>
                </div>
                {selectedRole !== "buyer" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">
                      {selectedRole === "logistics" ? "Fleet coverage / routes" : "Available volume"}
                    </label>
                    <Input
                      value={selectedRole === "logistics" ? formState.routes : formState.volume}
                      onChange={(event) =>
                        updateForm(selectedRole === "logistics" ? "routes" : "volume", event.target.value)
                      }
                      placeholder={selectedRole === "logistics" ? "Lagos ↔ Jos, cold-chain" : "50 tonnes weekly"}
                    />
                  </div>
                )}
                {selectedRole === "logistics" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#4f3b2f]">Fleet size</label>
                      <Input
                        value={formState.fleetSize}
                        onChange={(event) => updateForm("fleetSize", event.target.value)}
                        placeholder="12 trucks"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#4f3b2f]">Cold-chain setup</label>
                      <Input
                        value={formState.warehouse}
                        onChange={(event) => updateForm("warehouse", event.target.value)}
                        placeholder="Reefer, warehouse location"
                      />
                    </div>
                  </div>
                )}
                {selectedRole === "supplier" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Warehouse / aggregation hub</label>
                    <Input
                      value={formState.warehouse}
                      onChange={(event) => updateForm("warehouse", event.target.value)}
                      placeholder="Jos aggregation hub"
                    />
                  </div>
                )}
                {selectedRole === "farmer" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4f3b2f]">Certifications</label>
                    <Input
                      value={formState.certifications}
                      onChange={(event) => updateForm("certifications", event.target.value)}
                      placeholder="NAFDAC, organic, cooperative ID"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#4f3b2f]">Notes for the agent</label>
                  <Textarea
                    value={formState.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    placeholder="Any constraints, preferred pricing, certifications, or special requests..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-[#e5d8c5] bg-white/80 p-4 text-sm text-[#2b241e]">
              <div className="text-xs font-semibold text-[#7c4a2f] uppercase tracking-wide">Before you continue</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Name", value: formState.name },
                  { label: "Email", value: formState.email },
                  { label: "Phone", value: formState.phone },
                  { label: "Location", value: formState.location }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${item.value ? "bg-[#2b241e]" : "bg-[#d6c7b5]"}`}
                    />
                    <span className="text-xs text-[#4f3b2f]">
                      {item.label}: {item.value ? "Ready" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="bg-[#2b241e] text-white hover:bg-[#1f1a16]"
                disabled={selectedRole !== "buyer" && !isChecklistComplete}
                onClick={() =>
                  selectedRole === "buyer"
                    ? navigate("/marketplace")
                    : navigate("/auth", {
                        state: {
                          defaultRole: selectedRole,
                          defaultProfile: {
                            name: formState.name,
                            email: formState.email,
                            phone: formState.phone,
                            businessName: formState.businessName,
                            location: formState.location
                          }
                        }
                      })
                }
              >
                {selectedRole === "buyer" ? "Browse marketplace" : "Continue onboarding"}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-[#2b241e] text-[#2b241e] hover:bg-[#2b241e] hover:text-white"
              >
                Back to home
              </Button>
            </div>
          </div>

          <Card className="border-[#e5d8c5] bg-white/90">
            <CardHeader className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#7c4a2f]" />
              <CardTitle className="text-lg">Recent agent conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm" data-testid="onboarding-chat-messages">
              {messages.length === 0 ? (
                <p className="text-[#4f3b2f]">Start a conversation on the home page to see your summary here.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    data-testid={`onboarding-message-${message.sender}`}
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-[#2b241e] text-white"
                        : "bg-white text-[#2b241e] border border-[#e5d8c5]"
                    }`}
                  >
                    {message.text}
                  </div>
                ))
              )}
              <div className="space-y-3 border-t border-[#e5d8c5] pt-4">
                <Textarea
                  data-testid="onboarding-chat-input"
                  value={agentInput}
                  onChange={(event) => setAgentInput(event.target.value)}
                  placeholder="Ask the agent to refine your onboarding plan..."
                />
                {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    data-testid="onboarding-chat-send"
                    className="bg-[#2b241e] text-white hover:bg-[#1f1a16]"
                    onClick={handleAgentSend}
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Continue with agent"}
                  </Button>
                  <Select value={selectedRole} onValueChange={(value) => navigate(`/agent-onboarding?role=${value}`)}>
                    <SelectTrigger className="sm:w-44">
                      <SelectValue placeholder="Switch role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALLOWED_ROLES.map((roleOption) => (
                        <SelectItem key={roleOption} value={roleOption}>
                          {roleOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgentOnboarding;
