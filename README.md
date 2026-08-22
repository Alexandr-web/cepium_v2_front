# Bitrit V2 - Крипто-бот для торговли фьючерсами и спотом

**Bitrit V2** - это высокопроизводительный автоматизированный торговый бот для криптовалютных бирж. Поддерживает как спотовую, так и фьючерсную торговлю с плечом. Позволяет создавать собственные стратегии, использовать готовые модули и управлять рисками. Бот разработан для работы на нескольких биржах одновременно.

## Основные возможности

* Авторизация пользователя
* Работа с профилем (изменение данных, пароля с кодом на почту)
* Работа с доступными биржами (на данный момент Bybit, Binance, OKX)
* Мониторинг состояния профиля выбранной биржи (баланс, активные позиции, реализованный PNL)
* Мониторинг активных позиций (цена ликвидации, стоп, тейк, PNL и тд)
* Создание и редактирование конфигов

## Архитектура

Структура папок:

- **components/**
  - **atoms/** – кнопки, инпуты, заголовки
  - **molecules/** – поисковая строка, карточка актива, форма входа
  - **organisms/** – Header, Dashboard, TradingPanel, OrderBook
- **pages/** – страницы (index.vue, strategies.vue, logs.vue)
- **layouts/** – default.vue, auth.vue
- **store/** – Pinia-хранилища (useUser.ts, useTrading.ts, useExchanges.ts)
- **middleware/** – auth.global.ts, logger.ts
- **composables/** – useApi, useWebSocket, useFormatter, useToast
- **plugins/** – pinia, api-client, websocket client
- **server/** - слой сервера между фронтом и внешним беком
- **router.options.ts** – кастомизация маршрутизатора (добавление мета-полей, защита)
- **assets/** – стили
- **public/** – статика
- **models/** - модели созданные из сырых данных с бека
- **types/** - типы (интерфейсы, type aliases, enum) ts
- **utils/** - функции-помощники
- **api** - содержит методы для работы с api бека

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

## Docker (dev режим)

### Сборка образа

```bash
docker build -t cepium_v2_front-app .
```

### Запуск контейнера

```bash
docker run -d -p 3000:3000 --env-file .env --name cepium_v2_front cepium_v2_front-app
```

## Docker (prod режим)

### Запуск проекта

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Просмотр логов

```bash
docker compose -f docker-compose.prod.yml logs -f nuxt-prod
```

### Остановка контейнера

```bash
docker compose -f docker-compose.prod.yml down
```

Сервер запускается по ссылке `http://localhost:3000`

## Запуск бека

Для корректной работы с REST API и WebSockets необходимо подключиться к беку. Для этого необходимо создать файл `.env` по примеру из `.env.example`, подставив туда свои данные.

Документация будет пополняться.