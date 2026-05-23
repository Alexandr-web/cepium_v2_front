# Components в Nuxt 4 (Atomic Design)

Папка `app/components/` — это центральное место для всех Vue-компонентов в проекте. В Nuxt 4 она поддерживает **автоимпорт** (не нужно вручную импортировать компоненты перед использованием), а также позволяет использовать вложенные папки и префиксы для удобной организации.

В этом проекте принята методология **Atomic Design**, которая делит компоненты на пять уровней:

- components/
  - atoms/ # Атомы – базовые строительные блоки (кнопка, инпут, иконка)
  - molecules/ # Молекулы – комбинации атомов (форма поиска, карточка товара)
  - organisms/ # Организмы – сложные секции (шапка, футер, слайдер)


> **Примечание:** Страницы (`app/pages/*.vue`) обычно находятся вне `app/components/`, но в методологии они являются высшим уровнем – **страницами**, собранными из организмов.

## Что такое Atomic Design?

**Atomic Design** – это методология создания интерфейсных систем, предложенная Брэдом Фростом. Она помогает создавать масштабируемые, переиспользуемые и легко поддерживаемые компоненты.

| Уровень       | Описание                                                                 | Примеры                                      |
|---------------|--------------------------------------------------------------------------|----------------------------------------------|
| **Атомы**     | Базовые HTML-элементы с минимальной логикой и стилями. Не зависят от контекста. | `Button.vue`, `Input.vue`, `Icon.vue`, `Heading.vue` |
| **Молекулы**  | Комбинации атомов, формирующие простой функциональный блок.              | `SearchForm.vue`, `ProductCard.vue`, `UserAvatar.vue` |
| **Организмы** | Сложные секции, составленные из молекул и атомов. Могут содержать бизнес-логику. | `Header.vue`, `ProductList.vue`, `Footer.vue`, `Modal.vue` |
| **Шаблоны**   | Каркасы страниц, определяющие расположение организмов без конкретного содержимого. | `DefaultLayout.vue`, `CheckoutTemplate.vue` |
| **Страницы**  | (вне app/components/) – конкретные страницы, использующие шаблоны и организмы. | `index.vue`, `product-id.vue`              |

## Структура папок

### Атомы (`app/components/atoms/`)

Самые маленькие и простые компоненты. Они:

- Не содержат бизнес-логики.
- Принимают пропсы для кастомизации.
- Не зависят от внешнего состояния (в идеале чисто презентационные).

- atoms/
  - Button.vue
  - Input.vue
  - Checkbox.vue
  - Icon.vue
  - Typography/
    - Heading.vue
    - Text.vue

**Пример `atoms/Button.vue`**

```vue
<template>
  <button :class="['btn', `btn--${variant}`]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>();

defineEmits<{
  (e: 'click'): void
}>();
</script>
```

### Молекулы (`app/components/molecules/`)

Состоят из 2+ атомов и формируют повторяемый блок. Молекулы могут иметь небольшую логику, но не должны управлять глобальным состоянием.

- molecules/
  - SearchBar.vue      (Input + Button)
  - ProductCard.vue    (Image + Heading + Text + Button)
  - UserMenu.vue       (Avatar + Text + Dropdown)
  - FormField.vue      (Label + Input + ErrorMessage)

**Пример `molecules/SearchBar.vue`**

```vue
<template>
  <div class="search-bar">
    <AtomsInput v-model="query" placeholder="Поиск..." @keyup.enter="search" />
    <AtomsButton variant="primary" @click="search">Найти</AtomsButton>
  </div>
</template>

<script setup lang="ts">
const query = ref("");
const emit = defineEmits<{ (e: "search", value: string): void }>();
const search = () => emit("search", query.value);
</script>
```

### Организмы (`app/components/organisms/`)

Крупные составные блоки, формирующие секции страницы. Могут содержать бизнес-логику, работать с хранилищем (Pinia) и API. Организмы часто являются "умными" компонентами.

- organisms/
  - Header.vue          (Logo + Navigation + UserMenu)
  - ProductGrid.vue     (загружает товары и рендерит ProductCard)
  - Footer.vue
  - CheckoutForm.vue    (сложная форма с валидацией)
  - CartSidebar.vue     (работает с корзиной из store)

**Пример `organisms/ProductGrid.vue`**

```vue
<template>
  <div class="product-reviews">
    <h3>Отзывы ({{ reviews.length }})</h3>
    <div v-for="review in reviews" :key="review.id" class="review">
      <MoleculesRatingStars :rating="review.rating" />
      <p>{{ review.text }}</p>
      <AtomsText size="sm">{{ review.author }}</AtomsText>
    </div>
    <AtomsButton @click="loadMore">Загрузить ещё</AtomsButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ productId: number }>()
const { data: reviews, refresh } = await useFetch(`/api/products/${props.productId}/reviews`)
function loadMore() { /* пагинация */ }
</script>
```

## Лучшие практики

- Следуйте иерархии – атомы не импортируют молекулы, молекулы не импортируют организмы.
- Документируйте компоненты – используйте Storybook или JSDoc-комментарии.
- Тестируйте изолированно – атомы и молекулы легко тестировать без бекенда.
- Избегайте глубокой вложенности – более 3 уровней (atoms → molecules → organisms) усложняют поддержку.
- Не бойтесь создавать много атомов – чем мельче, тем переиспользуемее.
- Шаблоны и страницы – не пишите сложную логику в шаблонах; страницы должны быть "тонкими".