# Руководство

Тут описаны лучшие практики для работы с установленными инструментами, а также некоторые правила для разработки.

## Разработка

1. При добавлении нового функционала при необходимости обновлять файл `README.md`.
2. Не использовать картинки через CSS-стили, применять `<NuxtImg />` и `<picture></picture>` для адаптивных изображений, где добавлять композабл `useImage()` от `@nuxt/image` для атрибута
`srcset` тега `<source />`. Также не забывать использовать `loading="lazy"` и `fetchpriority="high"` для `<NuxtImg />` соответственно.
3. Для иконок используем `<IconName />` от `svgo`.
4. Пишем компоненты с использованием `lang="ts"` и `setup`.
5. Для основного пакетного менеджера используем `yarn`.
6. Для любого изменения в коде создаем отдельную ветку и пушим в нее, после создаем МР на основную ветку `master`.
7. Перед каждым коммитом запускать команду `yarn lint:fix` для исправления стиля кода под конфиг `eslint.config.mjs`.

## Роутинг ([https://router.vuejs.org/](https://router.vuejs.org/))

Для отображения страниц используем `vue-router` через `/app/router.options.ts`, а не классические нейминги через папки и файлы в `/app/pages/`.

## Стилизация ([https://tailwindcss.com/](https://tailwindcss.com/))

Для применения стилей используем `tailwind.css`. Для крайних случаев (например, стили повторяются в разных местах) создаем класс в `/app/assets/css/tailwind.css` для последующего применения.

*Пример*:

```css
.title {
  @apply text-36 font-bold;
}
```

## Тестирование ([https://nuxt.com/docs/4.x/getting-started/testing](https://nuxt.com/docs/4.x/getting-started/testing))

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
    - Сложные бизнес-компоненты с логикой: Компоненты, которые содержат много вычисляемых свойств (computed), ветвлений v-if/v-else или сложную валидацию форм (например, корзина покупок, калькулятор кредита, конструктор тарифов).
    - Динамические компоненты: Компоненты, поведение или рендеринг которых критически зависит от пропсов (props) или внешних событий (emits).

    Вместо покрытия 100% компонентов юнит-тестами, используйте гибридный подход:

    - Юнит-тесты: 100% покрытие для чистых функций (`app/utils/`), сложных composables и базового UI-кита.
    - Интеграционные тесты / Компонентные тесты: Покрытие ключевых пользовательских сценариев (например, "форма регистрации успешно отправляет данные").

## Tanstack ([https://nuxt.com/modules/nuxt-query](https://nuxt.com/modules/nuxt-query))

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
2. Использование `$fetch` вместо `useFetch` внутри `queryFn`. Внутри функции `queryFn` всегда нужно использовать нативный метод `$fetch`
3. Структурирование ключей запросов (Query Keys). Проектируйте `queryKey` как иерархические массивы, а не как плоские строки. Это упрощает инвалидацию связанных кэшей.
    - Плохо: `queryKey: ['todos-active-user-1']`
    - Хорошо: `queryKey: ['todos', { status: 'active', userId: 1 }]`
4. Создание кастомных composables

    Не пишите настройки `useQuery` прямо в компонентах. Выносите их в слой `app/composables/` для повторного использования и чистой архитектуры.

    *Пример*:

    ```ts
    // app/composables/useTodos.ts
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