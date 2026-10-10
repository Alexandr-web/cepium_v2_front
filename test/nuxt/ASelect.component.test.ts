import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ASelect from "../../app/components/atoms/ASelect.vue";

const stubs = {
	LabelField: true,
	ACheckbox: true,
	IconKeyboardArrowDownRounded: true,
	Transition: false,
};

const items = [
	{ label: "Bybit", value: "bybit" },
	{ label: "Binance", value: "binance" },
];

describe("ASelect", () => {
	it("рендерит placeholder, когда ничего не выбрано", () => {
		const wrapper = mount(ASelect, {
			props: { items, placeholder: "Выберите биржу" },
			global: { stubs },
		});

		expect(wrapper.text()).toContain("Выберите биржу");
	});

	it("рендерит label выбранного элемента", () => {
		const wrapper = mount(ASelect, {
			props: { items, modelValue: "binance" },
			global: { stubs },
		});

		expect(wrapper.text()).toContain("Binance");
	});

	it("открывает список и показывает элементы при клике", async () => {
		const wrapper = mount(ASelect, {
			props: { items },
			global: { stubs },
		});

		await wrapper.find(".p-12").trigger("click");

		expect(wrapper.findAll("li").length).toBe(items.length);
	});

	it("выбирает элемент и эмитит update:modelValue", async () => {
		const wrapper = mount(ASelect, {
			props: { items },
			global: { stubs },
		});

		await wrapper.find(".p-12").trigger("click");
		await wrapper.findAll("li").at(1)?.trigger("click");

		expect(wrapper.emitted("update:modelValue")).toEqual([["binance"]]);
	});

	it("применяет opacity-50 и снимает cursor-pointer при disabled", () => {
		const wrapper = mount(ASelect, {
			props: { items, disabled: true },
			global: { stubs },
		});

		const root = wrapper.find(".relative");

		expect(root.classes()).toContain("opacity-50");
		expect(root.classes()).not.toContain("cursor-pointer");
	});
});
