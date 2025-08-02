<template>
  <div class="space-y-6">
    <!-- Header with Breadcrumb -->
    <div class="flex items-center justify-between">
      <div>
        <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <router-link
            to="/employees"
            class="hover:text-blue-600 transition-colors"
          >
            Employees
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium"
            >{{ employee?.firstName }} {{ employee?.lastName }}</span
          >
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Employee Details</h1>
        <p class="mt-1 text-sm text-gray-600">
          View comprehensive information about {{ employee?.firstName }}
          {{ employee?.lastName }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <BaseButton
          label="Back to List"
          icon="pi pi-arrow-left"
          variant="secondary"
          size="medium"
          padding="normal"
          @click="$router.push('/employees')"
        />
        <BaseButton
          label="Edit Employee"
          icon="pi pi-pencil"
          variant="primary"
          size="medium"
          padding="normal"
          @click="$router.push(`/employees/${employeeId}/edit`)"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading employee details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-xl p-6"
    >
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-500 text-xl mr-3"></i>
        <div>
          <h3 class="text-red-800 font-semibold">Error Loading Employee</h3>
          <p class="text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Employee Details -->
    <div v-else-if="employee" class="space-y-8">
      <!-- Employee Header Card -->
      <div class="detail-card">
        <div class="detail-header">
          <div class="flex items-center space-x-6">
            <!-- Employee Avatar -->
            <div class="flex-shrink-0">
              <Avatar
                v-bind="
                  getAvatarProps(
                    employee.firstName,
                    employee.lastName,
                    employee.avatar
                  )
                "
                size="xlarge"
                shape="circle"
                class="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold"
              />
            </div>

            <!-- Employee Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ employee.firstName }} {{ employee.lastName }}
                </h2>
                <Tag
                  :value="employee.status"
                  :severity="getStatusSeverity(employee.status)"
                  class="text-xs font-semibold"
                />
              </div>
              <p class="text-lg text-gray-600 mb-1">{{ employee.position }}</p>
              <p class="text-sm text-gray-500">
                {{ employee.department }} • {{ employee.company }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <BaseButton
              label="Back to List"
              icon="pi pi-arrow-left"
              variant="secondary"
              size="medium"
              @click="$router.push('/employees')"
            />
            <BaseButton
              label="Edit Employee"
              icon="pi pi-pencil"
              variant="primary"
              size="medium"
              @click="$router.push(`/employees/${employeeId}/edit`)"
            />
          </div>
        </div>

        <div class="detail-content">
          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-envelope text-blue-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="text-gray-900">{{ employee.email }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-phone text-green-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Phone</p>
                <p class="text-gray-900">{{ employee.phone }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-calendar text-purple-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Hire Date</p>
                <p class="text-gray-900">{{ formatDate(employee.hireDate) }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-dollar text-orange-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Salary</p>
                <p class="text-gray-900">
                  {{ formatCurrency(employee.salary) }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-star text-indigo-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Performance</p>
                <p class="text-gray-900">{{ employee.performanceRating }}/5</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-briefcase text-teal-600"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Employment Type</p>
                <p class="text-gray-900">{{ employee.employmentType }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-dollar text-blue-600 text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">
                ${{ formatCurrency(employee.salary) }}
              </h3>
              <p class="text-gray-600 text-sm">Annual Salary</p>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-calendar text-green-600 text-xl"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900">
                {{ formatDate(employee.hireDate) }}
              </h3>
              <p class="text-gray-600 text-sm">Hire Date</p>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-star text-purple-600 text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ employee.skills.length }}
              </h3>
              <p class="text-gray-600 text-sm">Skills</p>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-certificate text-orange-600 text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ employee.certifications.length }}
              </h3>
              <p class="text-gray-600 text-sm">Certifications</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Detailed Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-user text-blue-600 mr-2"></i>
              <span>Personal Information</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Full Name</span>
                <span class="text-gray-900 font-semibold"
                  >{{ employee.firstName }} {{ employee.lastName }}</span
                >
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Email Address</span>
                <span class="text-gray-900">{{ employee.email }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Phone Number</span>
                <span class="text-gray-900">{{ employee.phone }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Date of Birth</span>
                <span class="text-gray-900">{{
                  formatDate(employee.dateOfBirth)
                }}</span>
              </div>
              <div class="flex justify-between items-start py-3">
                <span class="text-gray-600 font-medium">Employment Status</span>
                <Tag
                  :value="employee.status"
                  :severity="getStatusSeverity(employee.status)"
                  class="capitalize"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Work Information -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-briefcase text-green-600 mr-2"></i>
              <span>Work Information</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Position</span>
                <span class="text-gray-900 font-semibold">{{
                  employee.position
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Company</span>
                <span class="text-gray-900">{{
                  getCompanyName(employee.companyId)
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Department</span>
                <span class="text-gray-900">{{ employee.department }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Manager</span>
                <span class="text-gray-900">{{
                  getManagerName(employee.managerId) || "No Manager"
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Hire Date</span>
                <span class="text-gray-900">{{
                  formatDate(employee.hireDate)
                }}</span>
              </div>
              <div class="flex justify-between items-start py-3">
                <span class="text-gray-600 font-medium">Annual Salary</span>
                <span class="text-gray-900 font-semibold text-green-600"
                  >${{ formatCurrency(employee.salary) }}</span
                >
              </div>
            </div>
          </template>
        </Card>

        <!-- Address Information -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-map-marker text-orange-600 mr-2"></i>
              <span>Address Information</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <i class="pi pi-map-marker text-gray-400 mt-1"></i>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Home Address</h4>
                  <p class="text-gray-600 leading-relaxed">
                    {{ employee.address.street }}<br />
                    {{ employee.address.city }}, {{ employee.address.state }}
                    {{ employee.address.zipCode }}<br />
                    {{ employee.address.country }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Emergency Contact -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-phone text-red-600 mr-2"></i>
              <span>Emergency Contact</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Contact Name</span>
                <span class="text-gray-900 font-semibold">{{
                  employee.emergencyContact.name
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Relationship</span>
                <span class="text-gray-900">{{
                  employee.emergencyContact.relationship
                }}</span>
              </div>
              <div class="flex justify-between items-start py-3">
                <span class="text-gray-600 font-medium">Phone Number</span>
                <a
                  :href="`tel:${employee.emergencyContact.phone}`"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ employee.emergencyContact.phone }}
                </a>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Skills and Certifications -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Skills -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-star text-purple-600 mr-2"></i>
              <span>Skills ({{ employee.skills.length }})</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag
                v-for="skill in employee.skills"
                :key="skill"
                :value="skill"
                severity="info"
                class="text-sm"
              />
            </div>
          </template>
        </Card>

        <!-- Certifications -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-certificate text-orange-600 mr-2"></i>
              <span>Certifications ({{ employee.certifications.length }})</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-wrap gap-2">
              <Tag
                v-for="certification in employee.certifications"
                :key="certification"
                :value="certification"
                severity="success"
                class="text-sm"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Performance History -->
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="pi pi-chart-line text-blue-600 mr-2"></i>
              <span>Performance History</span>
            </div>
            <BaseButton
              label="View Full History"
              variant="text"
              size="small"
              @click="viewPerformanceHistory"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between py-3 border-b border-gray-100"
            >
              <div>
                <p class="font-semibold text-gray-900">Current Rating</p>
                <p class="text-sm text-gray-600">
                  Last updated: {{ formatDate(employee.lastReviewDate) }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">
                  {{ employee.performanceRating }}/5
                </div>
                <div class="flex items-center justify-end mt-1">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getPerformanceColor(employee.performanceRating)"
                      :style="{
                        width: `${(employee.performanceRating / 5) * 100}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div class="p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">4.5</div>
                <div class="text-sm text-gray-600">Q1 2024</div>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">4.8</div>
                <div class="text-sm text-gray-600">Q2 2024</div>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">4.6</div>
                <div class="text-sm text-gray-600">Q3 2024</div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="pi pi-exclamation-triangle text-gray-400 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Employee Not Found
      </h3>
      <p class="text-gray-600 mb-6">
        The employee you're looking for doesn't exist or has been removed.
      </p>
      <BaseButton
        label="Back to Employees"
        variant="primary"
        @click="$router.push('/employees')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeesStore } from "@/stores/employees";
import { useCompaniesStore } from "@/stores/companies";
import { useDepartmentsStore } from "@/stores/departments";
import Card from "primevue/card";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";
import ProgressBar from "primevue/progressbar";
import { BaseButton } from "@/components/ui";
import { getAvatarProps } from "@/utils/avatar";

const route = useRoute();
const router = useRouter();
const employeesStore = useEmployeesStore();
const companiesStore = useCompaniesStore();
const departmentsStore = useDepartmentsStore();

const employeeId = computed(() => route.params.id as string);
const loading = ref(false);
const error = ref<string | null>(null);
const employee = ref<any>(null);

// Methods
const fetchEmployeeDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundEmployee = employeesStore.getEmployeeById(employeeId.value);
    if (foundEmployee) {
      employee.value = foundEmployee;
    } else {
      error.value = "Employee not found";
    }
  } catch (err) {
    error.value = "Failed to load employee details";
    console.error("Error fetching employee:", err);
  } finally {
    loading.value = false;
  }
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
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
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

const viewPerformanceHistory = () => {
  // Navigate to performance history page or show modal
  console.log("View performance history for employee:", employee.value?.id);
};

onMounted(async () => {
  await Promise.all([
    employeesStore.fetchEmployees(),
    companiesStore.fetchCompanies(),
    departmentsStore.fetchDepartments(),
  ]);
  fetchEmployeeDetails();
});
</script>

<style scoped>
.employee-header-card {
  background: linear-gradient(
    135deg,
    rgb(255 255 255) 0%,
    rgb(249 250 251) 100%
  );
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

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

:deep(.p-card-title) {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17 24 39);
  margin-bottom: 1rem;
}

:deep(.p-card-content) {
  padding: 1.5rem;
}
</style>
