import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from '@bf-i18n/core';
import { I18nPlugin, I18nInjectionKey } from '../plugin.js';
import { useI18n, useTranslation, useLocale } from '../composables.js';
import { defineComponent, h } from 'vue';

describe('useI18n', () => {
  it('throws error when plugin is not installed', () => {
    const TestComponent = defineComponent({
      setup() {
        expect(() => useI18n()).toThrow(
          'useI18n must be used after installing I18nPlugin'
        );
        return () => h('div');
      },
    });

    mount(TestComponent);
  });

  it('returns i18n instance when plugin is installed', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
      },
    });

    let capturedI18n: ReturnType<typeof useI18n> | undefined;

    const TestComponent = defineComponent({
      setup() {
        capturedI18n = useI18n();
        return () => h('div');
      },
    });

    mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(capturedI18n).toBe(i18n);
  });
});

describe('useTranslation', () => {
  it('returns translation function and locale', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    let result: ReturnType<typeof useTranslation> | undefined;

    const TestComponent = defineComponent({
      setup() {
        result = useTranslation();
        return () => h('div');
      },
    });

    mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(result).toBeDefined();
    expect(result!.t('hello')).toBe('Hello');
    expect(result!.locale.value).toBe('en');
    expect(result!.availableLocales).toEqual(['en', 'ja']);
  });

  it('applies scope option', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: {
          messages: {
            greeting: 'Hello!',
          },
        },
      },
    });

    let result: ReturnType<typeof useTranslation> | undefined;

    const TestComponent = defineComponent({
      setup() {
        result = useTranslation({ scope: 'messages' });
        return () => h('div');
      },
    });

    mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(result!.t('greeting')).toBe('Hello!');
  });

  it('reacts to locale changes', async () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    const TestComponent = defineComponent({
      setup() {
        const { t, locale, setLocale } = useTranslation();
        return { t, locale, setLocale };
      },
      render() {
        return h('div', this.t('hello'));
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello');

    wrapper.vm.setLocale('ja');
    await nextTick();

    expect(wrapper.text()).toBe('こんにちは');
    expect(wrapper.vm.locale).toBe('ja');
  });
});

describe('useLocale', () => {
  it('returns locale management utilities', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    let result: ReturnType<typeof useLocale> | undefined;

    const TestComponent = defineComponent({
      setup() {
        result = useLocale();
        return () => h('div');
      },
    });

    mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(result).toBeDefined();
    expect(result!.locale.value).toBe('en');
    expect(result!.availableLocales).toEqual(['en', 'ja']);
    expect(typeof result!.setLocale).toBe('function');
  });

  it('setLocale changes the locale', async () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    const TestComponent = defineComponent({
      setup() {
        const { locale, setLocale } = useLocale();
        return { locale, setLocale };
      },
      render() {
        return h('div', this.locale);
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('en');

    wrapper.vm.setLocale('ja');
    await nextTick();

    expect(wrapper.text()).toBe('ja');
  });
});
