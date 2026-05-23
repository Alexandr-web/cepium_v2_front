# Cepium V2 - Крипто-бот для торговли фьючерсами и спотом

**Cepium V2** - это высокопроизводительный автоматизированный торговый бот для криптовалютных бирж. Поддерживает как спотовую, так и фьючерсную торговлю с плечом. Позволяет создавать собственные стратегии, использовать готовые модули и управлять рисками. Бот разработан для работы на нескольких биржах одновременно.

## Основные возможности

Тут будет список всех возможностей бота

## Архитектура

Структура папки `app/`:

- **components/**
  - **atoms/** – кнопки, инпуты, иконки, заголовки
  - **molecules/** – поисковая строка, карточка актива, форма входа
  - **organisms/** – Header, Dashboard, TradingPanel, OrderBook
- **pages/** – страницы (index.vue, strategies.vue, logs.vue)
- **layouts/** – default.vue, auth.vue
- **store/** – Pinia-хранилища (useUser.ts, useTrading.ts, useExchanges.ts)
- **middleware/** – auth.global.ts, logger.ts
- **composables/** – useApi, useWebSocket, useFormatter, useToast
- **plugins/** – pinia, api-client, websocket client
- **router.options.ts** – кастомизация маршрутизатора (добавление мета-полей, защита)
- **assets/** – стили
- **public/** – статика
- **models/** - модели созданные из сырых данных с бека
- **types/** - типы (интерфейсы, type aliases, enum) ts
- **utils/** - функции-помощники

Тесты (папка `test/`)

- **nuxt/** - Для компонентов, composables и плагинов, где жизненно важны автоимпорты (ref, computed, useFetch и т.д.)
- **unit/** - Для «чистых» хелперов, чистой бизнес-логики и утилит. Они работают молниеносно.

Технологический стек:

- **Node.js** (версия 22+)
- **TypeScript**
- **Docker**
- **WebSocket**
- **Vue**
- **Nuxt**
- **Tailwind**
- **Pinia**
- **Vitest**
- **Tanstack**

## Установка и запуск

### Требования

- Node.js ≥ 22.22.1
- npm или yarn
- (опционально) Docker и Docker Compose

### Локальная установка

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Сервер

Запуск сервера происходит через команду:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

Сервер запускается по ссылке `http://localhost:3000`

## Запуск бека

Для корректной работы с REST API и WebSockets необходимо подключиться к беку. Для этого необходимо создать файл `.env` по примеру из `.env.example`, подставив туда url ссылку для REST API и WS.

Документация будет пополняться.