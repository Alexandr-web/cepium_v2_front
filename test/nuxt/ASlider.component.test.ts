import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ASlider from "../../app/components/atoms/ASlider.vue";

const SliderStub = {
	name: "Slider",
	props: ["modelValue", "min", "max", "showTooltip", "format"],
	template: "<div class=\"slider-stub\" :data-min=\"min\" :data-max=\"max\" :data-value=\"modelValue\" />",
};

describe("ASlider", () => {
	it("рендерит слайдер", () => {
		const wrapper = mount(ASlider, {
			props: { label: "Риск" },
			global: { stubs: { LabelField: true, Slider: SliderStub } },
		});

		expect(wrapper.find(".slider-stub").exists()).toBe(true);
	});

	it("передаёт min и max слайдеру", () => {
		const wrapper = mount(ASlider, {
			props: { label: "Риск", min: 10, max: 90 },
			global: { stubs: { LabelField: true, Slider: SliderStub } },
		});

		const slider = wrapper.find(".slider-stub");

		expect(slider.attributes("data-min")).toBe("10");
		expect(slider.attributes("data-max")).toBe("90");
	});

	it("передаёт modelValue слайдеру", () => {
		const wrapper = mount(ASlider, {
			props: { label: "Риск", modelValue: 25 },
			global: { stubs: { LabelField: true, Slider: SliderStub } },
		});

		expect(wrapper.find(".slider-stub").attributes("data-value")).toBe("25");
	});
});
