import type { Directive, DirectiveBinding } from 'vue';
import type { I18n } from '@bf-i18n/core';

interface TDirectiveElement extends HTMLElement {
  __i18nUnsubscribe?: () => void;
  __i18n?: I18n;
}

// Module-level storage for i18n instance (set by plugin)
let globalI18n: I18n | undefined;

/**
 * Set the global i18n instance for directive use.
 * Called by I18nPlugin during installation.
 */
export function setGlobalI18n(i18n: I18n): void {
  globalI18n = i18n;
}

/**
 * v-t directive for Vue.
 * Usage: v-t="'translation.key'" or v-t.html="'translation.key'"
 */
export const vT: Directive<TDirectiveElement, string> = {
  mounted(el, binding) {
    const i18n = globalI18n;
    if (!i18n) {
      console.warn('[bf-i18n] v-t directive requires I18nPlugin to be installed');
      return;
    }

    el.__i18n = i18n;
    updateElement(el, binding, i18n);

    // Subscribe to locale changes
    el.__i18nUnsubscribe = i18n.onChange(() => {
      updateElement(el, binding, i18n);
    });
  },

  updated(el, binding) {
    const i18n = el.__i18n;
    if (!i18n) return;

    updateElement(el, binding, i18n);
  },

  beforeUnmount(el) {
    if (el.__i18nUnsubscribe) {
      el.__i18nUnsubscribe();
      delete el.__i18nUnsubscribe;
    }
    delete el.__i18n;
  },
};

function updateElement(el: HTMLElement, binding: DirectiveBinding<string>, i18n: I18n): void {
  const key = binding.value;
  const translation = i18n.t(key);

  if (binding.modifiers.html) {
    el.innerHTML = translation;
  } else {
    el.textContent = translation;
  }
}
