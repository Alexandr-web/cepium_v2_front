import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import LabelField from "../../app/components/atoms/LabelField.vue";

const TooltipStub = {
	props: ["disabled"],
	template: "<div class=\"tooltip-stub\"><slot name=\"trigger\" /><slot name=\"content\" /></div>",
};

const stubs = {
	Tooltip: TooltipStub,
	IconHelpRounded: true,
};

describe("LabelField", () => {
	it("рендерит label", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя" },
			global: { stubs },
		});

		expect(wrapper.find("h3").text()).toBe("Имя");
	});

	it("рендерит count", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя", count: 42 },
			global: { stubs },
		});

		expect(wrapper.find("p").text()).toBe("(42)");
	});

	it("не рендерит count, когда он равен 0", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя" },
			global: { stubs },
		});

		expect(wrapper.find("p").exists()).toBe(false);
	});

	it("применяет класс ошибки к label при наличии error", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя", error: "Обязательное поле" },
			global: { stubs },
		});

		expect(wrapper.find("h3").classes()).toContain("text-secondary-500");
	});

	it("применяет класс по умолчанию без ошибки", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя" },
			global: { stubs },
		});

		expect(wrapper.find("h3").classes()).toContain("text-primary-700");
	});

	it("не рендерит тултип без tooltipText", () => {
		const wrapper = mount(LabelField, {
			props: { label: "Имя" },
			global: { stubs },
		});

		expect(wrapper.find(".tooltip-stub").exists()).toBe(false);
	});
});
