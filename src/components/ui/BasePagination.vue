<template>
  <div class="base-pagination">
    <!-- Pagination Info -->
    <div v-if="showInfo" class="pagination-info">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <!-- Page Info -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="font-medium">Showing</span>
          <span class="font-bold text-gray-900">{{
            paginationInfo.first
          }}</span>
          <span>to</span>
          <span class="font-bold text-gray-900">{{ paginationInfo.last }}</span>
          <span>of</span>
          <span class="font-bold text-gray-900">{{
            paginationInfo.total
          }}</span>
          <span>{{ itemLabel }}</span>
        </div>

        <!-- Rows Per Page -->
        <div v-if="showRowsPerPage" class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Show:</span>
          <BaseDropdown
            v-model="localRowsPerPage"
            :options="rowsPerPageOptions"
            option-label="label"
            option-value="value"
            class="w-20"
            @change="handleRowsPerPageChange"
          />
          <span class="text-sm text-gray-600">per page</span>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <div class="flex items-center justify-between">
        <!-- Left Side - Page Navigation -->
        <div class="flex items-center gap-2">
          <!-- First Page -->
          <BaseButton
            icon="pi pi-angle-double-left"
            variant="secondary"
            size="small"
            padding="compact"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
            class="pagination-btn"
          />

          <!-- Previous Page -->
          <BaseButton
            icon="pi pi-angle-left"
            variant="secondary"
            size="small"
            padding="compact"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
            class="pagination-btn"
          />

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <template v-for="page in visiblePages" :key="page">
              <!-- Ellipsis -->
              <span v-if="page === '...'" class="px-2 text-gray-400">...</span>

              <!-- Page Number -->
              <BaseButton
                v-else
                :label="String(page)"
                :variant="currentPage === page ? 'primary' : 'secondary'"
                size="small"
                padding="compact"
                :class="[
                  'pagination-btn',
                  currentPage === page ? 'active' : '',
                ]"
                @click="goToPage(page)"
              />
            </template>
          </div>

          <!-- Next Page -->
          <BaseButton
            icon="pi pi-angle-right"
            variant="secondary"
            size="small"
            padding="compact"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
            class="pagination-btn"
          />

          <!-- Last Page -->
          <BaseButton
            icon="pi pi-angle-double-right"
            variant="secondary"
            size="small"
            padding="compact"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
            class="pagination-btn"
          />
        </div>

        <!-- Right Side - Jump to Page -->
        <div v-if="showJumpToPage" class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Go to:</span>
          <BaseInput
            v-model="jumpToPage"
            type="number"
            class="w-16"
            :min="1"
            :max="totalPages"
            @keyup.enter="handleJumpToPage"
          />
          <BaseButton
            label="Go"
            variant="primary"
            size="small"
            padding="compact"
            @click="handleJumpToPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { BaseButton, BaseInput, BaseDropdown } from "@/components/ui";

interface PaginationInfo {
  first: number;
  last: number;
  total: number;
}

interface Props {
  // Pagination data
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;

  // Configuration
  showInfo?: boolean;
  showRowsPerPage?: boolean;
  showJumpToPage?: boolean;
  rowsPerPageOptions?: number[];
  itemLabel?: string;

  // Styling
  maxVisiblePages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showInfo: true,
  showRowsPerPage: true,
  showJumpToPage: true,
  rowsPerPageOptions: () => [10, 20, 50, 100],
  itemLabel: "items",
  maxVisiblePages: 7,
});

const emit = defineEmits<{
  "update:currentPage": [page: number];
  "update:itemsPerPage": [items: number];
  "page-change": [page: number];
  "rows-per-page-change": [items: number];
}>();

// Reactive data
const localRowsPerPage = ref(props.itemsPerPage);
const jumpToPage = ref("");

// Computed properties
const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);

const paginationInfo = computed((): PaginationInfo => {
  const total = props.totalItems;
  const first =
    total === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
  const last = Math.min(props.currentPage * props.itemsPerPage, total);

  return { first, last, total };
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const maxVisible = props.maxVisiblePages;
  const current = props.currentPage;
  const total = totalPages.value;

  if (total <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    if (current < total - 2) {
      pages.push("...");
    }

    // Always show last page
    if (total > 1) {
      pages.push(total);
    }
  }

  return pages;
});

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit("update:currentPage", page);
    emit("page-change", page);
  }
};

const handleRowsPerPageChange = () => {
  emit("update:itemsPerPage", localRowsPerPage.value);
  emit("rows-per-page-change", localRowsPerPage.value);
  // Reset to first page when changing rows per page
  goToPage(1);
};

const handleJumpToPage = () => {
  const page = parseInt(jumpToPage.value);
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page);
    jumpToPage.value = "";
  }
};

// Watchers
watch(
  () => props.itemsPerPage,
  (newValue) => {
    localRowsPerPage.value = newValue;
  }
);

watch(
  () => props.currentPage,
  () => {
    jumpToPage.value = "";
  }
);
</script>

<style scoped>
.base-pagination {
  background: linear-gradient(
    135deg,
    rgb(249 250 251) 0%,
    rgb(243 244 246) 100%
  );
  
 
  overflow: hidden;
}

.pagination-info {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgb(229 231 235);
  background: rgb(255 255 255);
}

.pagination-controls {
  padding: 1rem 1.5rem;
  background: rgb(255 255 255);
}

.pagination-btn {
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s;
  min-width: 2.5rem;
  height: 2.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: rgb(59 130 246);
  color: rgb(255 255 255);
  border-color: rgb(59 130 246);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.pagination-btn.active {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  border-color: rgb(59 130 246);
  box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.3);
}

.pagination-btn:disabled {
  background: rgb(243 244 246);
  color: rgb(156 163 175);
  border-color: rgb(229 231 235);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Enhanced button styling */
.pagination-btn :deep(.p-button) {
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s;
  min-width: 2.5rem;
  height: 2.5rem;
}

.pagination-btn :deep(.p-button:hover):not(:disabled) {
  background: rgb(59 130 246);
  color: rgb(255 255 255);
  border-color: rgb(59 130 246);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.pagination-btn.active :deep(.p-button) {
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
  color: rgb(255 255 255);
  border-color: rgb(59 130 246);
  box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.3);
}

.pagination-btn:disabled :deep(.p-button) {
  background: rgb(243 244 246);
  color: rgb(156 163 175);
  border-color: rgb(229 231 235);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Input styling for jump to page */
.base-pagination :deep(.p-inputtext) {
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s;
  text-align: center;
}

.base-pagination :deep(.p-inputtext:focus) {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(147 197 253);
}

/* Dropdown styling for rows per page */
.base-pagination :deep(.p-dropdown) {
  border-radius: 0.5rem;
  border: 1px solid rgb(229 231 235);
  background: rgb(255 255 255);
  color: rgb(55 65 81);
  font-weight: 500;
  transition: all 0.2s;
}

.base-pagination :deep(.p-dropdown:hover) {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(147 197 253);
}

.base-pagination :deep(.p-dropdown-panel) {
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  background: rgb(255 255 255);
}

.base-pagination :deep(.p-dropdown-item) {
  padding: 0.5rem 1rem;
  color: rgb(55 65 81);
  transition: all 0.2s;
}

.base-pagination :deep(.p-dropdown-item:hover) {
  background: rgb(239 246 255);
  color: rgb(59 130 246);
}

.base-pagination :deep(.p-dropdown-item.p-highlight) {
  background: rgb(59 130 246);
  color: rgb(255 255 255);
}

/* Responsive design */
@media (max-width: 640px) {
  .pagination-info {
    padding: 0.75rem 1rem;
  }

  .pagination-controls {
    padding: 0.75rem 1rem;
  }

  .pagination-btn {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .pagination-btn :deep(.p-button) {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
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

.base-pagination {
  animation: fadeIn 0.3s ease-out;
}
</style>
