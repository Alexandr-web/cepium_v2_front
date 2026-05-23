# Тесты в Nuxt 4

Папка `test/` предназначена для хранения всех возможных тестов (unit, nuxt, e2e). Работает через [vitest](https://nuxt.com/docs/4.x/getting-started/testing)

В Nuxt 4 рекомендуется делить тесты по типу окружения, чтобы избежать лишней инициализации тяжелого рантайма Nuxt там, где нужны обычные изоляционные Node.js тесты:

- **test/unit/** (Окружение Node): Для «чистых» хелперов, чистой бизнес-логики и утилит. Они работают молниеносно.
- **test/nuxt/** или **test/components/** (Окружение Nuxt): Для компонентов, composables и плагинов, где жизненно важны автоимпорты (`ref`, `computed`, `useFetch` и т.д.).

Вы можете настроить это разделение через секцию workspace в `vitest.config.ts`

*Примеры*:

**unit-тест**

```ts
// test/unit/currency.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from '~/app/utils/currency';

describe('formatPrice', () => {
  it('должен корректно форматировать число в рубли', () => {
    expect(formatPrice(1500)).toBe('1 500 ₽');
  });
});
```

**nuxt-тест**

```ts
// test/nuxt/BaseButton.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '~/app/components/BaseButton.vue';

describe('BaseButton', () => {
  it('рендерит переданный текст и реагирует на клик', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Отправить' }
    });
    
    expect(wrapper.text()).toContain('Отправить');
    
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
```

Для создания заглушек (моков) глобальных функций Nuxt (таких как `useRuntimeConfig` или `useRouter`), в пакете `@nuxt/test-utils` предусмотрен специальный метод `mockNuxtImport`

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