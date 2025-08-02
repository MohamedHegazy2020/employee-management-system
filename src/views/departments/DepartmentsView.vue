<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Departments</h1>
        <p class="mt-1 text-sm text-gray-600">
          Manage departments, organizational structure, and team assignments.
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
          label="Add Department"
          icon="pi pi-plus"
          variant="primary"
          size="medium"
          padding="normal"
          @click="$router.push('/departments/create')"
        />
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="shadow-sm border border-gray-200/50">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <BaseInput
            v-model="searchQuery"
            label="Search departments"
            icon="pi pi-search"
            @input="handleSearch"
          />

          <!-- Company Filter -->
          <BaseDropdown
            v-model="filters.companyId"
            :options="companyOptions"
            label="Filter by Company"
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
        </div>

        <!-- Clear Filters -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">
              {{ departmentsStore.totalDepartments }} departments found
            </span>
            <span v-if="hasActiveFilters" class="text-sm text-blue-600">
              ({{ departmentsStore.filteredDepartments.length }} filtered)
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
      :data="departmentsStore.paginatedDepartments"
      :columns="tableColumns"
      :loading="departmentsStore.loading"
      :pagination="{
        currentPage: departmentsStore.currentPage,
        totalItems: departmentsStore.filteredDepartments.length,
        itemsPerPage: departmentsStore.itemsPerPage,
        showInfo: true,
        showRowsPerPage: true,
      }"
      title="Department Directory"
      description="Complete list of all departments across all companies"
      class="shadow-sm border border-gray-200/50"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
    >
      <!-- Custom Department Column -->
      <template #body-name="{ data }">
        <div v-if="data" class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <div
              class="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md"
            >
              <i class="pi pi-sitemap text-white text-lg"></i>
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

      <!-- Custom Company Column -->
      <template #body-company="{ data }">
        <div v-if="data" class="flex items-center">
          <div
            class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2"
          >
            <i class="pi pi-building text-blue-600 text-sm"></i>
          </div>
          <span class="text-sm font-medium text-gray-900">{{
            data.company
          }}</span>
        </div>
      </template>

      <!-- Custom Budget Column -->
      <template #body-budget="{ data }">
        <div v-if="data" class="text-sm font-semibold text-gray-900">
          ${{ data.budget.toLocaleString() }}
        </div>
      </template>

      <!-- Custom Employees Column -->
      <template #body-employeeCount="{ data }">
        <div v-if="data" class="flex items-center justify-center">
          <span
            class="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full"
          >
            {{ data.employeeCount }}
          </span>
        </div>
      </template>

      <!-- Custom Status Column -->
      <template #body-status="{ data }">
        <Tag
          v-if="data"
          :value="data.status"
          :severity="getStatusSeverity(data.status)"
          class="capitalize"
        />
      </template>

      <!-- Custom Row Actions Column -->
      <template #row-actions="{ data }">
        <div v-if="data" class="flex items-center justify-center space-x-2">
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
      :data="departmentsStore.filteredDepartments"
      :loading="departmentsStore.loading"
      :current-page="departmentsStore.currentPage"
      :items-per-page="departmentsStore.itemsPerPage"
      title="Department Directory"
      description="Complete list of all departments across all companies"
      empty-message="No departments found matching your criteria"
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
                class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
              >
                <i class="pi pi-sitemap text-white text-lg"></i>
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
              <i class="pi pi-building text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.company }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-map-marker text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.location }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-user text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.manager || "No Manager" }}</span>
            </div>
            <div class="flex items-center">
              <Tag
                :value="item.status"
                :severity="getStatusSeverity(item.status)"
                class="capitalize"
              />
            </div>
          </div>

          <!-- Item Stats -->
          <div class="space-y-3 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Budget</span>
              <span class="text-sm font-semibold text-gray-900"
                >${{ item.budget.toLocaleString() }}</span
              >
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500">Employees</span>
              <span class="text-sm font-semibold text-gray-900">{{
                item.employeeCount
              }}</span>
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

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card class="stat-card">
        <template #content>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="pi pi-sitemap text-blue-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ departmentsStore.totalDepartments }}
            </h3>
            <p class="text-gray-600 text-sm">Total Departments</p>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="pi pi-check-circle text-green-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ activeDepartmentsCount }}
            </h3>
            <p class="text-gray-600 text-sm">Active Departments</p>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="pi pi-dollar text-purple-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              ${{ formatCurrency(departmentsStore.totalBudget) }}
            </h3>
            <p class="text-gray-600 text-sm">Total Budget</p>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="pi pi-users text-orange-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ totalEmployeesInDepartments }}
            </h3>
            <p class="text-gray-600 text-sm">Total Employees</p>
          </div>
        </template>
      </Card>
    </div>

    <!-- Department Distribution Chart -->
    <Card>
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-chart-pie text-blue-600 mr-2"></i>
          <span>Department Distribution by Company</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="company in companyDepartments"
            :key="company.id"
            class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-gray-900">{{ company.name }}</h4>
              <span class="text-sm text-gray-500"
                >{{ company.departments.length }} depts</span
              >
            </div>
            <div class="space-y-2">
              <div
                v-for="dept in company.departments.slice(0, 3)"
                :key="dept.id"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600">{{ dept.name }}</span>
                <span class="font-medium"
                  >{{ dept.employeeCount }} employees</span
                >
              </div>
              <div
                v-if="company.departments.length > 3"
                class="text-xs text-gray-500"
              >
                +{{ company.departments.length - 3 }} more departments
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDepartmentsStore } from "@/stores/departments";
import { useCompaniesStore } from "@/stores/companies";
import { useEmployeesStore } from "@/stores/employees";
import {
  BaseTable,
  BaseGridView,
  BaseButton,
  BaseInput,
  BaseDropdown,
} from "@/components/ui";
import Card from "primevue/card";
import Tag from "primevue/tag";

const router = useRouter();
const departmentsStore = useDepartmentsStore();
const companiesStore = useCompaniesStore();
const employeesStore = useEmployeesStore();

// View state
const viewMode = ref<"table" | "grid">("table");

// Messages
const successMessage = ref("");
const errorMessage = ref("");

// Search and filters
const searchQuery = ref("");
const filters = ref({
  companyId: null,
  status: null,
});

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.companyId || filters.value.status || searchQuery.value;
});

const companyOptions = computed(() => {
  return companiesStore.companies.map((company) => ({
    label: company.name,
    value: company.id,
  }));
});

const statusOptions = computed(() => [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Under Review", value: "under review" },
]);

const tableColumns = [
  {
    field: "name",
    header: "Department",
    sortable: true,
    type: "custom",
  },
  {
    field: "company",
    header: "Company",
    sortable: true,
    type: "custom",
  },
  {
    field: "budget",
    header: "Budget",
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
    field: "status",
    header: "Status",
    sortable: true,
    type: "custom",
  },
  {
    field: "row-actions",
    header: "Actions",
    sortable: false,
    type: "custom",
  },
];

// Methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === "table" ? "grid" : "table";
};

const handleSearch = () => {
  departmentsStore.setSearchQuery(searchQuery.value);
};

const handleFilterChange = () => {
  departmentsStore.setFilters(filters.value);
};

const clearFilters = () => {
  filters.value = {
    companyId: "",
    status: "",
  };
  departmentsStore.clearFilters();
};

const handlePageChange = (page: number) => {
  departmentsStore.setPage(page);
};

const handleRowsPerPageChange = (rowsPerPage: number) => {
  departmentsStore.itemsPerPage = rowsPerPage;
  departmentsStore.setPage(1);
};

const handleView = (department: any) => {
  router.push(`/departments/${department.id}`);
};

const handleEdit = (department: any) => {
  router.push(`/departments/${department.id}/edit`);
};

const handleDelete = (department: any) => {
  // Implement delete confirmation
  console.log("Delete department:", department.id);
};

const exportData = () => {
  // Implement data export
  console.log("Export departments data");
};

const getCompanyName = (companyId: string) => {
  const company = companiesStore.companies.find((c) => c.id === companyId);
  return company?.name || "Unknown Company";
};

const getManagerName = (managerId: string | null) => {
  if (!managerId) return null;
  const manager = employeesStore.employees.find((e) => e.id === managerId);
  return manager ? `${manager.firstName} ${manager.lastName}` : null;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusSeverity = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "info";
  }
};

const activeDepartmentsCount = computed(() => {
  return departmentsStore.departments.filter((dept) => dept.status === "active")
    .length;
});

const totalEmployeesInDepartments = computed(() => {
  return departmentsStore.departments.reduce(
    (sum, dept) => sum + dept.employeeCount,
    0
  );
});

const companyDepartments = computed(() => {
  const grouped: any[] = [];
  companiesStore.companies.forEach((company) => {
    const companyDepts = departmentsStore.departments.filter(
      (dept) => dept.companyId === company.id
    );
    if (companyDepts.length > 0) {
      grouped.push({
        id: company.id,
        name: company.name,
        departments: companyDepts,
      });
    }
  });
  return grouped;
});

// Lifecycle
onMounted(async () => {
  await Promise.all([
    departmentsStore.fetchDepartments(),
    companiesStore.fetchCompanies(),
    employeesStore.fetchEmployees(),
  ]);
});
</script>

<style scoped>
.stat-card {
  background: rgb(255 255 255);
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgb(0 0 0 / 0.1);
}

:deep(.p-card) {
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s;
}

:deep(.p-card:hover) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.p-card-content) {
  padding: 1.5rem;
}
</style>
