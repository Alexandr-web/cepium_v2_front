import keys from "@/api/keys";
import { useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

type BybitKlineParams = {
	symbol: string;
	interval: string;
	limit?: number;
	start?: number;
	end?: number;
};

// Парсит сырой ответ Bybit REST API в массив BybitKline.
const parseKlines = (list: string[][]): BybitKline[] => {
	const result: BybitKline[] = [];

	list.forEach((raw) => {
		const [startTime, open, high, low, close, volume, turnover] = raw;

		result.push({
			symbol: "",
			start: Number(startTime),
			end: 0,
			interval: "",
			open: String(open),
			high: String(high),
			low: String(low),
			close: String(close),
			volume: String(volume),
			turnover: String(turnover),
			confirm: false,
			timestamp: 0,
		});
	});

	return result;
};

export const useBybitKlines = () => {
	const { api } = useApi();
	const queryClient = useQueryClient();

	const fetchKlines = async (params: BybitKlineParams): Promise<BybitKline[]> => {
		return queryClient.fetchQuery<BybitKline[]>({
			queryKey: keys.getBybitKlines(params.symbol, params.interval),
			queryFn: async () => {
				const response = await api<BybitKlineResponse>("/bybit/klines", { query: params });
				const klines = parseKlines(response.result.list);

				klines.forEach((kline, index) => {
					if (index < klines.length - 1) {
						kline.end = Number(klines[index + 1]?.start);
					} else {
						kline.end = kline.start;
					}
					kline.symbol = params.symbol;
					kline.interval = params.interval;
					kline.confirm = true;
				});

				return klines.reverse();
			},
		});
	};

	return { fetchKlines };
};
