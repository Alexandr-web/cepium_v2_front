import { describe, it, expect } from "vitest";
import { formatTime } from "../../app/utils/index";

describe("formatTime", () => {
	it("должна корректно форматировать 0 миллисекунд", () => {
		expect(formatTime(0)).toBe("0:00");
	});

	it("должна округлять миллисекунды в меньшую сторону до секунд", () => {
		expect(formatTime(999)).toBe("0:00");
		expect(formatTime(1500)).toBe("0:01");
	});

	it("должна добавлять ведущий ноль к секундам, если их меньше 10", () => {
		expect(formatTime(60000)).toBe("1:00");
		expect(formatTime(65000)).toBe("1:05");
		expect(formatTime(605000)).toBe("10:05");
	});

	it("не должна добавлять ведущий ноль к секундам, если их 10 и более", () => {
		expect(formatTime(75000)).toBe("1:15");
	});

	it("должна корректно работать со значениями больше часа", () => {
		expect(formatTime(3600000)).toBe("60:00"); 
		expect(formatTime(3665000)).toBe("61:05");
	});
});
