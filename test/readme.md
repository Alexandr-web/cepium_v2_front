# Тесты в Nuxt 4

Папка `test/` предназначена для хранения всех возможных тестов (unit, nuxt, e2e). Работает через [vitest](https://nuxt.com/docs/4.x/getting-started/testing)

## Конфигурация

В `vitest.config.ts` настроены три проекта:

| Проект | Окружение | Путь к тестам | Скрипт |
|--------|-----------|---------------|--------|
| `unit` | `node` | `test/unit/*.{test,spec}.ts` | `yarn test-unit` |
| `e2e` | `node` | `test/e2e/*.{test,spec}.ts` | `yarn test` |
| `nuxt` | `nuxt` | `test/nuxt/*.{test,spec}.ts` | `yarn test-nuxt` |

Запуск всех тестов: `yarn test`

## Unit-тесты (`test/unit/`)

Для «чистых» хелперов, чистой бизнес-логики и утилит. Работают в окружении Node.js, без инициализации Nuxt.

*Примеры*: форматирование чисел (`formatNum`), дат (`formatTime`, `formatIsoToPrettyStr`), обработка ошибок (`getRequestErrorMessage`, `prettyError`, `parseExchangeErrorMessage`), утилиты (`hasKey`, `isNumber`, `isNegativeZero`, `extractBaseSymbol`, `getURLFile`, `isCurrentDate`, `formatNumberSign`, `getFiltersQuery`, `getUrlCoinIcon`, `formatLocalDate`).

**unit-тест**

```ts
// test/unit/currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatNum } from '~/shared/utils/index';

describe('formatNum', () => {
  it('должен корректно форматировать число', () => {
    expect(formatNum(1500)).toBe('1 500');
  });
});
```

## Nuxt-тесты (`test/nuxt/`)

Для компонентов, composables и плагинов, где жизненно важны автоимпорты (`ref`, `computed`, `useFetch` и т.д.). Окружение `nuxt` через `@nuxt/test-utils`.

*Примеры*: тесты атомов (`AButton`, `AInput`, `ASelect`, `ACheckbox`, `AImage`, `AError`, `APagination`, `ASlider`, `ATab`, `ATag`, `Connection`, `LabelField`, `ProgressLine`), composables (`useFormState`).

**nuxt-тест**

```ts
// test/nuxt/BaseButton.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AButton from '~/app/components/atoms/AButton.vue';

describe('AButton', () => {
  it('рендерит переданный текст и реагирует на клик', async () => {
    const wrapper = mount(AButton, {
      slots: { default: 'Отправить' }
    });
    
    expect(wrapper.text()).toContain('Отправить');
    
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
```

## Моки Nuxt-функций

Для создания заглушек (моков) глобальных функций Nuxt (таких как `useRuntimeConfig` или `useRouter`) в пакете `@nuxt/test-utils` предусмотрен специальный метод `mockNuxtImport`.

*Пример*:

```ts
// test/nuxt/composable.test.ts
import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useUserAuth } from '~/app/composables/auth';

// Создаем заглушку для useNavigateTo
const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }));
mockNuxtImport('navigateTo', () => navigateToMock);

describe('useUserAuth', () => {
  it('должен перенаправлять на главную при успешном логине', () => {
    const auth = useUserAuth();
    auth.login('user', 'pass');
    
    expect(navigateToMock).toHaveBeenCalledWith('/');
  });
});
```

## Моковые данные (`test/setup/`)

Папка `test/setup/` предназначена для хранения моковых данных, которые могут использоваться в разных тестах. При создании файла в этой директории подключите его через свойство `setupFiles` в конфигурации `vitest.config.ts`.
