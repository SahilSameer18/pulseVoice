export const SUPPORTED_LANGUAGES = [
  {
    id: 'auto',
    name: 'Auto Detect',
    nativeName: 'Auto (Hindi / English)',
    flag: '🌐',
    code: 'auto',
    speechCode: 'hi-IN'
  },
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    code: 'en-US',
    speechCode: 'en-US'
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    code: 'hi-IN',
    speechCode: 'hi-IN'
  }
];

export const DEFAULT_LANGUAGE = 'auto';

export const getLanguageConfig = (langId) => {
  return SUPPORTED_LANGUAGES.find((l) => l.id === langId) || SUPPORTED_LANGUAGES[0];
};