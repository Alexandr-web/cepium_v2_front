import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ATag from "../../app/components/atoms/ATag.vue";

describe("ATag", () => {
	it("рендерит label", () => {
		const wrapper = mount(ATag, {
			props: { label: "Binance" },
			global: { stubs: { AButton: true, IconCloseSmallOutlineRounded: true } },
		});

		expect(wrapper.text()).toContain("Binance");
	});

	it("эмитит remove при клике на кнопку", async () => {
		const wrapper = mount(ATag, {
			props: { label: "Binance" },
			global: { stubs: { AButton: true, IconCloseSmallOutlineRounded: true } },
		});

		await wrapper.find("a-button-stub").trigger("click");

		expect(wrapper.emitted("remove")).toHaveLength(1);
	});

	it("ренерит кнопку удаления", () => {
		const wrapper = mount(ATag, {
			props: { label: "Binance" },
			global: { stubs: { AButton: true, IconCloseSmallOutlineRounded: true } },
		});

		expect(wrapper.find("a-button-stub").exists()).toBe(true);
	});
});
