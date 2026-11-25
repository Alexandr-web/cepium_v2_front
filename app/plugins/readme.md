# Plugins в Nuxt 4

Папка `app/plugins/` предназначена для выполнения кода при инициализации приложения до монтирования корневого компонента.

## Текущее состояние

В настоящее время папка пуста — плагины не используются. Вся инициализация вынесена в:

- **Nuxt modules** — `@pinia/nuxt`, `@peterbud/nuxt-query`, `notivue/nuxt`, `nuxt-echarts`, `@nuxt/image`, `nuxt-svgo`, `@vueuse/nuxt`, `@nuxt/fonts` (настроены в `nuxt.config.ts`)
- **Server plugins** — `server/plugins/socket.io.ts` (WebSocket-сервер)
- **Composables** — логина инициализации вынесена в `app/composables/`

## Если понадобится плагин

Файл в `plugins/` должен экспортировать функцию (по умолчанию), которая будет вызвана при старте приложения.

### Пример простого плагина: `plugins/hello.ts`

```ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => console.log(`Hello, ${msg}!`);
    }
  };
});
```
