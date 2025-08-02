<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
        <p class="text-gray-600">
          Manage and view all companies in your organization
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <BaseButton
          label="Export Data"
          icon="pi pi-download"
          variant="warning"
          size="medium"
          padding="normal"
          @click="exportData"
        />
        <BaseButton
          label="Add Company"
          icon="pi pi-plus"
          variant="primary"
          size="medium"
          padding="normal"
          @click="$router.push('/companies/create')"
        />
      </div>
    </div>

    <!-- Success/Error Messages -->
    <Message
      v-if="successMessage"
      severity="success"
      :closable="true"
      @close="successMessage = ''"
    >
      {{ successMessage }}
    </Message>

    <Message
      v-if="errorMessage"
      severity="error"
      :closable="true"
      @close="errorMessage = ''"
    >
      {{ errorMessage }}
    </Message>

    <!-- Filters and Search -->
    <Card class="shadow-sm border border-gray-200/50">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <BaseInput
            v-model="searchQuery"
            label="Search companies"
            icon="pi pi-search"
            @input="handleSearch"
          />

          <!-- Industry Filter -->
          <BaseDropdown
            v-model="filters.industry"
            :options="industryOptions"
            label="Filter by Industry"
            :show-clear="true"
            @change="handleFilterChange"
          />

          <!-- Status Filter -->
          <BaseDropdown
            v-model="filters.status"
            :options="statusOptions"
            label="Filter by Status"
            :show-clear="true"
            @change="handleFilterChange"
          />

          <!-- Size Filter -->
          <BaseDropdown
            v-model="filters.size"
            :options="sizeOptions"
            label="Filter by Size"
            :show-clear="true"
            @change="handleFilterChange"
          />
        </div>

        <!-- Clear Filters -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">
              {{ companiesStore.totalCompanies }} companies found
            </span>
            <span v-if="hasActiveFilters" class="text-sm text-blue-600">
              ({{ companiesStore.filteredCompanies.length }} filtered)
            </span>
          </div>

          <BaseButton
            v-if="hasActiveFilters"
            label="Clear Filters"
            icon="pi pi-times"
            variant="secondary"
            size="small"
            padding="compact"
            @click="clearFilters"
          />
        </div>
      </template>
    </Card>

    <!-- View Toggle -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <BaseButton
          :label="viewMode === 'table' ? 'Table View' : 'Grid View'"
          :icon="viewMode === 'table' ? 'pi pi-th-large' : 'pi pi-list'"
          variant="secondary"
          size="small"
          padding="compact"
          @click="toggleViewMode"
        />
      </div>
      <div class="text-sm text-gray-500">
        Showing {{ viewMode === "table" ? "table" : "grid" }} view
      </div>
    </div>

    <!-- Table View -->
    <BaseTable
      v-if="viewMode === 'table'"
      :data="companiesStore.paginatedCompanies"
      :columns="tableColumns"
      :loading="companiesStore.loading"
      :pagination="{
        currentPage: companiesStore.currentPage,
        totalItems: companiesStore.filteredCompanies.length,
        itemsPerPage: companiesStore.itemsPerPage,
        showInfo: true,
        showRowsPerPage: true,
      }"
      title="Company Directory"
      description="Complete list of all companies in the system"
      class="shadow-sm border border-gray-200/50"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
    >
      <!-- Custom Actions Slot -->
      <template #actions>
        <div class="flex items-center gap-4">
          <BaseButton
            :label="showTreeView ? 'List View' : 'Tree View'"
            :icon="showTreeView ? 'pi pi-list' : 'pi pi-sitemap'"
            variant="secondary"
            size="large"
            padding="comfortable"
            @click="toggleView"
          />
          <BaseButton
            label="Export"
            icon="pi pi-download"
            variant="warning"
            size="large"
            padding="comfortable"
            @click="exportData"
          />
          <BaseButton
            label="Add Company"
            icon="pi pi-plus"
            variant="primary"
            size="large"
            padding="comfortable"
            @click="$router.push('/companies/create')"
          />
        </div>
      </template>

      <!-- Custom Company Column -->
      <template #body-name="{ data }">
        <div v-if="data" class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <div
              class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md"
            >
              <i class="pi pi-building text-white text-lg"></i>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-bold text-gray-900">
              {{ data.name }}
            </div>
            <div class="text-sm text-gray-500 font-medium">{{ data.code }}</div>
          </div>
        </div>
      </template>

      <!-- Custom Contact Column -->
      <template #body-email="{ data }">
        <div v-if="data">
          <div class="text-sm font-medium text-gray-900">{{ data.email }}</div>
          <div class="text-sm text-gray-500">{{ data.phone }}</div>
        </div>
      </template>

      <!-- Custom Employees Column -->
      <template #body-employeeCount="{ data }">
        <div v-if="data" class="flex items-center justify-center">
          <span
            class="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full"
          >
            {{ data.employeeCount }}
          </span>
        </div>
      </template>

      <!-- Custom Departments Column -->
      <template #body-departmentCount="{ data }">
        <div v-if="data" class="flex items-center justify-center">
          <span
            class="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full"
          >
            {{ data.departmentCount }}
          </span>
        </div>
      </template>

      <!-- Custom Created Date Column -->
      <template #body-createdAt="{ data }">
        <span v-if="data" class="text-sm text-gray-600 font-medium">
          {{ formatDate(data.createdAt) }}
        </span>
      </template>

      <!-- Custom Row Actions Column -->
      <template #row-actions="{ data }">
        <div v-if="data" class="flex items-center justify-center space-x-3">
          <BaseButton
            icon="pi pi-eye"
            variant="info"
            size="small"
            padding="compact"
            @click="handleView(data)"
          />
          <BaseButton
            icon="pi pi-pencil"
            variant="success"
            size="small"
            padding="compact"
            @click="handleEdit(data)"
          />
          <BaseButton
            icon="pi pi-trash"
            variant="danger"
            size="small"
            padding="compact"
            @click="handleDelete(data)"
          />
        </div>
      </template>
    </BaseTable>

    <!-- Grid View -->
    <BaseGridView
      v-else
      :data="companiesStore.filteredCompanies"
      :loading="companiesStore.loading"
      :current-page="companiesStore.currentPage"
      :items-per-page="companiesStore.itemsPerPage"
      title="Company Directory"
      description="Complete list of all companies in the system"
      empty-message="No companies found matching your criteria"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <!-- Custom Grid Item Template -->
      <template #item="{ item }">
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
                  {{ item.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.code }}</p>
              </div>
            </div>
          </div>

          <!-- Item Details -->
          <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-envelope text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.email }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-phone text-gray-400 mr-2"></i>
              <span>{{ item.phone }}</span>
            </div>
            <div class="flex items-center">
              <Tag
                :value="item.status || 'Active'"
                :severity="getStatusSeverity(item.status)"
                class="capitalize"
              />
            </div>
          </div>

          <!-- Item Stats -->
          <div
            class="flex items-center justify-between pt-2 border-t border-gray-100"
          >
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">
                {{ item.employeeCount }}
              </p>
              <p class="text-xs text-gray-500">Employees</p>
            </div>
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">
                {{ item.departmentCount }}
              </p>
              <p class="text-xs text-gray-500">Departments</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom Item Actions -->
      <template #item-actions="{ item }">
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
      </template>
    </BaseGridView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompaniesStore } from "@/stores/companies";
import { useConfirm } from "primevue/useconfirm";
import Card from "primevue/card";
import Message from "primevue/message";
import Tag from "primevue/tag";
import {
  BaseTable,
  BaseGridView,
  BaseButton,
  BaseInput,
  BaseDropdown,
} from "@/components/ui";

const router = useRouter();
const companiesStore = useCompaniesStore();
const confirm = useConfirm();

// View state
const viewMode = ref<"table" | "grid">("table");
const showTreeView = ref(false);

// Messages
const successMessage = ref("");
const errorMessage = ref("");

// Search and filters
const searchQuery = ref("");
const filters = ref({
  industry: null,
  status: null,
  size: null,
});

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.value.industry ||
    filters.value.status ||
    filters.value.size ||
    searchQuery.value
  );
});

const industryOptions = computed(() => [
  { label: "Technology", value: "Technology" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Finance", value: "Finance" },
  { label: "Education", value: "Education" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail", value: "Retail" },
  { label: "Consulting", value: "Consulting" },
  { label: "Other", value: "Other" },
]);

const statusOptions = computed(() => [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
]);

const sizeOptions = computed(() => [
  { label: "Small (1-50)", value: "Small" },
  { label: "Medium (51-200)", value: "Medium" },
  { label: "Large (201-1000)", value: "Large" },
  { label: "Enterprise (1000+)", value: "Enterprise" },
]);

const tableColumns = [
  {
    field: "name",
    header: "Company",
    sortable: true,
    type: "custom",
  },
  {
    field: "email",
    header: "Contact",
    sortable: true,
    type: "custom",
  },
  {
    field: "employeeCount",
    header: "Employees",
    sortable: true,
    type: "custom",
  },
  {
    field: "departmentCount",
    header: "Departments",
    sortable: true,
    type: "custom",
  },
  {
    field: "createdAt",
    header: "Created",
    sortable: true,
    type: "custom",
  },
];

// Methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === "table" ? "grid" : "table";
};

const toggleView = () => {
  showTreeView.value = !showTreeView.value;
};

const handleSearch = () => {
  companiesStore.setSearchQuery(searchQuery.value);
};

const handleFilterChange = () => {
  // Apply filters logic here
  console.log("Filters changed:", filters.value);
};

const clearFilters = () => {
  searchQuery.value = "";
  filters.value = {
    industry: null,
    status: null,
    size: null,
  };
  companiesStore.setSearchQuery("");
};

const handlePageChange = (page: number) => {
  companiesStore.setPage(page);
};

const handleRowsPerPageChange = (rowsPerPage: number) => {
  companiesStore.setItemsPerPage(rowsPerPage);
};

const handleView = (company: any) => {
  router.push(`/companies/${company.id}`);
};

const handleEdit = (company: any) => {
  router.push(`/companies/${company.id}/edit`);
};

const handleDelete = (company: any) => {
  confirm.require({
    message: `Are you sure you want to delete ${company.name}?`,
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: () => {
      // Delete logic here
      successMessage.value = `${company.name} has been deleted successfully.`;
    },
  });
};

const exportData = () => {
  // Export logic here
  successMessage.value = "Data exported successfully!";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const getStatusSeverity = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };
  return statusMap[status?.toLowerCase()] || "info";
};

// Lifecycle
onMounted(async () => {
  await companiesStore.fetchCompanies();
});
</script>

<style scoped>
/* Additional styling can be added here */
</style>
