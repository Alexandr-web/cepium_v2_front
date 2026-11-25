import {
	CandlestickSeries,
	ColorType,
	createChart,
	CrosshairMode,
	HistogramSeries,
	type CandlestickData,
	type HistogramData,
	type IChartApi,
	type ISeriesApi,
	type MouseEventParams,
	type Time,
} from "lightweight-charts";
import { h, render } from "vue";
import TradingViewTooltip from "@/components/molecules/chart/TradingViewTooltip.vue";

type TradingViewOptions = {
	// CSS-селектор DOM-элемента, в который будет вмонтирован график.
	containerSelector: string;
};

// Размеры и отступ плавающего тултипа (px)
const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 130;
const TOOLTIP_MARGIN = 15;

/**
 * Композабл для управления свечным графиком на базе `lightweight-charts`
 * с поддержкой гистограммы объемов, плавающего тултипа и лайв-обновлений через WebSocket Bybit.
 *
 * @param _interval - Реактивный или статический таймфрейм графика (например, '1', '15', 'D').
 * @param options - Настройки инициализации графика.
 * @returns Объект с инстансом графика, реактивными данными сокета и методами управления жизненным циклом.
 */
export const useTradingViewChart = (_interval: MaybeRefOrGetter<BybitInterval>, options: TradingViewOptions) => {
	const { containerSelector } = options;

	const interval = computed(() => toValue(_interval));

	const { kline, ticker, isConnected, disconnect, subscribe, unsubscribe } = useBybitSocket(interval);

	const chart = ref<IChartApi | null>(null);
	const candlestickSeries = ref<ISeriesApi<"Candlestick"> | null>(null);
	const volumeSeries = ref<ISeriesApi<"Histogram"> | null>(null);

	// Создаёт инстанс графика `lightweight-charts` в контейнере, указанном в опциях
	const createChartInstance = () => {
		chart.value = createChart(containerSelector, {
			autoSize: true,
			layout: {
				background: { type: ColorType.Solid, color: TRADING_VIEW_THEME.bg },
				textColor: TRADING_VIEW_THEME.text,
				fontFamily: "Inter, sans-serif",
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
					top: 0.3,
					bottom: 0.25,
				},
			},
			timeScale: {
				borderColor: TRADING_VIEW_THEME.border,
				timeVisible: true,
				secondsVisible: false,
			},
		});
	};

	// Добавляет на график серию свечей с цветами темы
	const createCandlestickSeries = () => {
		if (!chart.value) return;

		candlestickSeries.value = chart.value.addSeries(CandlestickSeries, {
			upColor: TRADING_VIEW_THEME.up,
			downColor: TRADING_VIEW_THEME.down,
			borderUpColor: TRADING_VIEW_THEME.up,
			borderDownColor: TRADING_VIEW_THEME.down,
			wickUpColor: TRADING_VIEW_THEME.up,
			wickDownColor: TRADING_VIEW_THEME.down,
		});
	};

	// Добавляет на график гистограмму объёмов с отдельной шкалой
	const createVolumeSeries = () => {
		if (!chart.value) return;

		volumeSeries.value = chart.value.addSeries(HistogramSeries, {
			priceFormat: { type: "volume" },
			priceScaleId: "volume",
			priceLineVisible: false,
			lastValueVisible: false,
		});
	};

	/**
	 * Настраивает отдельную шкалу цен для гистограммы объёмов,
	 * прижимая её к нижней части графика.
	 */
	const configureVolumeScale = () => {
		chart.value?.priceScale("volume").applyOptions({
			scaleMargins: { top: 0.8, bottom: 0 },
		});
	};

	// Заполняет серию свечей историческими данными.
	const applyCandlestickData = (data: BybitKline[]) => {
		candlestickSeries.value?.setData(
			data.map((kline) => ({
				time: toChartTime(kline.start),
				open: Number(kline.open),
				high: Number(kline.high),
				low: Number(kline.low),
				close: Number(kline.close),
			}))
		);
	};

	// Заполняет гистограмму объёмов историческими данными.
	const applyVolumeData = (data: BybitKline[]) => {
		volumeSeries.value?.setData(
			data.map((kline) => ({
				time: toChartTime(kline.start),
				value: Number(kline.volume),
				color: Number(kline.close) >= Number(kline.open)
					? TRADING_VIEW_THEME.upVolume
					: TRADING_VIEW_THEME.downVolume,
			}))
		);
	};

	// Размонтирует компонент тултипа из контейнера графика
	const hideTooltip = () => {
		if (!import.meta.client) return;
		const container = document.getElementById(containerSelector);
		if (container) render(null, container);
	};

	/**
	 * Монтирует или обновляет тултип при движении курсора.
	 * Размонтирует его, если курсор вышел за пределы графика или под ним нет данных.
	 */
	const crosshairMove = (param: MouseEventParams<Time>) => {
		if (!import.meta.client) return;
		const container = document.getElementById(containerSelector);
		if (!container) return;

		const { point, time } = param;

		let candle: CandlestickData<Time> | undefined;
		let volume: HistogramData<Time> | undefined;

		param.seriesData.values().forEach((data) => {
			if ("open" in data) candle = data;
			else if ("value" in data) volume = data;
		});

		if (
			!point
			|| typeof time !== "number"
			|| !candle
			|| point.x < 0
			|| point.y < 0
			|| point.x > container.clientWidth
			|| point.y > container.clientHeight
		) {
			hideTooltip();
			return;
		}

		// Если тултип не помещается справа/снизу от курсора — переносим его на другую сторону
		const left = point.x + TOOLTIP_MARGIN + TOOLTIP_WIDTH > container.clientWidth
			? point.x - TOOLTIP_MARGIN - TOOLTIP_WIDTH
			: point.x + TOOLTIP_MARGIN;

		const top = point.y + TOOLTIP_MARGIN + TOOLTIP_HEIGHT > container.clientHeight
			? point.y - TOOLTIP_MARGIN - TOOLTIP_HEIGHT
			: point.y + TOOLTIP_MARGIN;

		render(
			h(TradingViewTooltip, {
				time,
				candle,
				volume: volume?.value,
				left: Math.max(0, left),
				top: Math.max(0, top),
				width: TOOLTIP_WIDTH,
			}),
			container
		);
	};

	// Удаляет предыдущий инстанс графика вместе с подпиской и тултипом
	const destroyChartInstance = () => {
		chart.value?.unsubscribeCrosshairMove(crosshairMove);
		hideTooltip();

		candlestickSeries.value = null;
		volumeSeries.value = null;
		chart.value?.remove();
		chart.value = null;
	};

	const build = async (data: BybitKline[] | undefined, symbol: string) => {
		if (!import.meta.client || !data?.length) return;

		await nextTick();

		destroyChartInstance();

		createChartInstance();
		createCandlestickSeries();
		createVolumeSeries();
		configureVolumeScale();
		applyCandlestickData(data);
		applyVolumeData(data);

		chart.value?.subscribeCrosshairMove(crosshairMove);
		chart.value?.timeScale().fitContent();

		subscribe(symbol);
	};

	// Применяет обновление kline, пришедшее по WebSocket, к обеим сериям.
	const klineUpdate = (kline: BybitKline | null) => {
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
	};

	watch(() => kline.value, klineUpdate);

	const reset = () => {
		destroyChartInstance();

		unsubscribe();
		disconnect();
	};

	return { chart, kline, ticker, isConnected, reset, build };
};
