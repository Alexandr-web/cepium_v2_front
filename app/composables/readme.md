# Composables в Nuxt 4

Папка `app/composables/` содержит автоматически импортируемые функции (композаблы), которые инкапсулируют логику с состоянием и реактивностью для использования в компонентах, middleware, плагинах и других composables.

## Основные концепции

- **Автоимпорт** – любой файл из `composables/` (кроме вложенных с `index`) автоматически доступен по имени функции.
- **Reactivity** – внутри composables можно использовать `ref`, `reactive`, `computed`, `watch` и другие API Vue.
- **Nuxt-специфичные композаблы** – внутри разрешены `useRuntimeConfig`, `useCookie`, `useFetch`, `useRoute`, `useRouter` и др.
- **Server & Client** – возможно разделение логики с помощью `import.meta.server` / `import.meta.client`.

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