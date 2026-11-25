# Composables в Nuxt 4

Папка `app/composables/` содержит автоматически импортируемые функции (композаблы), которые инкапсулируют логику с состоянием и реактивностью для использования в компонентах, middleware, плагинах и других composables.

## Основные концепции

- **Автоимпорт** – любой файл из `composables/` (кроме вложенных с `index`) автоматически доступен по имени функции.
- **Reactivity** – внутри composables можно использовать `ref`, `reactive`, `computed`, `watch` и другие API Vue.
- **Nuxt-специфичные композаблы** – внутри разрешены `useRuntimeConfig`, `useCookie`, `useFetch`, `useRoute`, `useRouter` и др.
- **Server & Client** – возможно разделение логики с помощью `import.meta.server` / `import.meta.client`.

## Структура

### composables/api/ — API-комposables (TanStack Query)

8 composables для работы с бэкендом через `@peterbud/nuxt-query`:

| Файл | Назначение |
|------|-----------|
| `useAuth.ts` | Авторизация |
| `useConfigs.ts` | Конфиги бота |
| `useCredentials.ts` | Учётные данные бирж |
| `useExchanges.ts` | Биржи |
| `useOrders.ts` | Ордера |
| `useStatistics.ts` | Статистика |
| `useStrategies.ts` | Стратегии |
| `useUser.ts` | Данные пользователя |

### composables/chart/ — Чарты

6 composables для графиков:

| Файл | Назначение |
|------|-----------|
| `useChartScroll.ts` | Прокрутка чарта |
| `useMarginChart.ts` | Чарт маржи |
| `useOrdersBySymbolChart.ts` | График ордеров по символам |
| `useOrdersWinLossChart.ts` | График побед/поражений |
| `useProfitByDayChart.ts` | График прибыли по дням |
| `useTradingViewChart.ts` | TradingView-чарт |

### Root-level composables

| Файл | Назначение |
|------|-----------|
| `useApi.ts` | Базовый API-клиент |
| `useBybitSocket.ts` | WebSocket для Bybit |
| `useBybitSymbol.ts` | Форматирование символов Bybit |
| `useExchangeSocket.ts` | WebSocket для бирж |
| `useFormState.ts` | Управление состоянием форм |
| `useTimer.ts` | Таймер |
| `useWizard.ts` | Логика визарда |

## Создание composable

Файл должен экспортировать функцию, имя которой совпадает с именем файла (рекомендуется). Можно экспортировать несколько функций, но тогда для автоимпорта нужно будет использовать псевдонимы или явно импортировать.

### Пример: `useCounter.ts`

```ts
export const useCounter = () => {
  const count = ref(0);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  return { count, increment, decrement };
};
```
