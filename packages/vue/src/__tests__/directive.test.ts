import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from '@bf-i18n/core';
import { I18nPlugin } from '../plugin.js';
import { defineComponent } from 'vue';

describe('vT directive', () => {
  it('translates element text content with string binding', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
      },
    });

    const TestComponent = defineComponent({
      template: '<div v-t="\'hello\'"></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello');
  });

  it('supports dynamic key binding', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { greeting: 'Hello!' },
      },
    });

    const TestComponent = defineComponent({
      template: '<div v-t="key"></div>',
      data() {
        return { key: 'greeting' };
      },
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello!');
  });

  it('sets innerHTML when using html modifier', () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { message: '<strong>Bold</strong> text' },
      },
    });

    const TestComponent = defineComponent({
      template: '<div v-t.html="\'message\'"></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.html()).toContain('<strong>Bold</strong>');
  });

  it('updates translation on locale change', async () => {
    const i18n = createI18n({
      defaultLocale: 'en',
      translations: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' },
      },
    });

    const TestComponent = defineComponent({
      template: '<div v-t="\'hello\'"></div>',
    });

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [[I18nPlugin, { i18n }]],
      },
    });

    expect(wrapper.text()).toBe('Hello');

    i18n.locale = 'ja';
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('こんにちは');
  });
});
