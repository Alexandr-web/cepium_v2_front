import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AImage from "../../app/components/atoms/AImage.vue";

describe("AImage", () => {
	it("рендерит img с src, когда src задан", () => {
		const wrapper = mount(AImage, {
			props: { isNuxtImg: false },
			attrs: { src: "/coin.png", alt: "coin" },
		});

		const img = wrapper.find("img");

		expect(img.exists()).toBe(true);
		expect(img.attributes("src")).toBe("/coin.png");
	});

	it("показывает fallback COIN, когда src не задан", () => {
		const wrapper = mount(AImage, {
			props: { isNuxtImg: false, preset: ImagePreset.COIN },
			global: { stubs: { IconCoinsDollar: true } },
		});

		expect(wrapper.find("img").exists()).toBe(false);
		expect(wrapper.find(".bg-primary-300").exists()).toBe(true);
	});

	it("показывает fallback AVATAR, когда src не задан", () => {
		const wrapper = mount(AImage, {
			props: { isNuxtImg: false, preset: ImagePreset.AVATAR },
		});

		expect(wrapper.find("img").exists()).toBe(false);
		expect(wrapper.find("svg").exists()).toBe(true);
	});

	it("применяет классы пресета COIN", () => {
		const wrapper = mount(AImage, {
			props: { isNuxtImg: false, preset: ImagePreset.COIN },
			attrs: { src: "/coin.png" },
		});

		expect(wrapper.find("img").classes()).toContain("object-contain");
	});

	it("применяет классы пресета AVATAR", () => {
		const wrapper = mount(AImage, {
			props: { isNuxtImg: false, preset: ImagePreset.AVATAR },
			attrs: { src: "/avatar.png" },
		});

		expect(wrapper.find("img").classes()).toContain("object-cover");
	});
});
