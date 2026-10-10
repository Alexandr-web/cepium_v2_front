import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ACheckbox from "../../app/components/atoms/ACheckbox.vue";

const TooltipStub = {
	props: ["disabled"],
	template: "<div class=\"tooltip-stub\"><slot name=\"trigger\" /><slot name=\"content\" /></div>",
};

const stubs = {
	Tooltip: TooltipStub,
};

describe("ACheckbox", () => {
	it("рендерит label, если он передан", () => {
		const wrapper = mount(ACheckbox, {
			props: { label: "Запомнить меня" },
			global: { stubs },
		});

		expect(wrapper.text()).toContain("Запомнить меня");
	});

	it("не рендерит label, если он не передан", () => {
		const wrapper = mount(ACheckbox, {
			global: { stubs },
		});

		expect(wrapper.find("span").exists()).toBe(false);
	});

	it("переключает checked при клике", async () => {
		const wrapper = mount(ACheckbox, {
			global: { stubs },
		});

		await wrapper.trigger("click");

		expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
	});

	it("показывает галочку, когда checked", () => {
		const wrapper = mount(ACheckbox, {
			props: { modelValue: true },
			global: { stubs },
		});

		expect(wrapper.find("svg").exists()).toBe(true);
	});

	it("не показывает галочку, когда не checked", () => {
		const wrapper = mount(ACheckbox, {
			props: { modelValue: false },
			global: { stubs },
		});

		expect(wrapper.find("svg").exists()).toBe(false);
	});

	it("скрывает бокс при hideBox", () => {
		const wrapper = mount(ACheckbox, {
			props: { hideBox: true },
			global: { stubs },
		});

		expect(wrapper.find(".rounded-6").exists()).toBe(false);
	});

	it("применяет размер SMALL", () => {
		const wrapper = mount(ACheckbox, {
			props: { size: CheckboxSize.SMALL },
			global: { stubs },
		});

		const box = wrapper.find(".rounded-6");

		expect(box.classes()).toContain("w-16");
		expect(box.classes()).toContain("h-16");
	});

	it("применяет размер BIG", () => {
		const wrapper = mount(ACheckbox, {
			props: { size: CheckboxSize.BIG },
			global: { stubs },
		});

		const box = wrapper.find(".rounded-6");

		expect(box.classes()).toContain("w-24");
		expect(box.classes()).toContain("h-24");
	});

	it("применяет тему PRIMARY при checked", () => {
		const wrapper = mount(ACheckbox, {
			props: { modelValue: true, theme: CheckboxTheme.PRIMARY },
			global: { stubs },
		});

		expect(wrapper.find(".rounded-6").classes()).toContain("border-primary-400");
	});

	it("применяет тему NEUTRAL при checked", () => {
		const wrapper = mount(ACheckbox, {
			props: { modelValue: true, theme: CheckboxTheme.NEUTRAL },
			global: { stubs },
		});

		expect(wrapper.find(".rounded-6").classes()).toContain("border-neutral-400");
	});
});
