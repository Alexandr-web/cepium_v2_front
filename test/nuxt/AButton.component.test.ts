import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AButton from "../../app/components/atoms/AButton.vue";

describe("AButton", () => {
	describe("рендеринг", () => {
		it("рендерит содержимое слота", () => {
			const wrapper = mount(AButton, {
				slots: { default: "Нажми меня" },
			});

			expect(wrapper.text()).toBe("Нажми меня");
		});

		it("по умолчанию имеет type='button'", () => {
			const wrapper = mount(AButton);

			expect(wrapper.attributes("type")).toBe("button");
		});

		it("принимает переданный type через атрибут", () => {
			const wrapper = mount(AButton, {
				attrs: { type: "submit" },
			});

			expect(wrapper.attributes("type")).toBe("submit");
		});

		it("принимает любой другой атрибут (например, id, class)", () => {
			const wrapper = mount(AButton, {
				attrs: { id: "my-btn", class: "extra-class" },
			});

			expect(wrapper.attributes("id")).toBe("my-btn");
			expect(wrapper.classes()).toContain("extra-class");
		});

		it("всегда имеет базовые классы cursor-pointer, disabled:cursor-default, disabled:opacity-50", () => {
			const wrapper = mount(AButton);
			const classes = wrapper.classes();

			expect(classes).toContain("cursor-pointer");
			expect(classes).toContain("disabled:cursor-default");
			expect(classes).toContain("disabled:opacity-50");
		});
	});

	describe("режимы (mode)", () => {
		const modes = [
			{ mode: "default", expectedClasses: [] },
			{ mode: "remove-fill", expectedClasses: ["text-white/80", "bg-secondary-300"] },
			{ mode: "remove-border", expectedClasses: ["border-1", "border-solid", "border-secondary-400", "text-secondary-500", "bg-primary-100", "transition", "hover:border-secondary-500", "hover:text-secondary-600"] },
			{ mode: "neutral-fill", expectedClasses: ["transition", "text-white/80", "hover:text-white/90", "hover:bg-neutral-400", "bg-neutral-300"] },
		];

		modes.forEach(({ mode, expectedClasses }) => {
			it(`для mode="${mode}" применяет правильные классы`, () => {
				const wrapper = mount(AButton, {
					props: { mode },
				});
				const classes = wrapper.classes();

				expectedClasses.forEach((cls) => {
					expect(classes).toContain(cls);
				});
			});
		});
	});

	describe("disabled", () => {
		it("добавляет атрибут disabled, когда disabled=true", () => {
			const wrapper = mount(AButton, {
				props: { disabled: true },
			});

			expect(wrapper.attributes("disabled")).toBeDefined();
		});

		it("не добавляет атрибут disabled, когда disabled=false", () => {
			const wrapper = mount(AButton, {
				props: { disabled: false },
			});

			expect(wrapper.attributes("disabled")).toBeUndefined();
		});

		it("применяет классы disabled:cursor-default и disabled:opacity-50 при disabled=true", () => {
			const wrapper = mount(AButton, {
				props: { disabled: true },
			});

			expect(wrapper.classes()).toContain("disabled:cursor-default");
			expect(wrapper.classes()).toContain("disabled:opacity-50");
		});

		it("не эмитит событие click при клике, если disabled=true", async () => {
			const wrapper = mount(AButton, {
				props: { disabled: true },
			});
			await wrapper.trigger("click");

			expect(wrapper.emitted("click")).toBeUndefined();
		});
	});

	describe("события", () => {
		it("эмитит событие click при клике, если не disabled", async () => {
			const wrapper = mount(AButton);
			await wrapper.trigger("click");

			expect(wrapper.emitted("click")).toHaveLength(1);
		});

		it("эмитит событие click с правильным событием мыши", async () => {
			const wrapper = mount(AButton);

			await wrapper.trigger("click");

			const emittedClick = wrapper?.emitted("click")?.at(0);

			expect(emittedClick).toBeInstanceOf(Array);
			expect(emittedClick?.at(0)).toBeInstanceOf(MouseEvent);
		});
	});

	describe("комбинации режимов и disabled", () => {
		it("сохраняет классы режима даже при disabled=true", () => {
			const wrapper = mount(AButton, {
				props: {
					mode: "remove-fill",
					disabled: true,
				},
			});

			expect(wrapper.classes()).toContain("text-white/80");
			expect(wrapper.classes()).toContain("bg-secondary-300");
			expect(wrapper.classes()).toContain("disabled:cursor-default");
			expect(wrapper.classes()).toContain("disabled:opacity-50");
		});
	});
});
