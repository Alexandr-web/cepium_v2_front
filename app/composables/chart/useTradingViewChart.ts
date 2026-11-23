import { CandlestickSeries, ColorType, createChart, CrosshairMode, HistogramSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";

type TradingViewOptions = {
	containerSelector: string;
	interval: string;
};

export const useTradingViewChart = (options: TradingViewOptions) => {
	const { containerSelector, interval } = options;

	const { kline: socketKline, disconnect, subscribe, unsubscribe } = useBybitSocket(interval);

	const chart = ref<IChartApi | null>(null);
	const candlestickSeries = ref<ISeriesApi<"Candlestick"> | null>(null);
	const volumeSeries = ref<ISeriesApi<"Histogram"> | null>(null);

	const build = async (data: BybitKline[], symbol: string) => {
		if (!import.meta.client || !data.length) return;

		await nextTick();

		chart.value = createChart(containerSelector, {
			autoSize: true,
			layout: {
				background: { type: ColorType.Solid, color: TRADING_VIEW_THEME.bg },
				textColor: TRADING_VIEW_THEME.text,
				fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
			},
			grid: {
				vertLines: { color: TRADING_VIEW_THEME.grid },
				horzLines: { color: TRADING_VIEW_THEME.grid },
			},
			crosshair: {
				mode: CrosshairMode.Normal,
				vertLine: {
					color: TRADING_VIEW_THEME.crosshair,
					width: 1,
					style: 2,
					labelBackgroundColor: TRADING_VIEW_THEME.border,
				},
				horzLine: {
					color: TRADING_VIEW_THEME.crosshair,
					width: 1,
					style: 2,
					labelBackgroundColor: TRADING_VIEW_THEME.border,
				},
			},
			rightPriceScale: {
				borderColor: TRADING_VIEW_THEME.border,
				scaleMargins: {
					top: 0.1,
					bottom: 0.25,
				},
			},
			timeScale: {
				borderColor: TRADING_VIEW_THEME.border,
				timeVisible: true,
				secondsVisible: false,
			},
		});

		candlestickSeries.value = chart.value.addSeries(CandlestickSeries, {
			upColor: TRADING_VIEW_THEME.up,
			downColor: TRADING_VIEW_THEME.down,
			borderUpColor: TRADING_VIEW_THEME.up,
			borderDownColor: TRADING_VIEW_THEME.down,
			wickUpColor: TRADING_VIEW_THEME.up,
			wickDownColor: TRADING_VIEW_THEME.down,
		});

		volumeSeries.value = chart.value.addSeries(HistogramSeries, {
			priceFormat: { type: "volume" },
			priceScaleId: "volume",
			priceLineVisible: false,
			lastValueVisible: false,
		});

		chart.value.priceScale("volume").applyOptions({
			scaleMargins: { top: 0.8, bottom: 0 },
		});

		candlestickSeries.value.setData(
			data.map((kline) => ({
				time: toChartTime(kline.start),
				open: Number(kline.open),
				high: Number(kline.high),
				low: Number(kline.low),
				close: Number(kline.close),
			}))
		);

		volumeSeries.value.setData(
			data.map((kline) => ({
				time: toChartTime(kline.start),
				value: Number(kline.volume),
				color: Number(kline.close) >= Number(kline.open)
					? TRADING_VIEW_THEME.upVolume
					: TRADING_VIEW_THEME.downVolume,
			}))
		);

		chart.value.timeScale().fitContent();

		subscribe(symbol);
	};

	watch(() => socketKline.value, (kline) => {
		if (!kline || !candlestickSeries.value || !volumeSeries.value) return;

		const formatted = {
			time: toChartTime(kline.start),
			open: Number(kline.open),
			high: Number(kline.high),
			low: Number(kline.low),
			close: Number(kline.close),
		};

		candlestickSeries.value.update(formatted);
		volumeSeries.value.update({
			time: formatted.time,
			value: Number(kline.volume),
			color: Number(kline.close) >= Number(kline.open)
				? TRADING_VIEW_THEME.upVolume
				: TRADING_VIEW_THEME.downVolume,
		});
	});

	const reset = () => {
		candlestickSeries.value = null;
		volumeSeries.value = null;
		chart.value?.remove();
		chart.value = null;

		unsubscribe();
		disconnect();
	};

	return { chart, reset, build };
};
