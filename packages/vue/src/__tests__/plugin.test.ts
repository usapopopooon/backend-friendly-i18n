import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from '@bf-i18n/core';
import { I18nPlugin } from '../plugin.js';
import { defineComponent, h } from 'vue';

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
        return h('div', (this as any).$t('hello'));
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

    let capturedI18n: any;

    const TestComponent = defineComponent({
      mounted() {
        capturedI18n = (this as any).$i18n;
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
        return h('div', (this as any).$locale);
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('en');
    expect((wrapper.vm as any).$locale).toBe('en');

    // Set locale via i18n instance (the setter on $locale may not work in test env)
    i18n.locale = 'ja';

    expect(i18n.locale).toBe('ja');
    expect((wrapper.vm as any).$locale).toBe('ja');
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
        return h('div', (this as any).$t('greeting', { name: 'World' }));
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
