export type Language = {
  code: string;
  native: string;
  roman: string;
  /** "Choose your language", translated. */
  label: string;
  /** Short tagline, translated. */
  tagline: string;
  dir?: "rtl";
};

/** Supported languages — all major Indian scripts + English. */
export const LANGUAGES: Language[] = [
  { code: "en", native: "English", roman: "English", label: "Choose your language", tagline: "Your business, in your language." },
  { code: "hi", native: "हिन्दी", roman: "Hindi", label: "अपनी भाषा चुनें", tagline: "आपका व्यवसाय, आपकी भाषा में।" },
  { code: "mr", native: "मराठी", roman: "Marathi", label: "तुमची भाषा निवडा", tagline: "तुमचा व्यवसाय, तुमच्या भाषेत।" },
  { code: "bn", native: "বাংলা", roman: "Bengali", label: "আপনার ভাষা নির্বাচন করুন", tagline: "আপনার ব্যবসা, আপনার ভাষায়।" },
  { code: "ta", native: "தமிழ்", roman: "Tamil", label: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", tagline: "உங்கள் தொழில், உங்கள் மொழியில்." },
  { code: "te", native: "తెలుగు", roman: "Telugu", label: "మీ భాషను ఎంచుకోండి", tagline: "మీ వ్యాపారం, మీ భాషలో." },
  { code: "kn", native: "ಕನ್ನಡ", roman: "Kannada", label: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", tagline: "ನಿಮ್ಮ ವ್ಯಾಪಾರ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ." },
  { code: "ml", native: "മലയാളം", roman: "Malayalam", label: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക", tagline: "നിങ്ങളുടെ സംരംഭം, നിങ്ങളുടെ ഭാഷയിൽ." },
  { code: "gu", native: "ગુજરાતી", roman: "Gujarati", label: "તમારી ભાષા પસંદ કરો", tagline: "તમારો વ્યવસાય, તમારી ભાષામાં." },
  { code: "or", native: "ଓଡ଼ିଆ", roman: "Odia", label: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ", tagline: "ଆପଣଙ୍କ ବ୍ୟବସାୟ, ଆପଣଙ୍କ ଭାଷାରେ।" },
  { code: "pa", native: "ਪੰਜਾਬੀ", roman: "Punjabi", label: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", tagline: "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ, ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ।" },
  { code: "ur", native: "اردو", roman: "Urdu", label: "اپنی زبان منتخب کریں", tagline: "آپ کا کاروبار، آپ کی زبان میں۔", dir: "rtl" },
];

export const languageByCode = (code: string): Language =>
  LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];

/** "Continue" in every supported language. */
export const CONTINUE_LABEL: Record<string, string> = {
  en: "Continue",
  hi: "आगे बढ़ें",
  mr: "पुढे जा",
  bn: "চালিয়ে যান",
  ta: "தொடரவும்",
  te: "కొనసాగించండి",
  kn: "ಮುಂದುವರಿಸಿ",
  ml: "തുടരുക",
  gu: "આગળ વધો",
  or: "ଜାରି ରଖନ୍ତୁ",
  pa: "ਜਾਰੀ ਰੱਖੋ",
  ur: "جاری رکھیں",
};
