declare module "#app" {
	interface PageMeta {
		noSocket?: boolean;
		noBack?: boolean;
		seo?: {
			title?: string;
		};
	};
};

// Обязательно для файлов деклараций, чтобы TS воспринимал его как модуль
export {};
