export const CityOptions = [
  { key: 'გორი', label: 'გორი' },
  { key: 'ბათუმი', label: 'ბათუმი' },
  { key: 'თელავი', label: 'თელავი' },
  { key: 'ქობული', label: 'ქობული' },
  { key: 'რუსთავი', label: 'რუსთავი' },
  { key: 'თბილისი', label: 'თბილისი' },
  { key: 'ქუთაისი', label: 'ქუთაისი' },
  { key: 'ქუთაისი', label: 'ქუთაისი' }
]

export const CityObjects = CityOptions.reduce(
  (acc, city) => {
    acc[city.key] = city
    return acc
  },
  {} as Record<string, (typeof CityOptions)[0]>
)

export const LicenseCategoryOptions = [
  { key: 'B', label: 'B (მექანიკა)' },
  { key: 'B1', label: 'B1 (ავტომატიკა)' }
]

export const LicenseCategoryObjects = LicenseCategoryOptions.reduce(
  (acc, category) => {
    acc[category.key] = category
    return acc
  },
  {} as Record<string, (typeof LicenseCategoryOptions)[0]>
)

export const LanguageOptions = [
  { key: 'ka', label: '🇬🇪 ქართული' },
  { key: 'en', label: '🇺🇸 English' },
  { key: 'ru', label: '🇷🇺 Русский' },
  { key: 'az', label: '🇦🇿 Azərbaycan dili' },
  { key: 'tr', label: '🇹🇷 Türkçe' },
  { key: 'de', label: '🇩🇪 Deutsch' },
  { key: 'fr', label: '🇫🇷 Français' },
  { key: 'es', label: '🇪🇸 Español' },
  { key: 'it', label: '🇮🇹 Italiano' },
  { key: 'pt', label: '🇵🇹 Português' },
  { key: 'ar', label: '🇸🇦 العربية' },
  { key: 'zh', label: '🇨🇳 中文' },
  { key: 'ja', label: '🇯🇵 日本語' },
  { key: 'ko', label: '🇰🇷 한국어' },
  { key: 'hi', label: '🇮🇳 हिन्दी' }
]

export const LanguageObjects = LanguageOptions.reduce(
  (acc, language) => {
    acc[language.key] = language
    return acc
  },
  {} as Record<string, (typeof LanguageOptions)[0]>
)
