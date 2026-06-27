import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import type { ZodType } from "zod";
import AInput from "../../app/components/atoms/AInput.vue";

// Мокаем дочерние компоненты (Icon и AButton), чтобы упростить тестирование
vi.mock("@/components/atoms/AButton.vue", () => ({
	default: {
		name: "AButton",
		template: "<button><slot /></button>",
	},
}));

vi.mock("@/components/atoms/Icon.vue", () => ({
	default: {
		name: "Icon",
		template: "<span :class=\"$attrs.class\" />",
	},
}));

describe("AInput", () => {
	describe("рендеринг", () => {
		it("рендерит label, если он передан", () => {
			const wrapper = mount(AInput, {
				props: { label: "Email" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.find("h3").text()).toBe("Email");
		});

		it("не рендерит label, если он не передан", () => {
			const wrapper = mount(AInput, {
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.find("h3").exists()).toBe(false);
		});

		it("рендерит placeholder", () => {
			const wrapper = mount(AInput, {
				props: { placeholder: "Введите email" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.find("input").attributes("placeholder")).toBe("Введите email");
		});

		it("рендерит prependIcon, если он передан", () => {
			const wrapper = mount(AInput, {
				props: { preppendIcon: "mdi-email" },
				global: {
					stubs: {
						Icon: true,
						AButton: true,
					},
				},
			});

			const icon = wrapper.find("svg");

			expect(icon.exists()).toBe(true);
		});

		it("не рендерит prependIcon, если он не передан", () => {
			const wrapper = mount(AInput, {
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(false);
		});

		it("по умолчанию имеет type=\"text\"", () => {
			const wrapper = mount(AInput, {
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.find("input").attributes("type")).toBe("text");
		});

		it("при type=\"password\" показывает кнопку переключения", () => {
			const wrapper = mount(AInput, {
				props: { type: "password" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const button = wrapper.findComponent({ name: "AButton" });

			expect(button.exists()).toBe(true);
		});

		it("при type=\"text\" не показывает кнопку переключения", () => {
			const wrapper = mount(AInput, {
				props: { type: "text" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			expect(wrapper.findComponent({ name: "AButton" }).exists()).toBe(false);
		});

		it("применяет классы ошибки, если error не пустой", () => {
			const wrapper = mount(AInput, {
				props: { error: "Обязательное поле" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const container = wrapper.find(".group");
			expect(container.classes()).toContain("border-secondary-500/50");
			expect(container.classes()).toContain("hover:border-secondary-500/70");

			const label = wrapper.find("h3");

			if (label.exists()) {
				expect(label.classes()).toContain("text-secondary-500");
			}

			const icon = wrapper.findComponent({ name: "Icon" });

			if (icon.exists()) {
				expect(icon.classes()).toContain("text-secondary-500");
			}
		});

		it("при отсутствии ошибки применяет классы по умолчанию", () => {
			const wrapper = mount(AInput, {
				global: { stubs: { Icon: true, AButton: true } },
			});

			const container = wrapper.find(".group");

			expect(container.classes()).toContain("border-white/5");
			expect(container.classes()).toContain("hover:border-white/10");

			const label = wrapper.find("h3");

			if (label.exists()) {
				expect(label.classes()).toContain("text-primary-700");
			}

			const icon = wrapper.findComponent({ name: "Icon" });

			if (icon.exists()) {
				expect(icon.classes()).toContain("text-primary-700");
			}
		});
	});

	describe("поведение", () => {
		it("обновляет value при вводе текста", async () => {
			const wrapper = mount(AInput, {
				global: { stubs: { Icon: true, AButton: true } },
			});

			const input = wrapper.find("input");
			await input.setValue("test@example.com");

			// Проверяем, что эмит update:modelValue отправлен с новым значением
			expect(wrapper.emitted("update:modelValue")).toBeTruthy();
			expect(wrapper.emitted("update:modelValue")?.at(0)).toEqual(["test@example.com"]);
		});

		it("при изменении value вызывает валидацию и обновляет error (при наличии check)", async () => {
			// Создаём валидатор Zod
			const check = { safeParse: vi.fn() } as unknown as ZodType;
			// Настраиваем safeParse для возврата ошибки
			check.safeParse = vi.fn().mockReturnValue({
				error: { message: "Некорректный email" },
				success: false,
			});

			const wrapper = mount(AInput, {
				props: { check },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const input = wrapper.find("input");
			await input.setValue("invalid");

			// Должен быть отправлен эмит update:error с сообщением об ошибке
			expect(wrapper.emitted("update:error")).toBeTruthy();
			expect(wrapper.emitted("update:error")?.at(0)).toEqual(["Некорректный email"]);
			expect(check.safeParse).toHaveBeenCalledWith("invalid");
		});

		it("не вызывает валидацию и не обновляет error, если value пустой (по условию watch)", async () => {
			const check = { safeParse: vi.fn() } as unknown as ZodType;

			check.safeParse = vi.fn().mockReturnValue({
				error: { message: "Ошибка" },
				success: false,
			});

			const wrapper = mount(AInput, {
				props: { check },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const input = wrapper.find("input");
			await input.setValue("");

			expect(wrapper.emitted("update:error")).toBeFalsy();
			expect(check.safeParse).not.toHaveBeenCalled();
		});

		it("при клике на кнопку переключает видимость пароля", async () => {
			const wrapper = mount(AInput, {
				props: { type: "password" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const input = wrapper.find("input");
			// Изначально тип должен быть password (showPassword = false)
			expect(input.attributes("type")).toBe("password");

			const button = wrapper.findComponent({ name: "AButton" });
			await button.trigger("click");

			// После клика showPassword становится true, тип меняется на text
			expect(input.attributes("type")).toBe("text");

			// Второй клик возвращает password
			await button.trigger("click");
			expect(input.attributes("type")).toBe("password");
		});

		it("при отсутствии check ошибка не обновляется при вводе", async () => {
			const wrapper = mount(AInput, {
				props: { error: "Предыдущая ошибка" },
				global: { stubs: { Icon: true, AButton: true } },
			});

			const input = wrapper.find("input");
			await input.setValue("something");

			expect(wrapper.emitted("update:error")).toBeTruthy();
			expect(wrapper.emitted("update:error")?.at(0)).toEqual([""]);
		});
	});
});
