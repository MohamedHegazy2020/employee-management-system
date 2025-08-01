# Enhanced Table Components

This directory contains enhanced, reusable table components with modern UI design and advanced functionality.

## Components

### BaseTable
A comprehensive, feature-rich table component that replaces PrimeVue's DataTable with enhanced styling and functionality.

### TableCell
Specialized cell components for different data types with built-in formatting and styling.

### BasePagination
Enhanced pagination component with modern UI and advanced features.

## Features

### BaseTable Features
- ✅ **Enhanced UI Design**: Modern, clean design with gradients, shadows, and animations
- ✅ **Built-in Search**: Global search functionality with customizable search fields
- ✅ **Advanced Pagination**: Enhanced pagination with jump-to-page functionality
- ✅ **Column Templates**: Customizable column templates for different data types
- ✅ **Row Selection**: Multi-select functionality with bulk actions
- ✅ **Sorting**: Built-in sorting with visual indicators
- ✅ **Filtering**: Column-specific filtering capabilities
- ✅ **Loading States**: Beautiful loading animations and states
- ✅ **Responsive Design**: Mobile-friendly responsive layout
- ✅ **Custom Actions**: Configurable action buttons (view, edit, delete)
- ✅ **Export Support**: Built-in export functionality
- ✅ **Accessibility**: ARIA labels and keyboard navigation support

### TableCell Features
- ✅ **Multiple Data Types**: Text, number, date, status, avatar, badge, progress, currency
- ✅ **Auto-formatting**: Automatic formatting for different data types
- ✅ **Status Indicators**: Color-coded status tags and badges
- ✅ **Progress Bars**: Animated progress indicators
- ✅ **Avatar Support**: User avatars with fallback icons
- ✅ **Currency Formatting**: Automatic currency formatting
- ✅ **Date Formatting**: Localized date display

### BasePagination Features
- ✅ **Smart Page Display**: Intelligent page number display with ellipsis
- ✅ **Jump to Page**: Direct page navigation input
- ✅ **Rows Per Page**: Configurable items per page
- ✅ **Page Info**: Detailed pagination information
- ✅ **Keyboard Navigation**: Arrow key and Enter key support
- ✅ **Responsive Design**: Mobile-optimized pagination controls

## Usage Examples

### Basic Table
```vue
<template>
  <BaseTable
    :data="companies"
    :columns="columns"
    :loading="loading"
    title="Company Directory"
    description="Browse and manage all companies"
  />
</template>

<script setup>
import { BaseTable } from '@/components/ui';

const columns = [
  { field: 'name', header: 'Company', sortable: true },
  { field: 'email', header: 'Email', sortable: true },
  { field: 'status', header: 'Status', type: 'status' },
  { field: 'createdAt', header: 'Created', type: 'date' }
];
</script>
```

### Advanced Table with Custom Templates
```vue
<template>
  <BaseTable
    :data="employees"
    :columns="columns"
    :search-fields="['name', 'email', 'department']"
    :show-actions="true"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
  >
    <!-- Custom Actions -->
    <template #actions>
      <BaseButton label="Export" icon="pi pi-download" />
      <BaseButton label="Add Employee" icon="pi pi-plus" variant="primary" />
    </template>

    <!-- Custom Name Column -->
    <template #body-name="{ data }">
      <div class="flex items-center">
        <Avatar :image="data.avatar" :alt="data.name" />
        <div class="ml-3">
          <div class="font-medium">{{ data.name }}</div>
          <div class="text-sm text-gray-500">{{ data.title }}</div>
        </div>
      </div>
    </template>

    <!-- Custom Status Column -->
    <template #body-status="{ data }">
      <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
    </template>

    <!-- Custom Row Actions -->
    <template #row-actions="{ data }">
      <div class="flex items-center space-x-2">
        <BaseButton icon="pi pi-eye" @click="handleView(data)" />
        <BaseButton icon="pi pi-pencil" @click="handleEdit(data)" />
        <BaseButton icon="pi pi-trash" @click="handleDelete(data)" />
      </div>
    </template>
  </BaseTable>
</template>
```

### Table with Different Cell Types
```vue
<template>
  <BaseTable :data="data" :columns="columns" />
</template>

<script setup>
const columns = [
  { field: 'name', header: 'Name', type: 'text' },
  { field: 'salary', header: 'Salary', type: 'currency' },
  { field: 'progress', header: 'Progress', type: 'progress' },
  { field: 'status', header: 'Status', type: 'status' },
  { field: 'role', header: 'Role', type: 'badge' },
  { field: 'avatar', header: 'User', type: 'avatar' }
];
</script>
```

### Standalone Pagination
```vue
<template>
  <BasePagination
    :current-page="currentPage"
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
    :show-jump-to-page="true"
    @page-change="handlePageChange"
    @rows-per-page-change="handleRowsPerPageChange"
  />
</template>
```

## Column Configuration

### Column Properties
```typescript
interface TableColumn {
  field: string;                    // Data field name
  header: string;                   // Column header text
  sortable?: boolean;               // Enable sorting
  filter?: boolean;                 // Enable filtering
  filterField?: string;             // Filter field name
  filterMatchMode?: string;         // Filter match mode
  filterPlaceholder?: string;       // Filter placeholder text
  headerStyle?: string;             // Header CSS styles
  bodyStyle?: string;               // Body CSS styles
  class?: string;                   // CSS classes
  exportable?: boolean;             // Include in exports
  frozen?: boolean;                 // Freeze column
  align?: string;                   // Text alignment
  headerClass?: string;             // Header CSS classes
  bodyClass?: string;               // Body CSS classes
  type?: 'text' | 'number' | 'date' | 'status' | 'avatar' | 'badge' | 'progress' | 'currency';
  bodyTemplate?: boolean;           // Use custom body template
  headerTemplate?: boolean;         // Use custom header template
  filterTemplate?: boolean;         // Use custom filter template
}
```

### Cell Types
- **text**: Plain text display
- **number**: Formatted number with thousands separators
- **date**: Localized date formatting
- **status**: Color-coded status tags
- **avatar**: User avatars with names
- **badge**: Colored badges for categories/roles
- **progress**: Animated progress bars
- **currency**: Formatted currency values

## Slots

### BaseTable Slots
- `#actions`: Header actions (export, add, etc.)
- `#row-actions`: Row-level actions (view, edit, delete)
- `#body-{field}`: Custom cell templates for specific columns
- `#header-{field}`: Custom header templates for specific columns
- `#filter-{field}`: Custom filter templates for specific columns

## Events

### BaseTable Events
- `@search`: Fired when search query changes
- `@sort`: Fired when sorting changes
- `@page`: Fired when page changes
- `@view`: Fired when view action is clicked
- `@edit`: Fired when edit action is clicked
- `@delete`: Fired when delete action is clicked
- `@row-select`: Fired when row is selected
- `@row-unselect`: Fired when row is unselected
- `@row-select-all`: Fired when all rows are selected
- `@row-unselect-all`: Fired when all rows are unselected

### BasePagination Events
- `@page-change`: Fired when page changes
- `@rows-per-page-change`: Fired when rows per page changes

## Styling

### Custom CSS Classes
```css
/* Table wrapper */
.base-table-wrapper

/* Table header */
.table-header

/* Table container */
.table-container

/* Enhanced datatable */
.enhanced-datatable

/* Pagination wrapper */
.base-pagination

/* Pagination info */
.pagination-info

/* Pagination controls */
.pagination-controls
```

### Responsive Breakpoints
- **Desktop**: Full feature set with all controls
- **Tablet**: Condensed layout with essential features
- **Mobile**: Stacked layout with touch-friendly controls

## Best Practices

### Performance
1. **Virtual Scrolling**: Use for large datasets (>1000 rows)
2. **Lazy Loading**: Implement for paginated data
3. **Debounced Search**: Add delay to search input
4. **Memoized Computed**: Cache expensive calculations

### Accessibility
1. **ARIA Labels**: Always provide descriptive labels
2. **Keyboard Navigation**: Support arrow keys and Enter
3. **Screen Reader**: Ensure proper semantic markup
4. **Focus Management**: Maintain logical tab order

### UX Guidelines
1. **Loading States**: Show loading indicators for async operations
2. **Empty States**: Provide helpful empty state messages
3. **Error Handling**: Display user-friendly error messages
4. **Consistent Styling**: Maintain design system consistency

## Migration Guide

### From PrimeVue DataTable
```vue
<!-- Before -->
<DataTable :value="data" :paginator="true">
  <Column field="name" header="Name" />
</DataTable>

<!-- After -->
<BaseTable :data="data" :columns="columns" :show-paginator="true" />
```

### From Custom Pagination
```vue
<!-- Before -->
<div class="pagination">
  <button @click="prevPage">Previous</button>
  <span>{{ currentPage }}</span>
  <button @click="nextPage">Next</button>
</div>

<!-- After -->
<BasePagination
  :current-page="currentPage"
  :total-items="totalItems"
  :items-per-page="itemsPerPage"
  @page-change="handlePageChange"
/>
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies
- Vue 3.0+
- PrimeVue 9.0+
- Tailwind CSS 3.0+ 