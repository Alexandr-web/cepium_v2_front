import { defineStore } from "pinia";
import type Trade from "@/models/Trade";

export const useTradeStore = defineStore("trade-store",	() => {
	const trades = ref<Trade[]>([]);
	
	return { trades };
});
