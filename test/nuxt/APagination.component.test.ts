import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import APagination from "../../app/components/atoms/APagination.vue";

const AButtonStub = {
	props: ["disabled"],
	emits: ["click"],
	template: "<button :disabled=\"disabled\" @click=\"$emit('click')\"><slot /></button>",
};

const stubs = {
	AButton: AButtonStub,
	IconArrowDown: true,
};

describe("APagination", () => {
	it("рендерит кнопки страниц для небольшого числа страниц", () => {
		const wrapper = mount(APagination, {
			props: { total: 50, perPage: 10 },
			global: { stubs },
		});

		const pageButtons = wrapper.findAll("button").filter((b) => b.text() !== "");

		expect(pageButtons.map((b) => b.text())).toEqual(["1", "2", "3", "4", "5"]);
	});

	it("отключает кнопку «назад» на первой странице", () => {
		const wrapper = mount(APagination, {
			props: { total: 50, perPage: 10, page: 1 },
			global: { stubs },
		});

		expect(wrapper.findAll("button").at(0)?.attributes("disabled")).toBeDefined();
	});

	it("отключает кнопку «вперёд» на последней странице", () => {
		const wrapper = mount(APagination, {
			props: { total: 50, perPage: 10, page: 5 },
			global: { stubs },
		});

		const buttons = wrapper.findAll("button");

		expect(buttons.at(buttons.length - 1)?.attributes("disabled")).toBeDefined();
	});

	it("эмитит update:page при клике на страницу", async () => {
		const wrapper = mount(APagination, {
			props: { total: 50, perPage: 10, page: 1 },
			global: { stubs },
		});

		const page3 = wrapper.findAll("button").find((b) => b.text() === "3");
		await page3?.trigger("click");

		expect(wrapper.emitted("update:page")).toEqual([[3]]);
	});

	it("показывает многоточие для большого числа страниц", () => {
		const wrapper = mount(APagination, {
			props: { total: 200, perPage: 10 },
			global: { stubs },
		});

		expect(wrapper.text()).toContain("...");
	});
});
