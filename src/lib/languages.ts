export type Language = {
  code: string;
  native: string;
  roman: string;
  /** "Choose your language", translated — undefined falls back to English chrome. */
  label?: string;
  /** Short tagline, translated — undefined falls back to English chrome. */
  tagline?: string;
  dir?: "rtl";
};

export const EN_LABEL = "Choose your language";
export const EN_TAGLINE = "Your business, in your language.";

/**
 * Sarvam's full 23-language set (22 Indian + English).
 *
 * label/tagline are best-effort localizations; the four languages whose copy
 * could not be grounded in a reliable source (Kashmiri, Santali, Manipuri,
 * Bodo) intentionally have none, so the app falls back to English chrome
 * instead of showing unverified text. Replace with native-review strings
 * before shipping.
 */
export const LANGUAGES: Language[] = [
  /* ---- Core set ---- */
  { code: "en", native: "English", roman: "English", label: EN_LABEL, tagline: EN_TAGLINE },
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

  /* ---- Extended set (Sarvam 23-language coverage) ---- */
  { code: "as", native: "অসমীয়া", roman: "Assamese", label: "আপোনাৰ ভাষা বাছনি কৰক", tagline: "আপোনাৰ ব্যৱসায়, আপোনাৰ ভাষাত।" },
  { code: "ne", native: "नेपाली", roman: "Nepali", label: "आफ्नो भाषा छान्नुहोस्", tagline: "तपाईंको व्यवसाय, तपाईंकै भाषामा।" },
  { code: "kok", native: "कोंकणी", roman: "Konkani", label: "तुमची भास निवडात", tagline: "तुमचो धंदो, तुमच्या भाशेंत।" },
  { code: "ks", native: "کٲشُر", roman: "Kashmiri", dir: "rtl" },
  { code: "sd", native: "سنڌي", roman: "Sindhi", label: "پنھنجي ٻولي چونڊيو", tagline: "توهان جو ڪاروبار، توهان جي ٻوليءَ ۾۔", dir: "rtl" },
  { code: "sa", native: "संस्कृतम्", roman: "Sanskrit", label: "स्वभाषां चिनोतु", tagline: "तव व्यवसायः, तव भाषायाम्।" },
  { code: "sat", native: "ᱥᱟᱱᱛᱟᱲᱤ", roman: "Santali" },
  { code: "mni", native: "ꯃꯤꯇꯩꯂꯣꯟ", roman: "Manipuri" },
  { code: "brx", native: "बर'", roman: "Bodo" },
  { code: "mai", native: "मैथिली", roman: "Maithili", label: "अपन भाषा चुनू", tagline: "अहाँक व्यवसाय, अहाँक भाषामे।" },
  { code: "doi", native: "डोगरी", roman: "Dogri", label: "अपणी भाषा चुनो", tagline: "तुहाडा कारोबार, तुहाडी भाषा च।" },
];

export const languageByCode = (code: string): Language =>
  LANGUAGES.find((lang) => lang.code === code) ?? LANGUAGES[0];

/** Whether a language ships its own localized hero copy. */
export const hasLocalizedCopy = (lang: Language): boolean =>
  Boolean(lang.label && lang.tagline);

/** "Continue" in every supported language (falls back to English). */
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
  as: "আগুৱা যাওক",
  ne: "अगाडि बढ्नुहोस्",
  kok: "फुडें वचात",
  sd: "اڳتي وڌو",
  sa: "अग्रे गच्छ",
  mai: "आगू बढ़ू",
  doi: "आगे वज्जो",
};
