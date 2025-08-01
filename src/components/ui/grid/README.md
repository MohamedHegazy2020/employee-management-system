# BaseGridView Component

A flexible and reusable grid view component that displays data in a card-based layout with pagination, search, and filtering capabilities.

## Features

- **Responsive Grid Layout**: Automatically adjusts columns based on screen size
- **Card-based Design**: Each item is displayed in an elegant card format
- **Pagination Support**: Built-in pagination with customizable options
- **Loading States**: Smooth loading animations and empty states
- **Customizable Templates**: Flexible slots for custom item rendering
- **Action Buttons**: Built-in view, edit, and delete actions
- **Search & Filtering**: Integrated search and filter functionality
- **Accessibility**: Full keyboard navigation and screen reader support

## Props

| Prop                 | Type      | Default            | Description                                 |
| -------------------- | --------- | ------------------ | ------------------------------------------- |
| `data`               | `Array`   | `[]`               | Array of items to display in the grid       |
| `title`              | `String`  | `undefined`        | Title displayed in the grid header          |
| `description`        | `String`  | `undefined`        | Description displayed below the title       |
| `loading`            | `Boolean` | `false`            | Shows loading spinner when true             |
| `emptyMessage`       | `String`  | `'No data found'`  | Message displayed when no data is available |
| `showPaginator`      | `Boolean` | `true`             | Whether to show pagination controls         |
| `showPaginationInfo` | `Boolean` | `true`             | Whether to show pagination information      |
| `showRowsPerPage`    | `Boolean` | `true`             | Whether to show rows per page selector      |
| `rowsPerPageOptions` | `Array`   | `[12, 24, 48, 96]` | Available rows per page options             |
| `itemLabel`          | `String`  | `'items'`          | Label for pagination info                   |
| `currentPage`        | `Number`  | `1`                | Current page number                         |
| `itemsPerPage`       | `Number`  | `12`               | Number of items per page                    |

## Events

| Event                  | Parameters              | Description                           |
| ---------------------- | ----------------------- | ------------------------------------- |
| `page-change`          | `(page: number)`        | Emitted when page changes             |
| `rows-per-page-change` | `(rowsPerPage: number)` | Emitted when rows per page changes    |
| `view`                 | `(item: any)`           | Emitted when view action is clicked   |
| `edit`                 | `(item: any)`           | Emitted when edit action is clicked   |
| `delete`               | `(item: any)`           | Emitted when delete action is clicked |

## Slots

### `actions`

Header actions slot for custom buttons and controls.

```vue
<template #actions>
  <BaseButton label="Export" icon="pi pi-download" />
  <BaseButton label="Add New" icon="pi pi-plus" />
</template>
```

### `item`

Custom template for rendering each grid item.

```vue
<template #item="{ item, index }">
  <div class="space-y-4">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
    <div class="flex items-center space-x-2">
      <Tag :value="item.status" />
    </div>
  </div>
</template>
```

### `item-actions`

Custom template for item action buttons.

```vue
<template #item-actions="{ item, index }">
  <BaseButton icon="pi pi-eye" @click="viewItem(item)" />
  <BaseButton icon="pi pi-pencil" @click="editItem(item)" />
  <BaseButton icon="pi pi-trash" @click="deleteItem(item)" />
</template>
```

## Usage Examples

### Basic Usage

```vue
<template>
  <BaseGridView
    :data="companies"
    :loading="loading"
    title="Company Directory"
    description="Browse all companies in the system"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>

<script setup>
import { BaseGridView } from "@/components/ui";

const companies = ref([]);
const loading = ref(false);

const handleView = (company) => {
  router.push(`/companies/${company.id}`);
};

const handleEdit = (company) => {
  router.push(`/companies/${company.id}/edit`);
};

const handleDelete = (company) => {
  // Handle delete logic
};
</script>
```

### With Custom Item Template

```vue
<template>
  <BaseGridView
    :data="employees"
    :loading="loading"
    title="Employee Directory"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <template #item="{ item }">
      <div class="space-y-4">
        <!-- Employee Avatar and Name -->
        <div class="flex items-center space-x-3">
          <Avatar :image="item.avatar" :label="item.name" />
          <div>
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">{{ item.position }}</p>
          </div>
        </div>

        <!-- Employee Details -->
        <div class="space-y-2">
          <div class="flex items-center text-sm text-gray-600">
            <i class="pi pi-envelope mr-2"></i>
            <span>{{ item.email }}</span>
          </div>
          <div class="flex items-center text-sm text-gray-600">
            <i class="pi pi-building mr-2"></i>
            <span>{{ item.company }}</span>
          </div>
        </div>

        <!-- Performance Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span>Performance</span>
            <span>{{ item.performance }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full bg-green-500"
              :style="{ width: `${item.performance}%` }"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </BaseGridView>
</template>
```

### With Pagination

```vue
<template>
  <BaseGridView
    :data="filteredData"
    :current-page="currentPage"
    :items-per-page="itemsPerPage"
    :loading="loading"
    title="Product Catalog"
    @page-change="handlePageChange"
    @rows-per-page-change="handleRowsPerPageChange"
  />
</template>

<script setup>
const currentPage = ref(1);
const itemsPerPage = ref(12);

const handlePageChange = (page) => {
  currentPage.value = page;
  // Fetch data for new page
};

const handleRowsPerPageChange = (rowsPerPage) => {
  itemsPerPage.value = rowsPerPage;
  currentPage.value = 1; // Reset to first page
  // Fetch data with new page size
};
</script>
```

## Responsive Behavior

The grid automatically adjusts its layout based on screen size:

- **Mobile (≤640px)**: 1 column
- **Small (641px-1024px)**: 2 columns
- **Large (1025px-1280px)**: 3 columns
- **Extra Large (≥1281px)**: 4 columns

## Styling

The component uses Tailwind CSS classes and can be customized with:

- **Card Styling**: Each item is wrapped in a PrimeVue Card component
- **Hover Effects**: Subtle hover animations on cards
- **Shadows**: Consistent shadow system for depth
- **Borders**: Thin borders for clean separation
- **Spacing**: Consistent spacing using Tailwind's spacing scale

## Accessibility

- **Keyboard Navigation**: Full keyboard support for navigation
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets WCAG contrast requirements

## Performance

- **Virtual Scrolling**: Efficient rendering for large datasets
- **Lazy Loading**: Images and content loaded on demand
- **Debounced Search**: Optimized search performance
- **Memoized Computations**: Efficient filtering and pagination

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Vue 3.x
- PrimeVue 9.x
- Tailwind CSS 3.x
