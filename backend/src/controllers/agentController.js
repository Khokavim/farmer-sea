const crypto = require('crypto');

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OLLAMA_MODEL = process.env.LOCAL_LLM_MODEL || process.env.OLLAMA_MODEL || 'qwen2.5:14b-instruct';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const API_BASE_URL = process.env.AGENT_API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const sessionStore = new Map();
const getSessionState = (sessionId) => {
  if (!sessionId) return null;
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, {
      token: null,
      user: null,
      pending: null,
      cart: [],
      lastProducts: [],
      lastOrderId: null
    });
  }
  return sessionStore.get(sessionId);
};

const normalizeRole = (value) => {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (['buyer', 'supplier', 'farmer', 'logistics'].includes(normalized)) return normalized;
  return null;
};

const extractFields = (text) => {
  const extracted = {};
  const lowered = text.toLowerCase();
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) extracted.email = emailMatch[0];

  const passwordMatch = text.match(/password\s*[:=]\s*([^\s,]+)/i);
  if (passwordMatch) extracted.password = passwordMatch[1];

  const nameMatch = text.match(/name\s*[:=]\s*([^,\n]+)/i);
  if (nameMatch) extracted.name = nameMatch[1].trim();

  const roleMatch = text.match(/\b(buyer|supplier|farmer|logistics)\b/i);
  if (roleMatch) extracted.role = normalizeRole(roleMatch[1]);

  const phoneMatch = text.match(/(\+?\d[\d\s\-()]{8,}\d)/i);
  if (phoneMatch) extracted.phone = phoneMatch[1].trim();

  const businessMatch = text.match(/business\s*name\s*[:=]\s*([^,\n]+)/i);
  if (businessMatch) extracted.businessName = businessMatch[1].trim();

  const locationMatch = text.match(/location\s*[:=]\s*([^,\n]+)/i);
  if (locationMatch) extracted.location = locationMatch[1].trim();

  const routeMatch = text.match(/route\s*[:=]\s*([^,\n]+)/i);
  if (routeMatch) extracted.route = routeMatch[1].trim();

  const vehicleMatch = text.match(/vehicle(s)?\s*(types)?\s*[:=]\s*([^,\n]+)/i);
  if (vehicleMatch) extracted.vehicleTypes = vehicleMatch[3].trim();

  const capacityMatch = text.match(/capacity\s*[:=]\s*([\d.]+)/i);
  if (capacityMatch) extracted.capacity = Number(capacityMatch[1]);

  const capacityUnitMatch = text.match(/capacity\s*[:=]\s*[\d.]+\s*([a-zA-Z]+)/i);
  if (capacityUnitMatch) extracted.capacityUnit = capacityUnitMatch[1].trim();

  const coldChainMatch = text.match(/cold[-\s]?chain\s*[:=]\s*(yes|no|true|false)/i);
  if (coldChainMatch) extracted.coldChain = ['yes', 'true'].includes(coldChainMatch[1].toLowerCase());

  const productMatch = text.match(/product\s*[:=]\s*([^,\n]+)/i);
  if (productMatch) extracted.product = productMatch[1].trim();

  if (!extracted.product) {
    const intentProductMatch = text.match(/\b(browse|search|find|need|compare|add to cart|add)\b\s+([^,.]+)/i);
    if (intentProductMatch) {
      const raw = intentProductMatch[2].trim();
      const cleaned = raw.split(/\b(in|for|to|with)\b/i)[0].trim();
      if (cleaned) extracted.product = cleaned;
    }
  }

  const quantityMatch = text.match(/quantity\s*[:=]\s*(\d+)/i) || text.match(/\b(\d+)\s*(tons|tonnes|bags|crates|kg|items)\b/i);
  if (quantityMatch) extracted.quantity = Number(quantityMatch[1]);

  const priceMatch = text.match(/price\s*[:=]\s*([\d.]+)/i);
  if (priceMatch) extracted.price = Number(priceMatch[1]);

  const categoryMatch = text.match(/category\s*[:=]\s*([^,\n]+)/i);
  if (categoryMatch) extracted.category = categoryMatch[1].trim();

  const stockMatch = text.match(/stock\s*[:=]\s*(\d+)/i);
  if (stockMatch) extracted.stock = Number(stockMatch[1]);

  const unitMatch = text.match(/unit\s*[:=]\s*([^,\n]+)/i);
  if (unitMatch) extracted.unit = unitMatch[1].trim();

  const descriptionMatch = text.match(/description\s*[:=]\s*([\s\S]+)/i);
  if (descriptionMatch) extracted.description = descriptionMatch[1].trim();

  const orderMatch = text.match(/order\s*(id)?\s*[:=#-]?\s*([A-Za-z0-9_-]+)/i);
  if (orderMatch) extracted.orderId = orderMatch[2];

  const dispatchMatch = text.match(/dispatch\s*(id)?\s*[:=#-]?\s*([A-Za-z0-9_-]+)/i);
  if (dispatchMatch) extracted.dispatchId = dispatchMatch[2];

  const waybillMatch = text.match(/waybill\s*[:=#-]?\s*([A-Za-z0-9_-]+)/i);
  if (waybillMatch) extracted.waybill = waybillMatch[1];

  const productIdMatch = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (productIdMatch) {
    extracted.productId = productIdMatch[0];
    const trimmed = text.trim();
    if (!extracted.orderId && (trimmed === productIdMatch[0] || /order\b/i.test(text))) {
      extracted.orderId = productIdMatch[0];
    }
  }

  const streetMatch = text.match(/street\s*[:=]\s*([^,\n]+)/i);
  if (streetMatch) extracted.street = streetMatch[1].trim();
  const cityMatch = text.match(/city\s*[:=]\s*([^,\n]+)/i);
  if (cityMatch) extracted.city = cityMatch[1].trim();
  const stateMatch = text.match(/state\s*[:=]\s*([^,\n]+)/i);
  if (stateMatch) extracted.state = stateMatch[1].trim();
  const zipMatch = text.match(/zip\s*code\s*[:=]\s*([^,\n]+)/i) || text.match(/zipcode\s*[:=]\s*([^,\n]+)/i);
  if (zipMatch) extracted.zipCode = zipMatch[1].trim();

  const bankNameMatch = text.match(/bank\s*name\s*[:=]\s*([^,\n]+)/i);
  if (bankNameMatch) extracted.bankName = bankNameMatch[1].trim();
  const bankCodeMatch = text.match(/bank\s*code\s*[:=]\s*([^,\n]+)/i);
  if (bankCodeMatch) extracted.bankCode = bankCodeMatch[1].trim();
  const accountNumberMatch = text.match(/account\s*number\s*[:=]\s*([^,\n]+)/i);
  if (accountNumberMatch) extracted.accountNumber = accountNumberMatch[1].trim();
  const accountNameMatch = text.match(/account\s*holder\s*name\s*[:=]\s*([^,\n]+)/i);
  if (accountNameMatch) extracted.accountName = accountNameMatch[1].trim();

  return extracted;
};

const callApi = async (path, { method = 'GET', token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
};

const ensureAuth = (session, collected) => {
  if (session?.token) return { ok: true };
  return {
    ok: false,
    reply:
      'You’re not logged in yet. Please share your email and password to log in, or say “sign me up” to create an account.',
    pending: { intent: 'login', collected }
  };
};

const intentRequirements = {
  signup: ['name', 'email', 'password', 'role'],
  login: ['email', 'password'],
  browse: ['product'],
  compare: ['product'],
  cart: [],
  checkout: ['street', 'city', 'state', 'zipCode'],
  payment_initialize: ['orderId'],
  track: ['orderId'],
  escrow_release: ['orderId'],
  return_refund: ['orderId'],
  dispute: ['orderId'],
  inventory_onboard: ['name', 'description', 'price', 'category', 'stock', 'unit'],
  inventory_update: ['productId'],
  accept_order: ['orderId'],
  schedule_pickup: ['orderId'],
  payout_setup: ['bankName', 'bankCode', 'accountNumber', 'accountName'],
  offer_capacity: ['route', 'capacity'],
  accept_dispatch: ['orderId'],
  shipment_tracking: [],
  proof_delivery: ['orderId'],
  profile_update: [],
  support: []
};

const buildMissingFieldsReply = (missing) => {
  return `I still need: ${missing.join(', ')}. Please share them in “field: value” format (e.g., product: tomatoes).`;
};

const collectMissingFields = (intent, collected) => {
  const required = intentRequirements[intent] || [];
  if (intent === 'cart') {
    if (!collected?.productId && !collected?.product) {
      return ['product or productId', 'quantity'];
    }
    return collected?.quantity ? [] : ['quantity'];
  }
  if (intent === 'shipment_tracking') {
    return collected?.orderId || collected?.waybill ? [] : ['orderId or waybill'];
  }
  if (intent === 'payment_initialize') {
    return collected?.orderId ? [] : ['orderId'];
  }
  return required.filter((field) => !collected?.[field]);
};

const findProductId = async (token, productName) => {
  if (!productName) return null;
  const response = await callApi(`/api/products?search=${encodeURIComponent(productName)}`, { token });
  const products = response?.data?.data?.products || response?.data?.data?.products || response?.data?.products;
  const first = Array.isArray(products) ? products[0] : null;
  return first?.id || null;
};

const handleIntentAction = async (intent, session, collected) => {
  if (!intent) return null;

  const orderIdIntents = new Set([
    'payment_initialize',
    'track',
    'accept_order',
    'schedule_pickup',
    'accept_dispatch',
    'escrow_release',
    'return_refund',
    'dispute',
    'proof_delivery'
  ]);
  if (orderIdIntents.has(intent) && !collected?.orderId && collected?.productId) {
    collected.orderId = collected.productId;
  }

  if (intent === 'signup') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }

    const response = await callApi('/api/auth/register', {
      method: 'POST',
      body: {
        name: collected.name,
        email: collected.email,
        password: collected.password,
        role: collected.role,
        phone: collected.phone,
        businessName: collected.businessName,
        location: collected.location
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Signup failed. Please confirm your details and try again.' };
    }
    session.token = response.data?.data?.token || null;
    session.user = response.data?.data?.user || null;
    session.pending = null;
    return { reply: 'Signup complete ✅. You can now browse products, add to cart, or place an order.' };
  }

  if (intent === 'login') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi('/api/auth/login', {
      method: 'POST',
      body: { email: collected.email, password: collected.password }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Login failed. Please confirm your email/password.' };
    }
    session.token = response.data?.data?.token || null;
    session.user = response.data?.data?.user || null;
    session.pending = null;
    return { reply: 'Logged in ✅. What would you like to do next?' };
  }

  if (['inventory_onboard', 'inventory_update', 'accept_order', 'schedule_pickup', 'checkout', 'payout_setup', 'offer_capacity', 'accept_dispatch', 'payment_initialize'].includes(intent)) {
    const authStatus = ensureAuth(session, collected);
    if (!authStatus.ok) return authStatus;
  }

  if (intent === 'browse' || intent === 'compare') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi(`/api/products?search=${encodeURIComponent(collected.product)}`, { token: session?.token });
    if (!response.ok) {
      return { reply: response.data?.message || 'I could not fetch products right now.' };
    }
    const products = response.data?.data?.products || response.data?.products || [];
    if (!products.length) {
      return { reply: 'No verified products found yet. Want me to broaden the search?' };
    }
    session.lastProducts = products.slice(0, 3).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: Array.isArray(product.images) ? product.images[0] : null
    }));
    const top = session.lastProducts
      .map((product) => `${product.name} (${product.price} per ${product.unit}) [${product.id}]`)
      .join(' • ');
    return {
      reply: `Here are top options: ${top}. Tell me which product ID to add to cart.`,
      products: session.lastProducts
    };
  }

  if (intent === 'cart') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    let productId = collected.productId;
    if (!productId && collected.product) {
      productId = await findProductId(session?.token, collected.product);
      if (!productId && session?.lastProducts?.length) {
        const match = session.lastProducts.find((item) => item.name.toLowerCase().includes(collected.product.toLowerCase()));
        productId = match?.id || null;
      }
    }
    if (!productId && session?.lastProducts?.length === 1) {
      productId = session.lastProducts[0].id;
    }
    if (!productId) {
      return { reply: 'I could not find that product. Please share a product ID or exact name.' };
    }
    const quantity = collected.quantity || 1;
    session.cart.push({ productId, quantity });
    return { reply: `Added to cart ✅ (product ${productId}, qty ${quantity}). Say “checkout” when ready.` };
  }

  if (intent === 'checkout') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    if (!session.cart.length) {
      return { reply: 'Your cart is empty. Tell me what to add to cart first.' };
    }
    const response = await callApi('/api/orders', {
      method: 'POST',
      token: session.token,
      body: {
        items: session.cart,
        shippingAddress: {
          street: collected.street,
          city: collected.city,
          state: collected.state,
          zipCode: collected.zipCode
        }
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Checkout failed. Please verify your address and cart items.' };
    }
    session.cart = [];
    const orderId = response.data?.data?.id || response.data?.data?.orderId;
    if (orderId) {
      session.lastOrderId = orderId;
    }
    return { reply: `Order created ✅. Your order ID is ${orderId}. Want to initialize payment or track delivery?` };
  }

  if (intent === 'track') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi(`/api/orders/${collected.orderId}`, { token: session?.token });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to fetch order status.' };
    }
    const status = response.data?.data?.status || 'pending';
    return { reply: `Order ${collected.orderId} status: ${status}. Want shipment ETA or to contact support?` };
  }

  if (intent === 'shipment_tracking') {
    const orderId = collected.orderId || collected.waybill || session?.lastOrderId;
    if (!orderId) {
      return { reply: buildMissingFieldsReply(['orderId or waybill']), pending: { intent, collected } };
    }
    const response = await callApi(`/api/shipments/${orderId}`, { token: session?.token });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to fetch shipment status.' };
    }
    return { reply: `Shipment status for ${orderId}: ${response.data?.data?.status || 'in progress'}.` };
  }

  if (intent === 'inventory_onboard') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi('/api/products', {
      method: 'POST',
      token: session.token,
      body: {
        name: collected.name,
        description: collected.description,
        price: collected.price,
        category: collected.category,
        stock: collected.stock,
        unit: collected.unit
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to create product.' };
    }
    return { reply: `Inventory created ✅ (product ${response.data?.data?.id || 'new'}).` };
  }

  if (intent === 'inventory_update') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi(`/api/products/${collected.productId}`, {
      method: 'PUT',
      token: session.token,
      body: {
        price: collected.price,
        stock: collected.stock,
        description: collected.description,
        unit: collected.unit
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to update product.' };
    }
    return { reply: 'Inventory updated ✅.' };
  }

  if (intent === 'accept_order' || intent === 'schedule_pickup') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const status = intent === 'accept_order' ? 'confirmed' : 'processing';
    const response = await callApi(`/api/orders/${collected.orderId}/status`, {
      method: 'PUT',
      token: session.token,
      body: { status }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to update order status.' };
    }
    return { reply: `Order ${collected.orderId} updated to ${status}.` };
  }

  if (intent === 'payout_setup') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi('/api/payouts/recipients/self', {
      method: 'POST',
      token: session.token,
      body: {
        accountNumber: collected.accountNumber,
        bankCode: collected.bankCode,
        name: collected.accountName
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to set up payout recipient.' };
    }
    return { reply: 'Payout recipient saved ✅.' };
  }

  if (intent === 'offer_capacity') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi('/api/logistics/capacity', {
      method: 'POST',
      token: session.token,
      body: {
        route: collected.route,
        vehicleTypes: collected.vehicleTypes,
        capacity: collected.capacity,
        capacityUnit: collected.capacityUnit,
        coldChain: collected.coldChain,
        notes: collected.notes
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to save capacity listing.' };
    }
    return { reply: 'Capacity listing saved ✅. We will notify you when a dispatch is ready.' };
  }

  if (intent === 'accept_dispatch') {
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi(`/api/shipments/${collected.orderId}/accept`, {
      method: 'POST',
      token: session.token
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to accept dispatch.' };
    }
    return { reply: `Dispatch accepted ✅ for order ${collected.orderId}.` };
  }

  if (intent === 'payment_initialize') {
    if (!collected.orderId && session?.lastOrderId) {
      collected.orderId = session.lastOrderId;
    }
    const missing = collectMissingFields(intent, collected);
    if (missing.length > 0) {
      return { reply: buildMissingFieldsReply(missing), pending: { intent, collected } };
    }
    const response = await callApi('/api/payments/paystack/initialize', {
      method: 'POST',
      token: session.token,
      body: { orderId: collected.orderId }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to initialize payment.' };
    }
    const authUrl = response.data?.data?.authorization_url;
    session.lastOrderId = collected.orderId;
    return {
      reply: authUrl
        ? `Payment initialized ✅. Use this link to complete payment: ${authUrl}`
        : 'Payment initialized ✅. Share the payment reference when done to verify.',
      paymentLink: authUrl || null
    };
  }

  if (intent === 'profile_update') {
    if (!session?.token) {
      return ensureAuth(session, collected);
    }
    const response = await callApi('/api/auth/profile', {
      method: 'PUT',
      token: session.token,
      body: {
        name: collected.name,
        phone: collected.phone,
        businessName: collected.businessName,
        location: collected.location
      }
    });
    if (!response.ok) {
      return { reply: response.data?.message || 'Unable to update profile.' };
    }
    return { reply: 'Profile updated ✅.' };
  }

  return { reply: intentReplies[intent] };
};

const roleGuidance = {
  buyer: 'Focus on sourcing produce, grades, pricing, delivery windows, escrow release. Collect product, quantity, location, timeline, budget, grade, and intended use (e.g., resale, processing, perishables). If a budget is provided, suggest feasible options within budget based on the stated goal. Never promise inventory; confirm availability is pending verification.',
  supplier: 'Focus on onboarding inventory, pricing tiers, verification, contracts. Collect product list, volumes, warehouse location, pricing, availability windows. Never approve verification; state compliance checks are required.',
  farmer: 'Focus on harvest details, certifications, listings, buyer matching. Collect crop type, quantity, harvest date, certifications, location. Never guarantee buyers; confirm matching is required.',
  logistics: 'Focus on fleet capacity, routes, cold-chain, delivery SLAs. Collect routes, capacity, vehicle types, cold-chain availability, insurance status. Never guarantee assignments; confirm dispatch review is required.'
};

const buildSystemPrompt = (role) => {
  const roleLine = role ? `The user role is ${role}.` : 'The user role is unknown.';
  const roleDetail = roleGuidance[role] || 'Ask clarifying questions to identify the user role and the transaction goal.';
  return `You are the Farmer Sea AI agent, guiding Nigerian agribusiness transactions end-to-end.
${roleLine}
${roleDetail}
If the user mentions a budget, suggest options they can buy within budget aligned to their goal.
Handle payments via escrow or approved payment links only. Do not allow cash on delivery. Never ask for raw card details.
Never fabricate suppliers, prices, inventory, or logistics details. If asked to fake or invent data, refuse and explain that only verified information can be used.
Stay concise, ask one clarifying question at a time, and end with a suggested next action.
Never discuss admin-only features. Use friendly, confident tone.`;
};

const callOllamaChat = async (messages) => {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error('ollama_request_failed');
  }

  const data = await response.json();
  const reply = data?.message?.content?.trim() || data?.response?.trim();
  if (!reply) {
    throw new Error('ollama_empty_response');
  }
  return reply;
};

const matchIntent = (text) => {
  const normalized = text.toLowerCase();
  const has = (phrase) => normalized.includes(phrase);

  if (has('sign me up') || has('sign up') || has('register') || has('create an account') || has('create account')) {
    return 'signup';
  }
  if (has('login') || has('log in') || has('sign in')) return 'login';
  if (has('browse') || has('search') || has('find') || has('look for') || has('need')) return 'browse';
  if (has('compare') || has('vs') || has('versus')) return 'compare';
  if (has('add to cart') || has('cart')) return 'cart';
  if (has('checkout') || has('place order') || has('buy now') || has('order now')) return 'checkout';
  if (has('pay') || has('payment') || has('initialize payment')) return 'payment_initialize';
  if (has('support') || has('contact') || has('help desk') || has('help')) return 'support';
  if (has('shipment') || has('track shipment') || has('waybill')) return 'shipment_tracking';
  if (has('track') || has('delivery status') || has('where is my order')) return 'track';
  if (has('escrow release') || has('release payment') || has('release escrow')) return 'escrow_release';
  if (has('return') || has('refund')) return 'return_refund';
  if (has('dispute') || has('chargeback') || has('issue with order')) return 'dispute';
  if (has('onboard inventory') || has('list inventory') || has('list product') || has('add inventory')) return 'inventory_onboard';
  if (has('update stock') || has('update pricing') || has('change price')) return 'inventory_update';
  if (has('accept order') || has('confirm order')) return 'accept_order';
  if (has('schedule pickup') || has('pickup') || has('collection')) return 'schedule_pickup';
  if (has('payout') || has('withdraw') || has('bank details')) return 'payout_setup';
  if (has('offer capacity') || has('fleet capacity')) return 'offer_capacity';
  if (has('accept dispatch') || has('dispatch') || has('assignment')) return 'accept_dispatch';
  if (has('proof of delivery') || has('pod')) return 'proof_delivery';
  if (has('profile') || has('update account') || has('change details')) return 'profile_update';
  return null;
};

const intentReplies = {
  signup:
    'Absolutely — I can help you register. Please share: name, email, password, and role (buyer/supplier/farmer/logistics).',
  login: 'To log you in, please share your email and password.',
  browse: 'Tell me the product you want to source (e.g., tomatoes).',
  compare: 'Tell me the product you want to compare suppliers for.',
  cart: 'Tell me which product to add to cart (name or product ID) and quantity.',
  checkout: 'Provide delivery address (street, city, state, zip code).',
  payment_initialize: 'Share the order ID to initialize payment (or just say “pay for my last order”).',
  track: 'Share your order ID to pull delivery status.',
  escrow_release: 'Share your order ID and confirm delivery was received.',
  return_refund: 'Share your order ID and a short issue summary.',
  dispute: 'Share your order ID and what went wrong.',
  inventory_onboard: 'Provide product details: name, description, price, category, stock, unit.',
  inventory_update: 'Provide product ID and fields to update (price, stock, description, unit).',
  accept_order: 'Share the order ID to accept.',
  schedule_pickup: 'Share the order ID, pickup location, and time window.',
  payout_setup: 'Provide bank name, bank code, account number, and account holder name.',
  offer_capacity: 'Share route, vehicle types, capacity, and cold-chain availability.',
  accept_dispatch: 'Share the dispatch ID to accept.',
  shipment_tracking: 'Share the order ID or waybill to track shipment.',
  proof_delivery: 'Share order ID and proof of delivery details.',
  profile_update: 'Tell me which profile details to update (name, phone, business name, location).',
  support: 'Describe the issue and include any relevant order ID.'
};

const callOpenAIChat = async (messages) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('openai_key_missing');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 220
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'openai_request_failed');
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error('openai_empty_response');
  }

  return reply;
};

const chatAgent = async (req, res) => {
  try {
    const { message, role, history, intentAnchor, sessionId } = req.body || {};
    if (!message) {
      return res.status(400).json({ success: false, message: 'message_required' });
    }

    const resolvedSessionId = sessionId || `fsess_${crypto.randomUUID()}`;
    const session = getSessionState(resolvedSessionId);
    const baseCollected = extractFields(message);
    const pendingCollected = session?.pending?.collected || {};
    const collected = { ...pendingCollected, ...baseCollected };
    const intent = session?.pending?.intent || matchIntent(message);

    const respond = (reply, extra = {}) => res.json({
      success: true,
      data: { reply, sessionId: resolvedSessionId, ...extra }
    });

    if (intent) {
      const actionResult = await handleIntentAction(intent, session, collected);
      if (actionResult?.pending) {
        session.pending = actionResult.pending;
      } else {
        session.pending = null;
      }
      if (actionResult?.reply) {
        return respond(actionResult.reply, {
          paymentLink: actionResult.paymentLink || null,
          products: actionResult.products || []
        });
      }
    }

    if (intent && intentReplies[intent]) {
      return respond(intentReplies[intent]);
    }

    const messages = [
      { role: 'system', content: buildSystemPrompt(role) }
    ];

    if (intentAnchor) {
      messages.push({
        role: 'system',
        content: `Intent anchor: ${intentAnchor}. Treat this as the primary task focus before the user input.`
      });
    }

    if (Array.isArray(history)) {
      history.slice(-8).forEach((entry) => {
        if (entry?.role && entry?.content) {
          messages.push({ role: entry.role, content: entry.content });
        }
      });
    }

    messages.push({ role: 'user', content: message });

    let reply;
    try {
      reply = await callOllamaChat(messages);
    } catch (error) {
      console.warn('Local LLM failed, falling back to OpenAI:', error);
      try {
        reply = await callOpenAIChat(messages);
      } catch (openaiError) {
        const messageText = openaiError instanceof Error ? openaiError.message : 'openai_request_failed';
        return res.status(500).json({ success: false, message: messageText });
      }
    }

    return respond(reply);
  } catch (error) {
    console.error('Agent chat error:', error);
    return res.status(500).json({ success: false, message: 'agent_chat_failed' });
  }
};

module.exports = { chatAgent };
