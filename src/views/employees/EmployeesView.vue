<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
        <p class="mt-1 text-sm text-gray-600">
          Manage employee information, records, and performance data.
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
          label="Add Employee"
          icon="pi pi-plus"
          variant="primary"
          size="medium"
          padding="normal"
          @click="$router.push('/employees/create')"
        />
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="shadow-sm border border-gray-200/50">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <BaseInput
            v-model="searchQuery"
            placeholder="Search employees..."
            icon="pi pi-search"
            @input="handleSearch"
          />

          <!-- Company Filter -->
          <BaseDropdown
            v-model="filters.companyId"
            :options="companyOptions"
            option-label="name"
            option-value="id"
            placeholder="Filter by Company"
            :show-clear="true"
            @change="handleFilterChange"
          />

          <!-- Department Filter -->
          <BaseDropdown
            v-model="filters.department"
            :options="departmentOptions"
            option-label="label"
            option-value="value"
            placeholder="Filter by Department"
            :show-clear="true"
            @change="handleFilterChange"
          />

          <!-- Status Filter -->
          <BaseDropdown
            v-model="filters.status"
            :options="statusOptions"
            placeholder="Filter by Status"
            :show-clear="true"
            @change="handleFilterChange"
          />
        </div>

        <!-- Clear Filters -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">
              {{ employeesStore.totalEmployees }} employees found
            </span>
            <span v-if="hasActiveFilters" class="text-sm text-blue-600">
              ({{ employeesStore.filteredEmployees.length }} filtered)
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
      :data="employeesStore.paginatedEmployees"
      :columns="tableColumns"
      :loading="employeesStore.loading"
      :pagination="{
        currentPage: employeesStore.currentPage,
        totalItems: employeesStore.filteredEmployees.length,
        itemsPerPage: employeesStore.itemsPerPage,
        showInfo: true,
        showRowsPerPage: true,
      }"
      title="Employee Directory"
      description="Complete list of all employees across all companies"
      class="shadow-sm border border-gray-200/50"
      @page-change="handlePageChange"
      @rows-per-page-change="handleRowsPerPageChange"
    >
      <!-- Custom Employee Column -->
      <template #body-name="{ data }">
        <div v-if="data" class="flex items-center">
          <Avatar
            :image="data.avatar"
            :label="getInitials(data.firstName, data.lastName)"
            size="normal"
            shape="circle"
            class="mr-3"
          />
          <div>
            <div class="text-sm font-bold text-gray-900">
              {{ data.firstName }} {{ data.lastName }}
            </div>
            <div class="text-sm text-gray-500">{{ data.position }}</div>
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

      <!-- Custom Department Column -->
      <template #body-department="{ data }">
        <div v-if="data" class="flex items-center">
          <div
            class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2"
          >
            <i class="pi pi-sitemap text-green-600 text-sm"></i>
          </div>
          <span class="text-sm font-medium text-gray-900">{{
            data.department
          }}</span>
        </div>
      </template>

      <!-- Custom Salary Column -->
      <template #body-salary="{ data }">
        <span v-if="data" class="text-sm font-semibold text-gray-900">
          ${{ data.salary.toLocaleString() }}
        </span>
      </template>

      <!-- Custom Performance Column -->
      <template #body-performance="{ data }">
        <div v-if="data" class="flex items-center">
          <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              class="h-2 rounded-full"
              :class="getPerformanceColor(data.performanceRating * 20)"
              :style="{ width: `${data.performanceRating * 20}%` }"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-900"
            >{{ data.performanceRating }}/5</span
          >
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
      :data="employeesStore.filteredEmployees"
      :loading="employeesStore.loading"
      :current-page="employeesStore.currentPage"
      :items-per-page="employeesStore.itemsPerPage"
      title="Employee Directory"
      description="Complete list of all employees across all companies"
      empty-message="No employees found matching your criteria"
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
              <Avatar
                :image="item.avatar"
                :label="getInitials(item.firstName, item.lastName)"
                size="large"
                shape="circle"
                class="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-lg font-bold"
              />
              <div>
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ item.firstName }} {{ item.lastName }}
                </h3>
                <p class="text-sm text-gray-500">{{ item.position }}</p>
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
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-building text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.company }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <i class="pi pi-sitemap text-gray-400 mr-2"></i>
              <span class="truncate">{{ item.department }}</span>
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
              <span class="text-sm text-gray-500">Salary</span>
              <span class="text-sm font-semibold text-gray-900"
                >${{ item.salary.toLocaleString() }}</span
              >
            </div>
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Performance</span>
                <span class="text-sm font-semibold text-gray-900"
                  >{{ item.performanceRating }}/5</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full"
                  :class="getPerformanceColor(item.performanceRating * 20)"
                  :style="{ width: `${item.performanceRating * 20}%` }"
                ></div>
              </div>
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
              <i class="pi pi-users text-blue-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ employeesStore.totalEmployees }}
            </h3>
            <p class="text-gray-600 text-sm">Total Employees</p>
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
              {{ activeEmployeesCount }}
            </h3>
            <p class="text-gray-600 text-sm">Active Employees</p>
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
              ${{ formatCurrency(averageSalary) }}
            </h3>
            <p class="text-gray-600 text-sm">Average Salary</p>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="pi pi-star text-orange-600 text-xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ averagePerformance.toFixed(1) }}
            </h3>
            <p class="text-gray-600 text-sm">Avg Performance</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEmployeesStore } from "@/stores/employees";
import { useCompaniesStore } from "@/stores/companies";
import { useDepartmentsStore } from "@/stores/departments";
import {
  BaseTable,
  BaseGridView,
  BaseButton,
  BaseInput,
  BaseDropdown,
} from "@/components/ui";
import Card from "primevue/card";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";

const router = useRouter();
const employeesStore = useEmployeesStore();
const companiesStore = useCompaniesStore();
const departmentsStore = useDepartmentsStore();

// View state
const viewMode = ref<"table" | "grid">("table");

// Messages
const successMessage = ref("");
const errorMessage = ref("");

// Search and filters
const searchQuery = ref("");
const filters = ref({
  companyId: null,
  department: null,
  status: null,
});

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.value.companyId ||
    filters.value.department ||
    filters.value.status ||
    searchQuery.value
  );
});

const companyOptions = computed(() => {
  return companiesStore.companies.map((company) => ({
    label: company.name,
    value: company.id,
  }));
});

const departmentOptions = computed(() => {
  return departmentsStore.departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));
});

const statusOptions = computed(() => [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "On Leave", value: "on leave" },
  { label: "Terminated", value: "terminated" },
]);

// Statistics computed properties
const activeEmployeesCount = computed(() => {
  return employeesStore.employees.filter((emp) => emp.status === "active").length;
});

const averageSalary = computed(() => {
  if (employeesStore.employees.length === 0) return 0;
  const total = employeesStore.employees.reduce((sum, emp) => sum + emp.salary, 0);
  return Math.round(total / employeesStore.employees.length);
});

const averagePerformance = computed(() => {
  if (employeesStore.employees.length === 0) return 0;
  const total = employeesStore.employees.reduce((sum, emp) => sum + emp.performanceRating, 0);
  return total / employeesStore.employees.length;
});

const tableColumns = [
  {
    field: "name",
    header: "Employee",
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
    field: "department",
    header: "Department",
    sortable: true,
    type: "custom",
  },
  {
    field: "salary",
    header: "Salary",
    sortable: true,
    type: "custom",
  },
  {
    field: "performance",
    header: "Performance",
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
  employeesStore.setSearchQuery(searchQuery.value);
};

const handleFilterChange = () => {
  employeesStore.setFilters(filters.value);
};

const clearFilters = () => {
  filters.value = {
    companyId: "",
    department: "",
    status: "",
  };
  employeesStore.clearFilters();
};

const handlePageChange = (page: number) => {
  employeesStore.setPage(page);
};

const handleRowsPerPageChange = (rowsPerPage: number) => {
  employeesStore.itemsPerPage = rowsPerPage;
  employeesStore.setPage(1);
};

const handleView = (employee: any) => {
  router.push(`/employees/${employee.id}`);
};

const handleEdit = (employee: any) => {
  router.push(`/employees/${employee.id}/edit`);
};

const handleDelete = (employee: any) => {
  // Implement delete confirmation
  console.log("Delete employee:", employee.id);
};

const exportData = () => {
  // Implement data export
  console.log("Export employees data");
};

const getCompanyName = (companyId: string) => {
  const company = companiesStore.companies.find((c) => c.id === companyId);
  return company?.name || "Unknown Company";
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

const getPerformanceColor = (rating: number) => {
  if (rating >= 4.5) return "bg-green-500";
  if (rating >= 4.0) return "bg-blue-500";
  if (rating >= 3.5) return "bg-yellow-500";
  return "bg-red-500";
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

// Lifecycle
onMounted(async () => {
  await Promise.all([
    employeesStore.fetchEmployees(),
    companiesStore.fetchCompanies(),
    departmentsStore.fetchDepartments(),
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
