export const LOCALES = [{{LOCALES_ARRAY}}] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = {{DEFAULT_LOCALE}}
