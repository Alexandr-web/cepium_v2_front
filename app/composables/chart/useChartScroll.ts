import type { EChartsOption } from "echarts";

// Максимальное количество категорий, видимых одновременно
export const CHART_VISIBLE_POINTS = 3;
// Высота полосы прокрутки
export const CHART_SCROLLBAR_HEIGHT = 10;

/**
 * Композабл горизонтального скролла для категориальных графиков (ECharts).
 * Окно фиксированной ширины (`visible` категорий) плавно панорамируется
 * свайпом/колесом или перетаскиванием полосы прокрутки.
 *
 * @param _total - Общее количество категорий
 * @param visible - Сколько категорий показывать одновременно
 */
export const useChartScroll = (_total: MaybeRefOrGetter<number>, visible = CHART_VISIBLE_POINTS) => {
	const total = computed(() => toValue(_total));
	const hasScroll = computed(() => total.value > visible);

	// Ширина окна в процентах: ровно `visible` категорий из N
	const windowSpan = computed(() => (hasScroll.value ? (visible / total.value) * 100 : 100));

	const zoomBase = computed(() => ({
		xAxisIndex: 0,
		start: 100 - windowSpan.value,
		end: 100,
		minSpan: windowSpan.value,
		maxSpan: windowSpan.value,
		zoomLock: true,
		filterMode: "none" as const,
		throttle: 0,
	}));

	const dataZoom = computed<EChartsOption["dataZoom"]>(() => [
		{
			...zoomBase.value,
			type: "inside",
			zoomOnMouseWheel: false,
			moveOnMouseWheel: true,
			moveOnMouseMove: true,
			preventDefaultMouseMove: false,
		},
		{
			...zoomBase.value,
			type: "slider",
			show: hasScroll.value,
			height: CHART_SCROLLBAR_HEIGHT,
			bottom: 4,
			left: "3%",
			right: "3%",
			brushSelect: false,
			showDataShadow: false,
			showDetail: false,
			handleSize: 0,
			moveHandleSize: 0,
			borderColor: CHART_COLORS.dataZoom.borderColor,
			backgroundColor: CHART_COLORS.dataZoom.backgroundColor,
			fillerColor: CHART_COLORS.dataZoom.fillerColor,
			borderRadius: CHART_SCROLLBAR_HEIGHT / 2,
			selectedDataBackground: {
				lineStyle: { opacity: 0 },
				areaStyle: { opacity: 0 },
			},
		},
	]);

	// Нижний отступ сетки с учётом полосы прокрутки (десктоп)
	const gridBottom = computed(() => (hasScroll.value ? CHART_SCROLLBAR_HEIGHT + 28 : "3%"));
	// Нижний отступ сетки с учётом полосы прокрутки (мобильные)
	const gridBottomMobile = computed(() => (hasScroll.value ? CHART_SCROLLBAR_HEIGHT + 24 : 20));

	return { hasScroll, dataZoom, gridBottom, gridBottomMobile };
};
