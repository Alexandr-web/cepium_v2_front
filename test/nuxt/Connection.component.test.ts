import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Connection from "../../app/components/atoms/Connection.vue";
import { useConnectionStore } from "../../app/store/useConnectionStore";

const ClientOnlyStub = {
	template: "<div><slot /></div>",
};

const mountConnection = (status: ConnectionStatuses) => {
	const pinia = createPinia();
	setActivePinia(pinia);
	useConnectionStore().status = status;

	return mount(Connection, {
		global: {
			plugins: [pinia],
			stubs: { ClientOnly: ClientOnlyStub },
		},
	});
};

describe("Connection", () => {
	it("отображает «Подключено» при статусе OPEN", () => {
		const wrapper = mountConnection(ConnectionStatuses.OPEN);

		expect(wrapper.text()).toContain("Подключено");
	});

	it("отображает «Отключено» при статусе NONE", () => {
		const wrapper = mountConnection(ConnectionStatuses.NONE);

		expect(wrapper.text()).toContain("Отключено");
	});

	it("отображает «Подключение» при статусе CONNECTING", () => {
		const wrapper = mountConnection(ConnectionStatuses.CONNECTING);

		expect(wrapper.text()).toContain("Подключение");
	});

	it("применяет зелёный индикатор при OPEN", () => {
		const wrapper = mountConnection(ConnectionStatuses.OPEN);

		expect(wrapper.find("span").classes()).toContain("bg-emerald-500");
	});

	it("применяет красный индикатор при CLOSED", () => {
		const wrapper = mountConnection(ConnectionStatuses.CLOSED);

		expect(wrapper.find("span").classes()).toContain("bg-rose-500");
	});
});
