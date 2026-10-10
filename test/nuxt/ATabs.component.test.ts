import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ATabs from "../../app/components/atoms/ATabs.vue";

const items = [
	{ label: "Спот", value: "spot" },
	{ label: "Фьючерсы", value: "futures" },
	{ label: "Настройки", value: "settings" },
];

describe("ATabs", () => {
	it("рендерит все элементы списка", () => {
		const wrapper = mount(ATabs, {
			props: { items, activeValue: "spot" },
		});

		expect(wrapper.findAll("li").map((li) => li.text())).toEqual(["Спот", "Фьючерсы", "Настройки"]);
	});

	it("помечает активный элемент", () => {
		const wrapper = mount(ATabs, {
			props: { items, activeValue: "spot" },
		});

		const active = wrapper.findAll("li").at(0);
		const inactive = wrapper.findAll("li").at(1);

		expect(active?.classes()).toContain("bg-primary-300/20");
		expect(inactive?.classes()).not.toContain("bg-primary-300/20");
	});

	it("эмитит select с value при клике по элементу", async () => {
		const wrapper = mount(ATabs, {
			props: { items, activeValue: "spot" },
		});

		await wrapper.findAll("li").at(1)?.trigger("click");

		expect(wrapper.emitted("select")).toEqual([["futures"]]);
	});

	it("не эмитит select, когда disabled", async () => {
		const wrapper = mount(ATabs, {
			props: { items, activeValue: "spot", disabled: true },
		});

		await wrapper.findAll("li").at(0)?.trigger("click");

		expect(wrapper.emitted("select")).toBeUndefined();
	});

	it("снимает cursor-pointer и добавляет select-none при disabled", () => {
		const wrapper = mount(ATabs, {
			props: { items, activeValue: "spot", disabled: true },
		});

		const li = wrapper.findAll("li").at(0);

		expect(li?.classes()).toContain("select-none");
		expect(li?.classes()).not.toContain("cursor-pointer");
	});
});
