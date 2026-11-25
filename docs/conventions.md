# Руководство

Тут описаны лучшие практики для работы с установленными инструментами, а также некоторые правила для разработки.

## Разработка

1. При добавлении нового функционала при необходимости обновлять файл `README.md`.
2. Для изображений используем `<NuxtImg />` от `@nuxt/image` (провайдер `ipx`, формат `webp`) и композабл `useImage()` для атрибута `srcset` тега `<source />`. Не забывать использовать `loading="lazy"` и `fetchpriority="high"` для `<NuxtImg />` соответственно.
3. Для иконок используем SVG-компоненты от `nuxt-svgo` (импорт как Vue-компонентов, конфиг в `nuxt.config.ts`: `svgo.defaultImport: "component"`).
4. Пишем компоненты с использованием `lang="ts"` и `setup`.
5. Для основного пакетного менеджера используем `yarn` (есть `yarn.lock`).
6. Для любого изменения в коде создаем отдельную ветку и пушим в нее, после создаем МР на основную ветку `master`.
7. Перед каждым коммитом запускать команду `yarn lint:fix` для исправления стиля кода под конфиг `eslint.config.mts`.

## Роутинг

Маршрутизация настроена через `app/router.options.ts` с использованием кастомных маршрутов vue-router. Страницы определяются как динамические импорты в объекте routes, с мета-полями для middleware, SEO и специальных флагов (`noSocket`, `noBack`). Файловая маршрутизация через `/app/pages/` не используется — все маршруты централизованы в `router.options.ts`.

Типы мета-полей объявлены в `shared/types/router.d.ts`:

```ts
interface PageMeta {
  noSocket?: boolean;
  noBack?: boolean;
  seo?: {
    title?: string;
  };
}
```

## Стилизация

Для применения стилей используем `tailwindcss` 4.x (через `@tailwindcss/vite`). Для крайних случаев (например, стили повторяются в разных местах) создаем класс в `/app/assets/css/global.css` для последующего применения.

*Пример*:

```css
.title {
  @apply text-36 font-bold;
}
```

## Тестирование

Проект использует Vitest с тремя проектами в `vitest.config.ts`: `unit` (окружение `node`), `e2e` (окружение `node`), `nuxt` (окружение `nuxt`).

Ключевые правила и Best Practices для Nuxt 4:

1. Изолируйте глобальное состояние Pinia: При тестировании компонентов или composables, использующих стейт, всегда сбрасывайте Pinia в хуке `beforeEach`, чтобы тесты не влияли друг на друга (State Bleeding):

    *Пример*:

    ```ts
    import { setActivePinia, createPinia } from 'pinia'
    beforeEach(() => { setActivePinia(createPinia()) })
    ```

2. Используйте `mockNuxtImport` на верхнем уровне: Данный макрос от Nuxt компилируется компилятором Vite, поэтому его нельзя вызывать внутри блоков `it` или `describe`.

3. Объединяйте глобальные моки: Если у вас много сквозных зависимостей, вынесите их в один файл инициализации (`test/setup/nuxt.mocks.ts`) и подключите его через свойство `setupFiles` в конфигурации Vitest.

4. Не злоупотребляйте E2E-утилитами в Unit-тестах: Избегайте вызова функции `setup()` из `@nuxt/test-utils/e2e` внутри юнит-тестов. Она поднимает полноценный инстанс приложения Nuxt, сервер Nitro и браузер, что замедляет прогон юнит-тестов в десятки раз. Используйте её строго для интеграционных и E2E сценариев.

5. Каждый компонент тестировать не надо. Тестируем только:
    - Общие UI-компоненты: Кнопки, инпуты, модальные окна, селекты, таблицы. Они используются по всему проекту.
    - Сложные бизнес-компоненты с логикой: Компоненты, которые содержат много вычисляемых свойств (computed), ветвлений v-if/v-else или сложную валидацию форм.
    - Динамические компоненты: Компоненты, поведение или рендеринг которых критически зависит от пропсов (props) или внешних событий (emits).

    Вместо покрытия 100% компонентов юнит-тестами, используйте гибридный подход:

    - Юнит-тесты: 100% покрытие для чистых функций (`shared/utils/`), сложных composables и базового UI-кита.
    - Интеграционные тесты / Компонентные тесты: Покрытие ключевых пользовательских сценариев.

## Tanstack Query (@peterbud/nuxt-query)

1. Правильная настройка SSR и гидратации

    Главная ошибка - вызывать `useQuery` на сервере так же, как на клиенте. Без правильной дегидратации клиент не узнает о данных, полученных сервером, и сделает повторный запрос. Рекомендуемый подход:

    ```vue
    <script setup>
    import { useQuery, useQueryClient } from '@tanstack/vue-query'

    const queryClient = useQueryClient()
    const queryKey = ['todos']
    const queryFn = () => $fetch('/api/todos') // Используем $fetch, а не useFetch!

    // 1. Предзагружаем данные на сервере (SSR) через встроенный механизм Nuxt
    const { data } = await useAsyncData('todos-ssr', async () => {
      return await queryClient.ensureQueryData({ queryKey, queryFn })
    })

    // 2. Инициализируем реактивный useQuery, который подхватит кэш
    const { data: todos, error, isLoading } = useQuery({
      queryKey,
      queryFn,
      initialData: data.value // передаем серверные данные как стартовые
    })
    </script>
    ```

2. Использование `$fetch` вместо `useFetch` внутри `queryFn`. Внутри функции `queryFn` всегда нужно использовать нативный метод `$fetch`.

3. Структурирование ключей запросов (Query Keys). Проектируйте `queryKey` как иерархические массивы, а не как плоские строки. Это упрощает инвалидацию связанных кэшей.
    - Плохо: `queryKey: ['todos-active-user-1']`
    - Хорошо: `queryKey: ['todos', { status: 'active', userId: 1 }]`

    В проекте ключи вынесены в `app/api/keys/index.ts` — генераторы массивов для каждого endpoint.

4. Создание кастомных composables

    Не пишите настройки `useQuery` прямо в компонентах. Выносите их в `app/composables/api/` для повторного использования и чистой архитектуры.

    *Пример*:

    ```ts
    // app/composables/api/useTodos.ts
    import { useQuery } from '@tanstack/vue-query'

    export const useTodosQuery = (options = {}) => {
      return useQuery({
        queryKey: ['todos'],
        queryFn: () => $fetch('/api/todos'),
        ...options
      })
    }
    ```

5. Оптимистичные обновления (Optimistic Updates). Для улучшения UX используйте мутации с мгновенным обновлением интерфейса до завершения ответа от сервера:

    *Пример*:

    ```ts
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
      mutationFn: (newTodo) => $fetch('/api/todos', { method: 'POST', body: newTodo }),
      
      // Вызывается перед сетевым запросом
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ['todos'] })
        const previousTodos = queryClient.getQueryData(['todos'])
        
        // Оптимистично добавляем элемент в кэш
        queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
        
        return { previousTodos } // Возвращаем контекст для отката при ошибке
      },
      
      // Если произошла ошибка, откатываем изменения
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(['todos'], context.previousTodos)
      },
      
      // Всегда инвалидируем кэш после успеха или ошибки для синхронизации
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      }
    })
    ```

## WebSocket (socket.io)

Проект использует socket.io для real-time обновлений. Подключение к биржам (Bybit, Binance, OKX) инкапсулировано в composables (`useBybitSocket`, `useExchangeSocket`). WebSocket-подписки обязательно отписывай при размонтировании компонента (`onUnmounted` или `onScopeDispose`), чтобы избежать утечек и дублирующих событий.

Серверный прокси socket.io настроен в `server/plugins/socket.io.ts`.

## Изображения (@nuxt/image)

Проект использует `@nuxt/image` с провайдером `ipx`. Формат по умолчанию — `webp`. Изображения кэшируются (`maxAge: 2592000`). В `nuxt.config.ts` настроены `routeRules` для кэширования `/fonts/**`, `/images/**` и `/_ipx/**`.

## Шрифты (@nuxt/fonts)

Подключен шрифт Inter (локально, веса 300/400/500/600). Все провайдеры Google/Bunny/Fontshare отключены.

## Утилиты и типы

Общие утилиты и типы вынесены в `shared/`:
- `shared/types/` — API-типы (api.ts), типы компонентов (components.ts), общие типы (index.ts), типы роутера (router.d.ts)
- `shared/utils/` — форматирование чисел/дат (index.ts), константы (constants.ts), конфигурации таблиц (tableColumns.ts)
