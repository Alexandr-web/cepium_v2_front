# Pages в Nuxt 4

Папка `app/pages/` содержит Vue-компоненты страниц, но маршрутизация настроена не через файловую систему, а централизованно в `app/router.options.ts`. Nuxt 4 использует кастомные маршруты vue-router с динамическими импортами компонентов.

## Маршруты

Все маршруты определены в `app/router.options.ts`:

| Имя | Путь | Компонент | Middleware | SEO |
|-----|------|-----------|------------|-----|
| `home` | `/` | `index.vue` | `auth` | "Главная" |
| `configs` | `/configs` | `configs.vue` | `auth` | "Доступные конфиги" |
| `add-config` | `/configs/add` | `add-config.vue` | `auth` | "Добавление конфига" |
| `edit-config` | `/configs/:id/edit` | `edit-config.vue` | `auth` | "Изменение конфига" |
| `profile` | `/profile` | `profile.vue` | `auth` | "Профиль" |
| `statistics` | `/statistics` | `statistics.vue` | `auth` | "Статистика" |
| `orders` | `/orders` | `orders.vue` | `auth` | "История ордеров" |
| `login` | `/login` | `login.vue` | `login` | "Вход" |

## Мета-поля

Типы мета-полей объявлены в `shared/types/router.d.ts`:

- `noSocket` – не подключать WebSocket для страницы
- `noBack` – отключить кнопку «назад»
- `seo` – SEO-данные (title)
- `middleware` – имя middleware
- `layout` – имя layout (`false` отключает layout)

## Файлы страниц

| Файл | Описание |
|------|----------|
| `index.vue` | Главная страница (дашборд) |
| `login.vue` | Страница входа |
| `profile.vue` | Профиль пользователя |
| `configs.vue` | Список конфигов |
| `add-config.vue` | Создание конфига |
| `edit-config.vue` | Редактирование конфига |
| `orders.vue` | История ордеров |
| `statistics.vue` | Статистика |
