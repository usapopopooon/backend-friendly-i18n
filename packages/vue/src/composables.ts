import { inject, computed, ref, watchEffect, type ComputedRef } from 'vue';
import type { I18n, TranslateOptions } from '@bf-i18n/core';
import { I18nInjectionKey } from './plugin.js';

/**
 * Get the I18n instance from injection.
 * Throws if plugin is not installed.
 */
export function useI18n(): I18n {
  const i18n = inject(I18nInjectionKey);
  if (!i18n) {
    throw new Error('useI18n must be used after installing I18nPlugin');
  }
  return i18n;
}

export interface UseTranslationOptions {
  /**
   * Default scope for translations.
   */
  scope?: string | string[];
}

export interface UseTranslationReturn {
  /**
   * Translation function.
   */
  t: (key: string, options?: TranslateOptions) => string;

  /**
   * Current locale (reactive).
   */
  locale: ComputedRef<string>;

  /**
   * Set locale.
   */
  setLocale: (locale: string) => void;

  /**
   * Available locales.
   */
  availableLocales: string[];

  /**
   * I18n instance.
   */
  i18n: I18n;
}

/**
 * Composable for translations.
 */
export function useTranslation(options: UseTranslationOptions = {}): UseTranslationReturn {
  const i18n = useI18n();

  // Reactive locale ref that updates on I18n changes
  const localeRef = ref(i18n.locale);

  // Watch for locale changes
  watchEffect((onCleanup) => {
    const unsubscribe = i18n.onChange(() => {
      localeRef.value = i18n.locale;
    });
    onCleanup(unsubscribe);
  });

  const locale = computed(() => localeRef.value);

  const t = (key: string, translateOptions?: TranslateOptions): string => {
    // Access localeRef.value to make this reactive
    void localeRef.value;

    const mergedOptions: TranslateOptions = {
      ...translateOptions,
    };

    if (options.scope && !translateOptions?.scope) {
      mergedOptions.scope = options.scope;
    }

    return i18n.t(key, mergedOptions);
  };

  const setLocale = (newLocale: string): void => {
    i18n.locale = newLocale;
  };

  return {
    t,
    locale,
    setLocale,
    availableLocales: i18n.availableLocales,
    i18n,
  };
}

export interface UseLocaleReturn {
  /**
   * Current locale (reactive).
   */
  locale: ComputedRef<string>;

  /**
   * Available locales.
   */
  availableLocales: string[];

  /**
   * Set locale.
   */
  setLocale: (locale: string) => void;
}

/**
 * Composable for locale management only.
 */
export function useLocale(): UseLocaleReturn {
  const i18n = useI18n();

  const localeRef = ref(i18n.locale);

  watchEffect((onCleanup) => {
    const unsubscribe = i18n.onChange(() => {
      localeRef.value = i18n.locale;
    });
    onCleanup(unsubscribe);
  });

  const locale = computed(() => localeRef.value);

  const setLocale = (newLocale: string): void => {
    i18n.locale = newLocale;
  };

  return {
    locale,
    availableLocales: i18n.availableLocales,
    setLocale,
  };
}
