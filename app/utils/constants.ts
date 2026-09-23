export const VERSION = "v2.0";

export const WEEKDAY_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export const MONTHS_LIST = [
	"Янв", "Фев", "Мар", "Апр", "Май", "Июн",
	"Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

export const MAX_SIZE_FILE_AVATAR = 5 * 1024 * 1024; // 5 мб

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
		positions: ["#3b82f6", "#a855f7", "#22d3ee", "#34d399", "#f59e0b", "#8b949e"],
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
