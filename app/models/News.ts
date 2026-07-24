export default class News {
	readonly title: string;
	readonly timestamp: string;
	readonly content: string;
	readonly risk: "high" | "moderate" | "low";
	readonly id: number;
	readonly news: TNews;

	constructor(item: TNews) {
		this.title = item.title;
		this.timestamp = item.timestamp;
		this.content = item.content;
		this.risk = item.risk;
		this.id = item.id;
		this.news = item;
	}

	get prettyTime() {
		return new Date(this.timestamp).toLocaleTimeString();
	}
};
