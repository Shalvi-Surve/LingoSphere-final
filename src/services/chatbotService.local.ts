// src/services/chatbotService.local.ts
// Lightweight multilingual conversational bot – responds naturally in user's language.

export type SupportedLang = "en" | "es" | "fr" | "de" | "hi";

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  intent?: string;
}

let currentLang: SupportedLang = "en";

const nowId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const nameToLang: Record<string, SupportedLang> = {
  english: "en",
  hindi: "hi",
  spanish: "es",
  french: "fr",
  german: "de",
  deutsch: "de",
};

// 🔹 Detect input language (basic regex)
function detectLanguage(text: string): SupportedLang {
  const t = text.trim();
  if (/\p{Script=Devanagari}/u.test(t)) return "hi";
  if (/[äöüÄÖÜß]/.test(t)) return "de";
  if (/[ñÑ¡¿]|[áéíóúÁÉÍÓÚ]/.test(t)) return "es";
  if (/[çœéèàùâêîôû]/i.test(t)) return "fr";
  return "en";
}

function extractRequestedLanguage(text: string): SupportedLang | null {
  const lower = text.toLowerCase();
  const match = lower.match(/\b(in|reply|answer)\s+in\s+([a-z]+)/);
  if (match) {
    const langName = match[2];
    for (const key in nameToLang) {
      if (langName.includes(key)) return nameToLang[key];
    }
  }
  return null;
}

// 🔹 Simple intent recognition
function detectIntent(text: string) {
  const t = text.toLowerCase();

  if (/\b(who are you|your name|comment tu t'appelles|wie heißt du|तुम्हारा नाम)\b/.test(t))
    return "name";
  if (/\b(hello|hi|hola|bonjour|hallo|नमस्ते)\b/.test(t)) return "greet";
  if (/\b(good night|bonne nuit|buenas noches|gute nacht|शुभ रात्रि)\b/.test(t)) return "good-night";
  if (/\b(good morning|buenos días|bonjour|guten morgen|शुभ प्रभात)\b/.test(t))
    return "good-morning";

  return "fallback";
}

// 🔹 Replies database (short & natural)
const replies: Record<string, Record<SupportedLang, string>> = {
  greet: {
    en: "Hello!",
    es: "¡Hola!",
    fr: "Bonjour !",
    de: "Hallo!",
    hi: "नमस्ते!",
  },
  name: {
    en: "I am LingoBot.",
    es: "Soy LingoBot.",
    fr: "Je m'appelle LingoBot.",
    de: "Ich heiße LingoBot.",
    hi: "मेरा नाम लिंगोबॉट है।",
  },
  "good-night": {
    en: "Good night!",
    es: "¡Buenas noches!",
    fr: "Bonne nuit !",
    de: "Gute Nacht!",
    hi: "शुभ रात्रि!",
  },
  "good-morning": {
    en: "Good morning!",
    es: "¡Buenos días!",
    fr: "Bonjour !",
    de: "Guten Morgen!",
    hi: "शुभ प्रभात!",
  },
  fallback: {
    en: "I'm here to chat! Ask me something else.",
    es: "¡Estoy aquí para charlar! Pregúntame algo más.",
    fr: "Je suis là pour discuter ! Pose-moi une autre question.",
    de: "Ich bin hier zum Plaudern! Frag mich etwas anderes.",
    hi: "मैं बातचीत के लिए यहाँ हूँ! कुछ और पूछें।",
  },
};

// 🔹 Generate reply in proper language
function generateReply(intent: string, lang: SupportedLang) {
  return replies[intent]?.[lang] || replies["fallback"][lang];
}

/* ------------------------ API ------------------------ */
async function sendWelcomeMessage() {
  return {
    id: nowId("bot"),
    text: "👋 Hello! I'm ready to chat with you in any language.",
    isBot: true,
    timestamp: new Date(),
  };
}

async function sendMessage(userText: string) {
  const explicitLang = extractRequestedLanguage(userText);
  const detectedLang = detectLanguage(userText);
  const lang = explicitLang || detectedLang || currentLang;
  currentLang = lang;

  const intent = detectIntent(userText);
  const reply = generateReply(intent, lang);

  return {
    messages: [
      { id: nowId("user"), text: userText, isBot: false, timestamp: new Date() },
      { id: nowId("bot"), text: reply, isBot: true, timestamp: new Date(), intent },
    ],
  };
}

function resetSession() {
  currentLang = "en";
}

export const chatbotService = { sendWelcomeMessage, sendMessage, resetSession };
