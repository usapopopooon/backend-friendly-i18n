// @bf-i18n/vue - Vue integration for backend-friendly i18n

// Plugin
export {
  I18nPlugin,
  I18nInjectionKey,
  type I18nPluginOptions,
} from './plugin.js';

// Composables
export {
  useI18n,
  useTranslation,
  useLocale,
  type UseTranslationOptions,
  type UseTranslationReturn,
  type UseLocaleReturn,
} from './composables.js';

// Directive
export { vT } from './directive.js';

// Re-export core types for convenience
export type {
  I18n,
  I18nOptions,
  TranslateOptions,
  Translations,
} from '@bf-i18n/core';
