import type { UseTimeAgoMessages } from "@vueuse/core";

export const VERSION = "v2.0";

export const MAX_SIZE_FILE_AVATAR = 5 * 1024 * 1024; // 5 мб

export const RU_TIME_MESSAGES: UseTimeAgoMessages = {
	justNow: "только что",
	invalid: "некорректная дата",
	past: (n: number | string) => {
		const s = String(n);
		return s.match(/\d+/) ? `${s} назад` : s;
	},
	future: (n: number | string) => {
		const s = String(n);
		return s.match(/\d+/) ? `через ${s}` : s;
	},
	month: (n: number) => n === 1 ? "месяц" : `${n} мес.`,
	year: (n: number) => n === 1 ? "год" : `${n} г.`,
	day: (n: number, past?: boolean) => n === 1 ? (past ? "вчера" : "завтра") : `${n} дн.`,
	week: (n: number) => n === 1 ? "неделю" : `${n} нед.`,
	hour: (n: number) => `${n} ч.`,
	minute: (n: number) => `${n} мин.`,
	second: (n: number) => `${n} сек.`,
};

export const CHART_COLORS = {
	tooltip: {
		backgroundColor: "#161b22",
		borderColor: "#30363d",
		textStyle: { color: "#c9d1d9" },
	},
	xAxis: {
		axisLabel: { color: "#8b949e" },
		axisLine: {
			lineStyle: { color: "#30363d" },
		},
	},
	legend: {
		textStyle: { color: "#8b949e" },
	},
	yAxis: {
		axisLine: {
			lineStyle: { color: "rgba(139, 148, 158, 0.15)" },
		},
		splitLine: {
			lineStyle: {
				color: "rgba(139, 148, 158, 0.05)",
			},
		},
		axisLabel: { color: "#8b949e" },
	},
	axisLabel: { color: "#8b949e" },
	color: {
		pie: [
			{
				colorStops: ["#34d399", "#16a34a"],
			},
			{
				colorStops: ["#f87171", "#dc2626"],
			},
		],
	},
	series: {
		line: {
			label: { color: "#8b949e" },
			itemStyle: { color: "#58a6ff" },
			lineStyle: {
				color: "#58a6ff",
				shadowColor: "rgba(88, 166, 255, 0.15)", 
			},
			areaStyle: {
				color: {
					colorStops: ["rgba(88, 166, 255, 0.2)", "rgba(88, 166, 255, 0.0)"],
				},
			},
		},
		bar: {
			label: { color: "#8b949e" },
			itemStyle: {
				color: "rgba(31,111,235,0.2)",
				borderColor: "#114ba8",
			},
		},
		pie: {
			itemStyle: { borderColor: "#0d1117" },
			emphasis: {
				itemStyle: { shadowColor: "rgba(0, 0, 0, 0.5)" },
			},
		},
	},
};
