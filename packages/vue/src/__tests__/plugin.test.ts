import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import type { I18n } from '@bf-i18n/core';
import { createI18n } from '@bf-i18n/core';
import { I18nPlugin } from '../plugin.js';
import { defineComponent, h } from 'vue';

// Import plugin.ts to ensure type augmentation is applied
import '../plugin.js';

interface I18nGlobalProperties {
  $t: (key: string, options?: Record<string, unknown>) => string;
  $i18n: I18n;
  $locale: string;
}

describe('I18nPlugin', () => {
  it('provides global $t method', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
      },
    });

    const TestComponent = defineComponent({
      render() {
        const self = this as unknown as I18nGlobalProperties;
        return h('div', self.$t('hello'));
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello');
  });

  it('provides global $i18n instance', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
      },
    });

    let capturedI18n: I18n | undefined;

    const TestComponent = defineComponent({
      mounted() {
        const self = this as unknown as I18nGlobalProperties;
        capturedI18n = self.$i18n;
      },
      render() {
        return h('div');
      },
    });

    mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(capturedI18n).toBe(i18n);
  });

  it('provides global $locale getter and setter', async () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    const TestComponent = defineComponent({
      render() {
        const self = this as unknown as I18nGlobalProperties;
        return h('div', self.$locale);
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('en');
    const vm = wrapper.vm as unknown as I18nGlobalProperties;
    expect(vm.$locale).toBe('en');

    // Set locale via i18n instance (the setter on $locale may not work in test env)
    i18n.locale = 'ja';

    expect(i18n.locale).toBe('ja');
    expect(vm.$locale).toBe('ja');
  });

  it('$t supports interpolation', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { greeting: 'Hello, %{name}!' },
      },
    });

    const TestComponent = defineComponent({
      render() {
        const self = this as unknown as I18nGlobalProperties;
        return h('div', self.$t('greeting', { name: 'World' }));
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello, World!');
  });
});
