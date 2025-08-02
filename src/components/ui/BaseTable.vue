<template>
  <div class="base-table-wrapper">
    <!-- Enhanced Header with Search and Actions -->
    <div
      v-if="showHeader"
      class="table-header bg-white rounded-t-xl border-b border-gray-200 p-6"
    >
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <!-- Title and Description -->
        <div class="flex-1">
          <h3 v-if="title" class="text-lg font-bold text-gray-900 mb-1">
            {{ title }}
          </h3>
          <p v-if="description" class="text-sm text-gray-600">
            {{ description }}
          </p>
        </div>

        <!-- Search and Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search Input -->
          <div v-if="showSearch" class="relative">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search..."
              icon="pi pi-search"
              class="w-full sm:w-64"
              @input="handleSearch"
            />
          </div>

          <!-- Action Buttons -->
          <div v-if="$slots.actions" class="flex items-center gap-2">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced DataTable -->
    <div class="table-container bg-white rounded-b-xl overflow-hidden">
      <DataTable
        :value="paginatedData || []"
        :paginator="showPaginator"
        :rows="rowsPerPage"
        :totalRecords="filteredData.length"
        :loading="loading"
        :rowsPerPageOptions="rowsPerPageOptions"
        :paginatorTemplate="paginatorTemplate"
        :currentPageReportTemplate="currentPageReportTemplate"
        :stripedRows="stripedRows"
        :sortField="sortField"
        :sortOrder="sortOrder"
        :filters="filters"
        :globalFilterFields="globalFilterFields"
        :emptyMessage="emptyMessage"
        :showGridlines="showGridlines"
        :responsiveLayout="responsiveLayout"
        :tableStyle="tableStyle"
        class="enhanced-datatable"
        :class="tableClasses"
        @sort="handleSort"
        @page="handlePageChange"
        @row-select="handleRowSelect"
        @row-unselect="handleRowUnselect"
        @row-select-all="handleRowSelectAll"
        @row-unselect-all="handleRowUnselectAll"
      >
        <!-- Selection Column -->
        <Column
          v-if="selectable"
          selectionMode="multiple"
          headerStyle="width: 3rem"
          class="selection-column"
        />

        <!-- Dynamic Columns -->
        <template v-for="column in columns" :key="column.field">
          <Column
            :field="column.field"
            :header="column.header"
            :sortable="column.sortable"
            :filter="column.filter"
            :filterField="column.filterField"
            :filterMatchMode="column.filterMatchMode"
            :filterPlaceholder="column.filterPlaceholder"
            :headerStyle="column.headerStyle"
            :bodyStyle="column.bodyStyle"
            :class="column.class"
            :exportable="column.exportable"
            :frozen="column.frozen"
            :align="column.align"
            :headerClass="column.headerClass"
            :bodyClass="column.bodyClass"
            :style="column.style"
          >
            <template #header v-if="column.headerTemplate">
              <slot :name="`header-${column.field}`" :column="column" />
            </template>

            <template
              #body="{ data, index }"
              v-if="column.bodyTemplate || column.type"
            >
              <slot
                :name="`body-${column.field}`"
                :data="data"
                :column="column"
                :index="index"
              >
                <!-- Default cell renderers -->
                <TableCell
                  v-if="column.type"
                  :value="data[column.field]"
                  :type="column.type"
                  :data="data"
                  :column="column"
                />
              </slot>
            </template>

            <template #filter v-if="column.filterTemplate">
              <slot :name="`filter-${column.field}`" :column="column" />
            </template>
          </Column>
        </template>

        <!-- Actions Column -->
        <Column
          v-if="showActions"
          header="Actions"
          :exportable="false"
          style="min-width: 8rem"
          class="actions-column"
        >
          <template #body="{ data, index }">
            <slot name="row-actions" :data="data" :index="index">
              <div class="flex items-center justify-center space-x-2">
                <BaseButton
                  v-if="showViewAction"
                  icon="pi pi-eye"
                  variant="info"
                  size="small"
                  padding="compact"
                  @click="handleView(data)"
                />
                <BaseButton
                  v-if="showEditAction"
                  icon="pi pi-pencil"
                  variant="primary"
                  size="small"
                  padding="compact"
                  @click="handleEdit(data)"
                />
                <BaseButton
                  v-if="showDeleteAction"
                  icon="pi pi-trash"
                  variant="error"
                  size="small"
                  padding="compact"
                  @click="handleDelete(data)"
                />
              </div>
            </slot>
          </template>
        </Column>

        <!-- Paginator Start Slot -->
        <template #paginatorstart>
          <slot name="paginator-start">
            <BaseButton
              v-if="showRefreshButton"
              icon="pi pi-refresh"
              variant="secondary"
              size="small"
              padding="compact"
              @click="handleRefresh"
            />
          </slot>
        </template>

        <!-- Paginator End Slot -->
        <template #paginatorend>
          <slot name="paginator-end">
            <BaseButton
              v-if="showExportButton"
              icon="pi pi-download"
              variant="warning"
              size="small"
              padding="compact"
              @click="handleExport"
            />
          </slot>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { BaseButton, BaseInput } from "@/components/ui";
import TableCell from "./table/TableCell.vue";

// Types
interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterField?: string;
  filterMatchMode?: string;
  filterPlaceholder?: string;
  headerStyle?: string;
  bodyStyle?: string;
  class?: string;
  exportable?: boolean;
  frozen?: boolean;
  align?: string;
  headerClass?: string;
  bodyClass?: string;
  style?: string;
  type?:
    | "text"
    | "number"
    | "date"
    | "status"
    | "avatar"
    | "badge"
    | "progress"
    | "currency";
  bodyTemplate?: boolean;
  headerTemplate?: boolean;
  filterTemplate?: boolean;
}

interface PaginationInfo {
  first: number;
  last: number;
  total: number;
}

interface Props {
  // Data
  data: any[];
  columns: TableColumn[];

  // Table Configuration
  title?: string;
  description?: string;
  loading?: boolean;
  stripedRows?: boolean;
  showGridlines?: boolean;
  responsiveLayout?: string;
  tableStyle?: string;

  // Header
  showHeader?: boolean;
  showSearch?: boolean;

  // Pagination
  showPaginator?: boolean;
  showPaginationInfo?: boolean;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  paginatorTemplate?: string;
  currentPageReportTemplate?: string;

  // Selection
  selectable?: boolean;
  selectedItems?: any[];

  // Actions
  showActions?: boolean;
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  showRefreshButton?: boolean;
  showExportButton?: boolean;

  // Search and Filtering
  searchFields?: string[];
  filters?: any;
  globalFilterFields?: string[];

  // Sorting
  sortField?: string;
  sortOrder?: number;

  // Styling
  tableClasses?: string;
  itemLabel?: string;

  // Messages
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stripedRows: true,
  showGridlines: false,
  responsiveLayout: "scroll",
  tableStyle: "min-width: 50rem",
  showHeader: true,
  showSearch: true,
  showPaginator: true,
  showPaginationInfo: true,
  rowsPerPage: 10,
  rowsPerPageOptions: () => [10, 20, 50, 100],
  paginatorTemplate:
    "RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
  currentPageReportTemplate:
    "Showing {first} to {last} of {totalRecords} entries",
  selectable: false,
  selectedItems: () => [],
  showActions: true,
  showViewAction: true,
  showEditAction: true,
  showDeleteAction: true,
  showRefreshButton: true,
  showExportButton: true,
  searchFields: () => [],
  itemLabel: "items",
  emptyMessage: "No records found",
  tableClasses: "",
});

const emit = defineEmits<{
  "update:selectedItems": [items: any[]];
  search: [query: string];
  sort: [field: string, order: number];
  page: [page: number];
  view: [data: any];
  edit: [data: any];
  delete: [data: any];
  refresh: [];
  export: [];
  "row-select": [data: any];
  "row-unselect": [data: any];
  "row-select-all": [data: any[]];
  "row-unselect-all": [];
}>();

// Reactive data
const searchQuery = ref("");
const currentPage = ref(1);
const rowsPerPage = ref(props.rowsPerPage);
const jumpToPage = ref(1);
const selectedItems = ref<any[]>(props.selectedItems);

// Computed properties
const filteredData = computed(() => {
  console.log("Original data:", props.data);
  if (!searchQuery.value || props.searchFields.length === 0) {
    return props.data;
  }

  const query = searchQuery.value.toLowerCase();
  return props.data.filter((item) =>
    props.searchFields.some((field) =>
      String(item[field]).toLowerCase().includes(query)
    )
  );
});

const paginatedData = computed(() => {
  if (!props.showPaginator) {
    return filteredData.value;
  }

  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  const result = filteredData.value.slice(start, end);
  console.log("Paginated data:", result);
  return result;
});

const paginationInfo = computed((): PaginationInfo => {
  const total = filteredData.value.length;
  const first =
    total === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1;
  const last = Math.min(currentPage.value * rowsPerPage.value, total);

  return { first, last, total };
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / rowsPerPage.value);
});

// Methods
const handleSearch = () => {
  emit("search", searchQuery.value);
  currentPage.value = 1;
  jumpToPage.value = 1;
};

const handleSort = (event: any) => {
  emit("sort", event.sortField, event.sortOrder);
};

const handlePageChange = (event: any) => {
  currentPage.value = event.page + 1;
  jumpToPage.value = currentPage.value;
  emit("page", currentPage.value);
};

const handleRowsPerPageChange = () => {
  currentPage.value = 1; // Reset to first page when changing rows per page
  jumpToPage.value = 1;
  emit("rows-per-page-change", rowsPerPage.value);
};

const handleJumpToPage = () => {
  if (
    jumpToPage.value &&
    jumpToPage.value >= 1 &&
    jumpToPage.value <= totalPages.value
  ) {
    currentPage.value = jumpToPage.value;
    emit("page", currentPage.value);
  } else {
    // Reset to current page if invalid input
    jumpToPage.value = currentPage.value;
  }
};

const handleView = (data: any) => {
  emit("view", data);
};

const handleEdit = (data: any) => {
  emit("edit", data);
};

const handleDelete = (data: any) => {
  emit("delete", data);
};

const handleRefresh = () => {
  emit("refresh");
};

const handleExport = () => {
  emit("export");
};

const handleRowSelect = (event: any) => {
  selectedItems.value = [...selectedItems.value, event.data];
  emit("update:selectedItems", selectedItems.value);
  emit("row-select", event.data);
};

const handleRowUnselect = (event: any) => {
  selectedItems.value = selectedItems.value.filter(
    (item) => item !== event.data
  );
  emit("update:selectedItems", selectedItems.value);
  emit("row-unselect", event.data);
};

const handleRowSelectAll = (event: any) => {
  selectedItems.value = [...event.data];
  emit("update:selectedItems", selectedItems.value);
  emit("row-select-all", event.data);
};

const handleRowUnselectAll = () => {
  selectedItems.value = [];
  emit("update:selectedItems", selectedItems.value);
  emit("row-unselect-all");
};

const clearSelection = () => {
  selectedItems.value = [];
  emit("update:selectedItems", selectedItems.value);
};

const getCellComponent = (type: string) => {
  // Return the TableCell component for all types
  return TableCell;
};

// Watchers
watch(
  () => props.selectedItems,
  (newItems) => {
    selectedItems.value = newItems;
  }
);

watch(
  () => props.rowsPerPage,
  (newRowsPerPage) => {
    rowsPerPage.value = newRowsPerPage;
  }
);

watch(currentPage, (newPage) => {
  jumpToPage.value = newPage;
});

watch(searchQuery, () => {
  handleSearch();
});
</script>

<style scoped>
.base-table-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid rgb(229 231 235);
}

.table-header {
  background: linear-gradient(
    135deg,
    rgb(255 255 255) 0%,
    rgb(249 250 251) 100%
  );
}

.table-container {
  border: none;
  border-radius: 0;
}

.enhanced-datatable {
  border: none;
}

.enhanced-datatable :deep(.p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

.enhanced-datatable :deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(
    135deg,
    rgb(249 250 251) 0%,
    rgb(243 244 246) 100%
  );
  border: none;
  border-bottom: 2px solid rgb(229 231 235);
  color: rgb(55 65 81);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem;
  transition: all 0.2s;
}

.enhanced-datatable :deep(.p-datatable-thead > tr > th:hover) {
  background: linear-gradient(
    135deg,
    rgb(243 244 246) 0%,
    rgb(229 231 235) 100%
  );
}

.enhanced-datatable :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid rgb(243 244 246);
  transition: all 0.2s;
}

.enhanced-datatable :deep(.p-datatable-tbody > tr:hover) {
  background: linear-gradient(
    135deg,
    rgb(239 246 255) 0%,
    rgb(219 234 254) 100%
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.enhanced-datatable :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgb(250 250 250);
}

.enhanced-datatable :deep(.p-datatable-tbody > tr:nth-child(even):hover) {
  background: linear-gradient(
    135deg,
    rgb(239 246 255) 0%,
    rgb(219 234 254) 100%
  );
}

.enhanced-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border: none;
  color: rgb(55 65 81);
  font-size: 0.875rem;
}

/* Enhanced Pagination */
.enhanced-datatable :deep(.p-paginator) {
  background: linear-gradient(
    135deg,
    rgb(249 250 251) 0%,
    rgb(243 244 246) 100%
  );
  border: none;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.enhanced-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  border-radius: 0.5rem;
  border: none;
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s ease-out;
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.enhanced-datatable
  :deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgb(59 130 246 / 0.3);
}

.enhanced-datatable
  :deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  box-shadow: 0 8px 15px -3px rgb(59 130 246 / 0.4);
  transform: translateY(-1px);
}

.enhanced-datatable :deep(.p-paginator .p-paginator-first),
.enhanced-datatable :deep(.p-paginator .p-paginator-prev),
.enhanced-datatable :deep(.p-paginator .p-paginator-next),
.enhanced-datatable :deep(.p-paginator .p-paginator-last) {
  border-radius: 0.5rem;
  border: none;
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  transition: all 0.2s ease-out;
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.enhanced-datatable :deep(.p-paginator .p-paginator-first:hover),
.enhanced-datatable :deep(.p-paginator .p-paginator-prev:hover),
.enhanced-datatable :deep(.p-paginator .p-paginator-next:hover),
.enhanced-datatable :deep(.p-paginator .p-paginator-last:hover) {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgb(59 130 246 / 0.3);
}

.enhanced-datatable :deep(.p-paginator .p-paginator-first.p-disabled),
.enhanced-datatable :deep(.p-paginator .p-paginator-prev.p-disabled),
.enhanced-datatable :deep(.p-paginator .p-paginator-next.p-disabled),
.enhanced-datatable :deep(.p-paginator .p-paginator-last.p-disabled) {
  background: rgb(243 244 246);
  color: rgb(156 163 175);
  border: none;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.enhanced-datatable :deep(.p-paginator .p-dropdown) {
  border-radius: 0.5rem;
  border: none;
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s ease-out;
  min-width: 4rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.enhanced-datatable :deep(.p-paginator .p-dropdown:hover) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.enhanced-datatable :deep(.p-paginator .p-dropdown:focus) {
  box-shadow: 0 0 0 3px rgb(147 197 253 / 0.2);
  outline: none;
}

.enhanced-datatable :deep(.p-paginator .p-dropdown-panel) {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 10px 10px -5px rgb(0 0 0 / 0.04);
  background: rgb(255 255 255);
  overflow: hidden;
}

.enhanced-datatable :deep(.p-paginator .p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: rgb(55 65 81);
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.enhanced-datatable :deep(.p-paginator .p-dropdown-item:hover) {
  background: linear-gradient(
    135deg,
    rgb(239 246 255) 0%,
    rgb(219 234 254) 100%
  );
  color: rgb(59 130 246);
  transform: translateX(2px);
}

.enhanced-datatable :deep(.p-paginator .p-dropdown-item.p-highlight) {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  font-weight: 600;
}

/* Current page report */
.enhanced-datatable :deep(.p-paginator .p-paginator-current) {
  color: rgb(55 65 81);
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: rgb(255 255 255);
  border: none;
  border-radius: 0.5rem;
  min-width: 8rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Loading state */
.enhanced-datatable :deep(.p-datatable-loading-overlay) {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.enhanced-datatable :deep(.p-datatable-loading-icon) {
  color: rgb(59 130 246);
  font-size: 2rem;
}

/* Empty state */
.enhanced-datatable :deep(.p-datatable-emptymessage) {
  padding: 3rem 1rem;
  color: rgb(107 114 128);
  font-size: 0.875rem;
  text-align: center;
}

/* Selection column */
.selection-column :deep(.p-checkbox) {
  border-radius: 0.375rem;
  border: 2px solid rgb(209 213 219);
  background: rgb(255 255 255);
  transition: all 0.2s;
}

.selection-column :deep(.p-checkbox:hover) {
  border-color: rgb(59 130 246);
  background: rgb(239 246 255);
}

.selection-column :deep(.p-checkbox.p-checked) {
  background: rgb(59 130 246);
  border-color: rgb(59 130 246);
}

/* Actions column */
.actions-column :deep(.p-button) {
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.actions-column :deep(.p-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .table-header {
    padding: 1rem;
  }

  .enhanced-datatable :deep(.p-datatable-thead > tr > th),
  .enhanced-datatable :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }

  .enhanced-datatable :deep(.p-paginator) {
    padding: 0.75rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .enhanced-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .enhanced-datatable :deep(.p-paginator .p-paginator-first),
  .enhanced-datatable :deep(.p-paginator .p-paginator-prev),
  .enhanced-datatable :deep(.p-paginator .p-paginator-next),
  .enhanced-datatable :deep(.p-paginator .p-paginator-last) {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 640px) {
  .enhanced-datatable :deep(.p-paginator) {
    padding: 0.5rem;
  }

  .enhanced-datatable :deep(.p-paginator .p-paginator-pages) {
    display: flex;
    gap: 0.25rem;
  }

  .enhanced-datatable :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
    min-width: 1.75rem;
    height: 1.75rem;
    font-size: 0.7rem;
  }
}

/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.base-table-wrapper {
  animation: fadeIn 0.3s ease-out;
}
</style>
