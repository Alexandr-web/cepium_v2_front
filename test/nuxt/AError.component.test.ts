import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AError from "../../app/components/atoms/AError.vue";

describe("AError", () => {
	it("рендерит сообщение, если оно передано", () => {
		const wrapper = mount(AError, {
			props: { message: "Что-то пошло не так" },
		});

		expect(wrapper.find("p").text()).toBe("Что-то пошло не так");
	});

	it("не рендерит ничего, если сообщение не передано", () => {
		const wrapper = mount(AError);

		expect(wrapper.find("p").exists()).toBe(false);
	});

	it("не рендерит ничего для пустой строки", () => {
		const wrapper = mount(AError, {
			props: { message: "" },
		});

		expect(wrapper.find("p").exists()).toBe(false);
	});
});
