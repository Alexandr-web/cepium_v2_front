import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ProgressBar from "../../app/components/atoms/ProgressLine.vue";

describe("ProgressBar", () => {
	describe("рендеринг", () => {
		it("рендерит контейнер прогресса", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 50, max: 100 },
			});

			const container = wrapper.find(".w-full.h-6.rounded-12.bg-white\\/5");
			expect(container.exists()).toBe(true);
		});

		it("рендерит внутренний заполнитель с правильной шириной", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 30, max: 100 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.exists()).toBe(true);
			expect(fill.attributes("style")).toContain("width: 30%");
		});
	});

	describe("вычисление процента", () => {
		it("вычисляет 0% при value = 0", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 0, max: 100 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 0%");
		});

		it("вычисляет 100% при value = max", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 100, max: 100 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 100%");
		});

		it("вычисляет дробный процент правильно", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 33, max: 100 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 33%");
		});

		it("работает с нецелыми значениями", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 2.5, max: 10 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 25%");
		});
	});

	describe("слот footer", () => {
		it("рендерит содержимое слота footer", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 40, max: 100 },
				slots: {
					footer: "<span data-testid=\"footer-text\">Прогресс: {{ percent * 100 }}%</span>",
				},
			});

			const footer = wrapper.find("[data-testid=\"footer-text\"]");
			expect(footer.exists()).toBe(true);
			expect(footer.text()).toBe("Прогресс: 40%");
		});

		it("передаёт в слот правильный объект percent", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 75, max: 200 },
				slots: {
					footer: `<template #footer="{ percent }">
            <span data-testid="percent-display">{{ percent }}</span>
          </template>`,
				},
			});

			const display = wrapper.find("[data-testid=\"percent-display\"]");
			expect(display.text()).toBe("0.375");
		});

		it("если слот не передан, ничего не рендерится (или просто пусто)", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 50, max: 100 },
			});

			// В слоте footer ничего нет, значит, внутри .flex-col.gap-8 должен быть только один дочерний элемент (полоса)
			const children = wrapper.find(".flex-col.gap-8").element.children;
			// Убедимся, что только один элемент (сам прогресс-бар)
			expect(children.length).toBe(1);
			// Или проверим, что нет элементов с классом из слота
			expect(wrapper.find("[data-testid=\"footer-text\"]").exists()).toBe(false);
		});
	});

	describe("обработка крайних случаев", () => {
		it("при max = 0 возвращает 0% (без деления на ноль)", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: 50, max: 0 },
			});
			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 0%");
		});

		it("при отрицательных значениях (value < 0) процент становится отрицательным", () => {
			const wrapper = mount(ProgressBar, {
				props: { value: -10, max: 100 },
			});

			const fill = wrapper.find(".bg-tertiary-800");
			expect(fill.attributes("style")).toContain("width: 0%");
		});
	});
});
