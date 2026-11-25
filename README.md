# Cepium V2 - Крипто-бот для торговли фьючерсами и спотом

**Cepium V2** - это высокопроизводительный автоматизированный торговый бот для криптовалютных бирж. Поддерживает как спотовую, так и фьючерсную торговлю с плечом. Позволяет создавать собственные стратегии, использовать готовые модули и управлять рисками. Бот разработан для работы на нескольких биржах одновременно.

## Основные возможности

* Авторизация пользователя
* Работа с профилем (изменение данных, пароля с кодом на почту)
* Работа с доступными биржами (на данный момент Bybit, Binance, OKX)
* Мониторинг состояния профиля выбранной биржи (баланс, активные позиции, реализованный PNL)
* Мониторинг активных позиций (цена ликвидации, стоп, тейк, PNL и тд)
* Создание и редактирование конфигов
* История ордеров
* Статистика и графики

## Архитектура

Структура папок:

- **app/components/** – компоненты по методологии Atomic Design:
  - **atoms/** – базовые UI-элементы (13 компонентов: AButton, AInput, ASelect, ACheckbox, AImage, AError, APagination, ASlider, ATab, ATag, Connection, LabelField, ProgressLine)
  - **molecules/** – комбинации атомов (32 компонента в подпапках: chart/, common/, configs/, index/, layout/, orders/, profile/, statistics/, table/, trade/, widgets/)
  - **organisms/** – сложные секции (13 компонентов в подпапках: configs/, index/, login/, orders/, profile/, statistics/)
- **app/pages/** – страницы (index.vue, login.vue, profile.vue, configs.vue, add-config.vue, edit-config.vue, orders.vue, statistics.vue)
- **app/layouts/** – default.vue
- **app/router.options.ts** – кастомная маршрутизация через vue-router (именованные маршруты с мета-полями, middleware, SEO)
- **app/middleware/** – auth.ts, login.ts, socket.global.ts
- **app/composables/** – composables в подпапках: api/ (useAuth, useConfigs, useCredentials, useExchanges, useOrders, useStatistics, useStrategies, useUser), chart/ (useChartScroll, useMarginChart, useOrdersBySymbolChart, useOrdersWinLossChart, useProfitByDayChart, useTradingViewChart), root-level (useApi, useBybitSocket, useBybitSymbol, useExchangeSocket, useFormState, useTimer, useWizard)
- **app/store/** – Pinia-хранилища (useAuthStore.ts, useConnectionStore.ts, useDashboardStore.ts, useTradeStore.ts, useUserStore.ts)
- **app/plugins/** – плагины не используются (папка пустая)
- **app/models/** – Trade.ts
- **app/api/keys/** – query key генераторы для TanStack Query
- **app/assets/** – стили (global.css) и SVG-иконки
- **app/public/** – статика
- **server/** – прослойка между фронтом и бэкендом (routes/bybit/klines.ts, plugins/socket.io.ts, utils/Bybit.ts, utils/Exchange.ts)
- **shared/types/** – типы (index.ts, api.ts, components.ts, router.d.ts)
- **shared/utils/** – утилиты (index.ts, constants.ts, tableColumns.ts)

Тесты (папка `test/`)

- **unit/** – Для «чистых» хелперов, чистой бизнес-логики и утилит. Окружение: node.
- **nuxt/** – Для компонентов, composables и плагинов, где жизненно важны автоимпорты (`ref`, `computed`, `useFetch` и т.д.). Окружение: nuxt.

Технологический стек:

- **Node.js** 24.22.1
- **TypeScript** 6.0.3
- **Nuxt** 4.6.1 (Nuxt 4)
- **Vue** 3 (Composition API, `<script setup>`)
- **Tailwind CSS** 4.3.3 (через @tailwindcss/vite)
- **Pinia** 3.0.4 (@pinia/nuxt)
- **TanStack Query** 1.12.0 (@peterbud/nuxt-query)
- **Zod** 4.6.5
- **socket.io** 4.8.4 + socket.io-client
- **ECharts** 6.1.0 + vue-echarts + nuxt-echarts
- **lightweight-charts** 5.3.0
- **VueUse** 14.3.0 (@vueuse/nuxt)
- **Notivue** 2.4.5 (уведомления)
- **Vitest** 4.1.7 + @nuxt/test-utils 4.0.3 + happy-dom
- **@nuxt/image** 2.1.0 (ipx provider, webp)
- **nuxt-svgo** 5.3.0 (SVG-иконки как компоненты)
- **@nuxt/fonts** 0.14.0 (Inter)
- **@floating-ui/vue** 2.0.1
- **@vueform/slider** 2.1.10
- **maska** 3.2.2 (маски ввода)
- **Docker** (общий запуск с бэкендом)

## Установка и запуск

Проект запускается **только через Docker**, и это репозиторий фронтенда — не полный проект. Для запуска нужно собрать общую директорию, в которой рядом лежат репозитории фронта и бека.

### Требования

- Docker и Docker Compose
- Node.js 24.22.1 (нужен только для локальной разработки без Docker)
- yarn (1.22.22) — менеджер пакетов

### Структура общей директории

Создайте общую директорию проекта и склонируйте в неё оба репозитория так, чтобы получилась структура:

```
project/
├── frontend/              # этот репозиторий
│   ├── .env               # создать по примеру .env.example
│   ├── .env.example
│   └── ...
├── backend/                # репозиторий бека
│   └── ...
├── .env                    # общий .env для docker-compose
├── docker-compose.yml
└── nginx.conf
```

### Шаг 1. Настройка окружения фронта

Внутри директории `frontend` (этого репозитория) создайте файл `.env` по примеру `.env.example`, подставив свои значения:

```bash
cp .env.example .env
```

### Шаг 2. Общие файлы

В корне общей директории (`project/`, на уровень выше `frontend` и `backend`) должны находиться три файла:

- `.env` — общие переменные окружения для docker-compose
- `docker-compose.yml` — описание сервисов (фронт, бек, миграции, nginx и т.д.)
- `nginx.conf` — конфигурация nginx

### Шаг 3. Миграции

Если в проекте участвует бек, перед первым запуском выполните миграции. Команда выполняется из общей директории (там, где лежит `docker-compose.yml`):

```bash
docker compose run --rm migrate
```

### Шаг 4. Запуск проекта

Из той же общей директории соберите и запустите все сервисы:

```bash
docker compose up --build -d
```

### Просмотр логов

```bash
docker compose logs -f
```

### Остановка контейнеров

```bash
docker compose down
```

После запуска сервер будет доступен по ссылке `http://localhost:3000` (либо по адресу, настроенному в `nginx.conf`).

## Локальная разработка без Docker (опционально)

Если нужно запустить только фронт без Docker, для разработки/отладки:

```bash
yarn install
yarn dev
```

Обратите внимание: для корректной работы с REST API и WebSocket в этом режиме также необходим файл `.env` внутри `frontend`, созданный по примеру `.env.example`.

Документация будет пополняться.
