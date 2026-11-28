/**
 * Возвращает `api`-клиент для собственных Nitro-роутов приложения (`server/routes`, `server/api`).
 *
 * В отличие от `useApi()`, на сервере (SSR) не подставляет `config.apiUrl`,
 * поэтому запрос не уходит на внешний бэкенд, а обрабатывается внутри Nuxt.
 * На клиенте запрос идёт на тот же origin.
 *
 * Используйте для публичных роутов самого Nuxt (например, `/currency`).
 * Для запросов к бэкенду используйте `useApi()`.
 *
 * @returns Объект с `api`: экземпляр `$fetch` с авторизационным заголовком и обработкой 401.
 *
 * @example
 * const { api } = useLocalApi();
 * const data = await api<CurrencyResponse>("/currency");
 */
export const useLocalApi = () => useApi(LOCAL_API);
