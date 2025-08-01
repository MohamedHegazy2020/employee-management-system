<template>
  <div class="base-grid-view">
    <!-- Grid Header -->
    <div v-if="title || description" class="grid-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 v-if="title" class="text-2xl font-bold text-gray-900 mb-2">
            {{ title }}
          </h2>
          <p v-if="description" class="text-gray-600">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions" class="flex items-center space-x-3">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data || data.length === 0" class="grid-empty">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-inbox text-gray-400 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No data found
          </h3>
          <p class="text-gray-600">{{ emptyMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Grid Content -->
    <div v-else class="grid-content">
      <!-- Grid Items -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="(item, index) in paginatedData"
          :key="item.id || index"
          class="grid-item"
        >
          <Card
            class="h-full shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-300"
          >
            <template #content>
              <slot name="item" :item="item" :index="index">
                <!-- Default Grid Item Template -->
                <div class="space-y-4">
                  <!-- Item Header -->
                  <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center"
                      >
                        <i class="pi pi-building text-white text-lg"></i>
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900 truncate">
                          {{ item.name || item.title || "Untitled" }}
                        </h3>
                        <p class="text-sm text-gray-500">
                          {{ item.code || item.id || "No ID" }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <slot name="item-actions" :item="item" :index="index">
                        <BaseButton
                          icon="pi pi-eye"
                          variant="info"
                          size="xs"
                          padding="compact"
                          rounded
                          @click="handleView(item)"
                        />
                        <BaseButton
                          icon="pi pi-pencil"
                          variant="success"
                          size="xs"
                          padding="compact"
                          rounded
                          @click="handleEdit(item)"
                        />
                        <BaseButton
                          icon="pi pi-trash"
                          variant="danger"
                          size="xs"
                          padding="compact"
                          rounded
                          @click="handleDelete(item)"
                        />
                      </slot>
                    </div>
                  </div>

                  <!-- Item Details -->
                  <div class="space-y-2">
                    <div
                      v-if="item.email"
                      class="flex items-center text-sm text-gray-600"
                    >
                      <i class="pi pi-envelope text-gray-400 mr-2"></i>
                      <span class="truncate">{{ item.email }}</span>
                    </div>
                    <div
                      v-if="item.phone"
                      class="flex items-center text-sm text-gray-600"
                    >
                      <i class="pi pi-phone text-gray-400 mr-2"></i>
                      <span>{{ item.phone }}</span>
                    </div>
                    <div v-if="item.status" class="flex items-center">
                      <Tag
                        :value="item.status"
                        :severity="getStatusSeverity(item.status)"
                        class="capitalize"
                      />
                    </div>
                  </div>

                  <!-- Item Stats -->
                  <div
                    v-if="item.employeeCount || item.departmentCount"
                    class="flex items-center justify-between pt-2 border-t border-gray-100"
                  >
                    <div v-if="item.employeeCount" class="text-center">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ item.employeeCount }}
                      </p>
                      <p class="text-xs text-gray-500">Employees</p>
                    </div>
                    <div v-if="item.departmentCount" class="text-center">
                      <p class="text-sm font-semibold text-gray-900">
                        {{ item.departmentCount }}
                      </p>
                      <p class="text-xs text-gray-500">Departments</p>
                    </div>
                  </div>
                </div>
              </slot>
            </template>
          </Card>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="showPaginator && totalPages > 1" class="mt-8">
        <BasePagination
          :current-page="currentPage"
          :total-items="data.length"
          :items-per-page="itemsPerPage"
          :show-info="showPaginationInfo"
          :show-rows-per-page="showRowsPerPage"
          :rows-per-page-options="rowsPerPageOptions"
          :item-label="itemLabel"
          @page-change="handlePageChange"
          @rows-per-page-change="handleRowsPerPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { BaseButton, BasePagination } from "@/components/ui";

interface Props {
  data: any[];
  title?: string;
  description?: string;
  loading?: boolean;
  emptyMessage?: string;
  showPaginator?: boolean;
  showPaginationInfo?: boolean;
  showRowsPerPage?: boolean;
  rowsPerPageOptions?: number[];
  itemLabel?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  emptyMessage: "No items to display",
  showPaginator: true,
  showPaginationInfo: true,
  showRowsPerPage: true,
  rowsPerPageOptions: () => [12, 24, 48, 96],
  itemLabel: "items",
  currentPage: 1,
  itemsPerPage: 12,
});

const emit = defineEmits<{
  "page-change": [page: number];
  "rows-per-page-change": [rowsPerPage: number];
  view: [item: any];
  edit: [item: any];
  delete: [item: any];
}>();

const totalPages = computed(() =>
  Math.ceil(props.data.length / props.itemsPerPage)
);

const paginatedData = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.data.slice(start, end);
});

const getStatusSeverity = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "success",
    inactive: "danger",
    pending: "warning",
    draft: "info",
  };
  return statusMap[status.toLowerCase()] || "info";
};

const handlePageChange = (page: number) => {
  emit("page-change", page);
};

const handleRowsPerPageChange = (rowsPerPage: number) => {
  emit("rows-per-page-change", rowsPerPage);
};

const handleView = (item: any) => {
  emit("view", item);
};

const handleEdit = (item: any) => {
  emit("edit", item);
};

const handleDelete = (item: any) => {
  emit("delete", item);
};
</script>

<style scoped>
.base-grid-view {
  width: 100%;
}

.grid-header {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgb(229 231 235 / 0.5);
}

.grid-loading,
.grid-empty {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235 / 0.5);
}

.grid-content {
  min-height: 200px;
}

.grid-item {
  transition: transform 0.2s ease-out;
}

.grid-item:hover {
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-header {
    padding: 1rem;
  }

  .grid-item {
    margin-bottom: 1rem;
  }
}
</style>
