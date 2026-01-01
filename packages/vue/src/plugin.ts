import type { App, InjectionKey } from 'vue';
import { I18n, createI18n, type I18nOptions } from '@bf-i18n/core';
import { vT, setGlobalI18n } from './directive.js';

/**
 * Injection key for I18n instance.
 */
export const I18nInjectionKey: InjectionKey<I18n> = Symbol('bf-i18n');

export interface I18nPluginOptions {
  /**
   * Existing I18n instance.
   */
  i18n?: I18n;

  /**
   * Options to create a new I18n instance.
   * Ignored if i18n is provided.
   */
  options?: I18nOptions;
}

/**
 * Vue plugin for bf-i18n.
 */
export const I18nPlugin = {
  install(app: App, pluginOptions: I18nPluginOptions): void {
    let i18n: I18n;

    if (pluginOptions.i18n) {
      i18n = pluginOptions.i18n;
    } else if (pluginOptions.options) {
      i18n = createI18n(pluginOptions.options);
    } else {
      throw new Error(
        'I18nPlugin requires either an i18n instance or options to create one'
      );
    }

    // Provide I18n instance for injection
    app.provide(I18nInjectionKey, i18n);

    // Set global i18n for directive
    setGlobalI18n(i18n);

    // Add global properties
    app.config.globalProperties.$t = (key: string, options?: Record<string, unknown>) => {
      return i18n.t(key, options);
    };

    app.config.globalProperties.$i18n = i18n;

    // Add $locale as getter/setter
    Object.defineProperty(app.config.globalProperties, '$locale', {
      get: () => i18n.locale,
      set: (value: string) => {
        i18n.locale = value;
      },
    });

    // Register v-t directive
    app.directive('t', vT);
  },
};

/**
 * Augment Vue types for global properties.
 */
declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, options?: Record<string, unknown>) => string;
    $i18n: I18n;
    $locale: string;
  }
}
