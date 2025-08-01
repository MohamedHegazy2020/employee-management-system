<template>
  <div class="space-y-8">
    <!-- Page header with gradient background -->
    <div
      class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg"
    >
      <h1 class="text-4xl font-bold mb-2">Dashboard</h1>
      <p class="text-blue-100 text-lg">
        Welcome back, {{ authStore.user?.name }}! Here's what's happening in
        your organization.
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card class="stat-card shadow-sm border border-gray-200/50">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Companies</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.companies }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
            >
              <i class="pi pi-building text-blue-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card shadow-sm border border-gray-200/50">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Departments</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.departments }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"
            >
              <i class="pi pi-sitemap text-green-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card shadow-sm border border-gray-200/50">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Employees</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.employees }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"
            >
              <i class="pi pi-users text-purple-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card shadow-sm border border-gray-200/50">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Projects</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.projects }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
            >
              <i class="pi pi-briefcase text-orange-600 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activity and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Recent Activity with enhanced styling -->
      <Card class="shadow-sm border border-gray-200/50">
        <template #header>
          <div
            class="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-clock text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <BaseButton
              label="View All"
              variant="primary"
              size="small"
              padding="compact"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4 p-4">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md"
                >
                  <i :class="activity.icon" class="text-white text-lg"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 leading-relaxed">
                  {{ activity.message }}
                </p>
                <p class="text-xs text-gray-500 mt-1 flex items-center">
                  <i class="pi pi-clock mr-1"></i>
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Quick actions with improved styling -->
      <Card class="shadow-sm border border-gray-200/50">
        <template #header>
          <div
            class="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-t-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-bolt text-white"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
          </div>
        </template>
        <template #content>
          <div class="space-y-4 p-4">
            <BaseButton
              label="Add New Company"
              icon="pi pi-plus"
              variant="primary"
              size="medium"
              padding="comfortable"
              fullWidth
              class="justify-start h-12 text-left"
              @click="$router.push('/companies/create')"
            />

            <BaseButton
              label="Add New Employee"
              icon="pi pi-user-plus"
              variant="success"
              size="medium"
              padding="comfortable"
              fullWidth
              class="justify-start h-12 text-left"
              @click="$router.push('/employees/create')"
            />

            <BaseButton
              label="Create Department"
              icon="pi pi-folder-plus"
              variant="purple"
              size="medium"
              padding="comfortable"
              fullWidth
              class="justify-start h-12 text-left"
              @click="$router.push('/departments/create')"
            />

            <BaseButton
              label="Export Report"
              icon="pi pi-download"
              variant="warning"
              size="medium"
              padding="comfortable"
              fullWidth
              class="justify-start h-12 text-left"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Company overview with enhanced table design -->
    <Card class="shadow-sm border border-gray-200/50">
      <template #header>
        <div
          class="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-t-lg"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-building text-white"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Company Overview</h3>
          </div>
          <BaseButton
            label="View All Companies"
            variant="indigo"
            size="small"
            padding="compact"
            @click="$router.push('/companies')"
          />
        </div>
      </template>
      <template #content>
        <div class="p-4">
          <BaseTable
            :data="topCompanies"
            :columns="companyTableColumns"
            :loading="false"
            :show-paginator="false"
            :show-header="false"
            :show-search="false"
            title=""
            description=""
            class="shadow-sm border border-gray-200/50"
          >
            <!-- Custom Company Column -->
            <template #body-name="{ data }">
              <div v-if="data" class="flex items-center space-x-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center"
                >
                  <i class="pi pi-building text-white text-sm"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ data.name }}</p>
                  <p class="text-sm text-gray-500">{{ data.code }}</p>
                </div>
              </div>
            </template>

            <!-- Custom Contact Column -->
            <template #body-email="{ data }">
              <div v-if="data">
                <p class="text-sm font-medium text-gray-900">
                  {{ data.email }}
                </p>
                <p class="text-sm text-gray-500">{{ data.phone }}</p>
              </div>
            </template>

            <!-- Custom Employees Column -->
            <template #body-employeeCount="{ data }">
              <span
                v-if="data"
                class="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full"
              >
                {{ data.employeeCount }}
              </span>
            </template>

            <!-- Custom Status Column -->
            <template #body-status="{ data }">
              <Tag
                v-if="data"
                value="Active"
                severity="success"
                class="font-bold"
              />
            </template>

            <!-- Custom Row Actions -->
            <template #row-actions="{ data }">
              <div
                v-if="data"
                class="flex items-center justify-center space-x-2"
              >
                <BaseButton
                  icon="pi pi-eye"
                  variant="info"
                  size="small"
                  padding="compact"
                  @click="$router.push(`/companies/${data.id}`)"
                />
                <BaseButton
                  icon="pi pi-pencil"
                  variant="success"
                  size="small"
                  padding="compact"
                  @click="$router.push(`/companies/${data.id}/edit`)"
                />
              </div>
            </template>
          </BaseTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCompaniesStore } from "@/stores/companies";
import Card from "primevue/card";
import { BaseButton } from "@/components/ui";
import { BaseTable } from "@/components/ui";
import Tag from "primevue/tag";

const authStore = useAuthStore();
const companiesStore = useCompaniesStore();

const stats = ref({
  companies: 0,
  departments: 0,
  employees: 0,
  projects: 0,
});

const recentActivity = ref([
  {
    id: 1,
    message: "New employee John Smith joined TechCorp Solutions",
    time: "2 hours ago",
    icon: "pi pi-user-plus",
  },
  {
    id: 2,
    message: 'Department "Engineering" created in Global Industries',
    time: "4 hours ago",
    icon: "pi pi-folder-plus",
  },
  {
    id: 3,
    message: 'Company "Startup Ventures" added to the system',
    time: "1 day ago",
    icon: "pi pi-building",
  },
  {
    id: 4,
    message: "Monthly report generated and exported",
    time: "2 days ago",
    icon: "pi pi-download",
  },
]);

const topCompanies = ref([]);

const companyTableColumns = ref([
  { field: "name", header: "Company", sortable: true },
  { field: "email", header: "Contact", sortable: true },
  { field: "employeeCount", header: "Employees", sortable: true },
  { field: "status", header: "Status", sortable: true },
  { field: "row-actions", header: "Actions", class: "text-center font-semibold" },
]);

onMounted(async () => {
  await companiesStore.fetchCompanies();

  // Update stats
  stats.value.companies = companiesStore.companies.length;
  stats.value.departments = companiesStore.companies.reduce(
    (sum, company) => sum + company.departmentCount,
    0
  );
  stats.value.employees = companiesStore.companies.reduce(
    (sum, company) => sum + company.employeeCount,
    0
  );
  stats.value.projects = 12; // Mock data

  // Get top companies
  topCompanies.value = companiesStore.companies.slice(0, 5);
});
</script>

<style scoped>

</style>
