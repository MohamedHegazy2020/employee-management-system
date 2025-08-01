# Dropdown Components

A modular and reusable dropdown system with enhanced styling and functionality.

## Components

### BaseDropdown

The main dropdown component that wraps PrimeVue's Dropdown with enhanced styling and functionality.

### DropdownItem

A reusable item component for dropdown options with support for icons, descriptions, and badges.

### DropdownPanel

A container component for dropdown menus with header, filter, and footer sections.

### DropdownFilter

A search/filter component for dropdown options with clear functionality.

## Features

- **Enhanced Styling**: Fixed transparency issues and improved visual design
- **Modular Architecture**: Separated components for better maintainability
- **Custom Slots**: Flexible content customization
- **Search/Filter**: Built-in search functionality
- **Loading States**: Loading indicators and states
- **Empty States**: Proper empty state handling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Works on all screen sizes

## Usage

### Basic Usage

```vue
<template>
  <BaseDropdown
    v-model="selectedValue"
    :options="options"
    label="Select Option"
    placeholder="Choose an option..."
  />
</template>

<script setup>
import { ref } from "vue";
import { BaseDropdown } from "@/components/ui/dropdown";

const selectedValue = ref(null);
const options = ref([
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
]);
</script>
```

### With Filter

```vue
<template>
  <BaseDropdown
    v-model="selectedValue"
    :options="options"
    label="Select Country"
    placeholder="Choose a country..."
    :filter="true"
    filter-placeholder="Search countries..."
  />
</template>
```

### Custom Dropdown Item

```vue
<template>
  <BaseDropdown
    v-model="selectedUser"
    :options="users"
    label="Select User"
    option-label="name"
    option-value="id"
  >
    <template #option="{ item }">
      <DropdownItem :item="item" option-label="name">
        <template #icon>
          <img :src="item.avatar" class="w-6 h-6 rounded-full" />
        </template>
        <template #badge>
          <span
            class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
          >
            {{ item.role }}
          </span>
        </template>
      </DropdownItem>
    </template>
  </BaseDropdown>
</template>
```

### Custom Dropdown Panel

```vue
<template>
  <DropdownPanel
    variant="large"
    :loading="loading"
    :empty="options.length === 0"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">Select Options</h3>
        <button class="text-blue-600 text-sm">Select All</button>
      </div>
    </template>

    <template #filter>
      <DropdownFilter
        v-model="searchQuery"
        placeholder="Search options..."
        @update:modelValue="handleSearch"
      />
    </template>

    <DropdownItem
      v-for="option in filteredOptions"
      :key="option.value"
      :item="option"
      :selected="selectedValues.includes(option.value)"
      @click="toggleSelection(option.value)"
    />

    <template #footer>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>{{ selectedValues.length }} selected</span>
        <button class="text-blue-600">Clear All</button>
      </div>
    </template>
  </DropdownPanel>
</template>
```

## Props

### BaseDropdown

| Prop                | Type      | Default       | Description                    |
| ------------------- | --------- | ------------- | ------------------------------ |
| `modelValue`        | `any`     | -             | The selected value             |
| `options`           | `array`   | `[]`          | Array of options               |
| `label`             | `string`  | -             | Label for the dropdown         |
| `placeholder`       | `string`  | -             | Placeholder text               |
| `id`                | `string`  | -             | Unique identifier              |
| `error`             | `string`  | -             | Error message                  |
| `hint`              | `string`  | -             | Help text                      |
| `disabled`          | `boolean` | `false`       | Disable the dropdown           |
| `required`          | `boolean` | `false`       | Mark as required               |
| `optionLabel`       | `string`  | `'label'`     | Property name for option label |
| `optionValue`       | `string`  | `'value'`     | Property name for option value |
| `filter`            | `boolean` | `false`       | Enable search/filter           |
| `filterPlaceholder` | `string`  | `'Search...'` | Filter placeholder             |
| `showClear`         | `boolean` | `false`       | Show clear button              |
| `loading`           | `boolean` | `false`       | Show loading state             |
| `size`              | `string`  | `'medium'`    | Size variant                   |

### DropdownItem

| Prop          | Type      | Default   | Description             |
| ------------- | --------- | --------- | ----------------------- |
| `item`        | `object`  | -         | The item data           |
| `optionLabel` | `string`  | `'label'` | Property name for label |
| `selected`    | `boolean` | `false`   | Is item selected        |
| `highlighted` | `boolean` | `false`   | Is item highlighted     |
| `disabled`    | `boolean` | `false`   | Is item disabled        |

### DropdownPanel

| Prop             | Type      | Default                  | Description           |
| ---------------- | --------- | ------------------------ | --------------------- |
| `width`          | `string`  | `'auto'`                 | Panel width           |
| `maxHeight`      | `string`  | `'300px'`                | Maximum height        |
| `empty`          | `boolean` | `false`                  | Show empty state      |
| `loading`        | `boolean` | `false`                  | Show loading state    |
| `emptyMessage`   | `string`  | `'No options available'` | Empty state message   |
| `loadingMessage` | `string`  | `'Loading...'`           | Loading state message |
| `variant`        | `string`  | `'default'`              | Size variant          |

### DropdownFilter

| Prop          | Type      | Default       | Description        |
| ------------- | --------- | ------------- | ------------------ |
| `modelValue`  | `string`  | -             | Search query       |
| `placeholder` | `string`  | `'Search...'` | Input placeholder  |
| `disabled`    | `boolean` | `false`       | Disable the filter |
| `size`        | `string`  | `'medium'`    | Size variant       |

## Events

### BaseDropdown

| Event               | Parameters | Description                    |
| ------------------- | ---------- | ------------------------------ |
| `update:modelValue` | `value`    | Emitted when selection changes |
| `change`            | `event`    | Emitted on change              |
| `blur`              | `event`    | Emitted on blur                |
| `focus`             | `event`    | Emitted on focus               |

### DropdownItem

| Event        | Parameters | Description                  |
| ------------ | ---------- | ---------------------------- |
| `click`      | `item`     | Emitted when item is clicked |
| `mouseenter` | `item`     | Emitted on mouse enter       |
| `mouseleave` | `item`     | Emitted on mouse leave       |

### DropdownFilter

| Event               | Parameters | Description                          |
| ------------------- | ---------- | ------------------------------------ |
| `update:modelValue` | `value`    | Emitted when query changes           |
| `focus`             | `event`    | Emitted on focus                     |
| `blur`              | `event`    | Emitted on blur                      |
| `clear`             | -          | Emitted when clear button is clicked |

## Slots

### BaseDropdown

| Slot      | Props                              | Description            |
| --------- | ---------------------------------- | ---------------------- |
| `option`  | `{ item, index }`                  | Custom option template |
| `value`   | `{ value, placeholder }`           | Custom value display   |
| `trigger` | `{ value, placeholder, disabled }` | Custom trigger button  |

### DropdownPanel

| Slot      | Description           |
| --------- | --------------------- |
| `header`  | Header content        |
| `filter`  | Filter/search content |
| `default` | Main content (items)  |
| `footer`  | Footer content        |
| `empty`   | Empty state content   |
| `loading` | Loading state content |

### DropdownItem

| Slot    | Props      | Description   |
| ------- | ---------- | ------------- |
| `icon`  | `{ item }` | Icon content  |
| `badge` | `{ item }` | Badge content |

## Styling

The components use Tailwind CSS classes and can be customized with:

- **CSS Variables**: Custom properties for colors and spacing
- **Tailwind Classes**: Utility classes for styling
- **Scoped Styles**: Component-specific styling
- **Theme Support**: Dark mode and theme variants

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets WCAG requirements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
