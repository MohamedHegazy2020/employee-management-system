<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading department details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Department</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <BaseButton
        label="Try Again"
        icon="pi pi-refresh"
        variant="primary"
        @click="loadDepartment"
      />
    </div>

    <!-- Department Details -->
    <div v-else-if="department" class="space-y-8">
      <!-- Department Header Card -->
      <div class="detail-card">
        <div class="detail-header">
          <div class="flex items-center space-x-6">
            <!-- Department Icon -->
            <div class="flex-shrink-0">
              <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <i class="pi pi-sitemap text-white text-3xl"></i>
              </div>
            </div>

            <!-- Department Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ department.name }}</h2>
                <Tag
                  :value="department.status"
                  :severity="getStatusSeverity(department.status)"
                  class="text-xs font-semibold"
                />
              </div>
              <p class="text-lg text-gray-600 mb-1">{{ department.company }}</p>
              <p class="text-sm text-gray-500">Department Code: {{ department.code }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <BaseButton
              label="Back to List"
              icon="pi pi-arrow-left"
              variant="secondary"
              size="medium"
              @click="$router.push('/departments')"
            />
            <BaseButton
              label="Edit Department"
              icon="pi pi-pencil"
              variant="primary"
              size="medium"
              @click="$router.push(`/departments/${departmentId}/edit`)"
            />
          </div>
        </div>

        <div class="detail-content">
          <!-- Department Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600">Employees</p>
                  <p class="text-2xl font-bold text-green-900">{{ department.employeeCount }}</p>
                </div>
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-users text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600">Budget</p>
                  <p class="text-2xl font-bold text-blue-900">{{ formatCurrency(department.budget) }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-dollar text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600">Type</p>
                  <p class="text-2xl font-bold text-purple-900">{{ department.type || 'N/A' }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-tag text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600">Established</p>
                  <p class="text-2xl font-bold text-orange-900">{{ formatDate(department.establishedDate) }}</p>
                </div>
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-calendar text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Department Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <i class="pi pi-info-circle text-blue-600 mr-2"></i>
                Department Information
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-envelope text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="text-gray-900">{{ department.email }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-phone text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Phone</p>
                    <p class="text-gray-900">{{ department.phone }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-user text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Manager</p>
                    <p class="text-gray-900">{{ department.manager || 'Not Assigned' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <i class="pi pi-map-marker text-orange-600 mr-2"></i>
                Location
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-map-marker text-orange-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Location</p>
                    <p class="text-gray-900">{{ department.location }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-building text-indigo-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Floor</p>
                    <p class="text-gray-900">{{ department.floor || 'N/A' }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-home text-teal-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Room</p>
                    <p class="text-gray-900">{{ department.roomNumber || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="pi pi-clock text-orange-600 mr-2"></i>
              <span>Recent Activity</span>
            </div>
            <BaseButton
              label="View All"
              icon="pi pi-arrow-right"
              variant="outline"
              size="small"
              padding="compact"
              @click="$router.push('/dashboard')"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">Department profile updated</p>
                <p class="text-xs text-gray-500">{{ formatDate(department.updatedAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">Department created</p>
                <p class="text-xs text-gray-500">{{ formatDate(department.createdAt) }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDepartmentsStore } from "@/stores/departments";
import { useCompaniesStore } from "@/stores/companies";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { BaseButton } from "@/components/ui";

const router = useRouter();
const route = useRoute();
const departmentsStore = useDepartmentsStore();
const companiesStore = useCompaniesStore();

// Route params
const departmentId = route.params.id as string;

// Component state
const loading = ref(true);
const error = ref("");

// Computed properties
const department = computed(() => {
  return departmentsStore.getDepartmentById(departmentId);
});

const companyInfo = computed(() => {
  if (!department.value?.companyId) return null;
  return companiesStore.getCompanyById(department.value.companyId);
});

// Methods
const loadDepartment = async () => {
  loading.value = true;
  error.value = "";

  try {
    await Promise.all([
      departmentsStore.fetchDepartments(),
      companiesStore.fetchCompanies(),
    ]);

    if (!department.value) {
      error.value = "Department not found";
    }
  } catch (err) {
    error.value = "Failed to load department data";
    console.error("Error loading department:", err);
  } finally {
    loading.value = false;
  }
};

const getStatusSeverity = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    case 'planning':
      return 'warning';
    case 'suspended':
      return 'secondary';
    default:
      return 'info';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const calculateBudgetUsage = () => {
  // Mock calculation - in real app, this would be based on actual spending
  return Math.floor(Math.random() * 100);
};

// Load data on mount
onMounted(() => {
  loadDepartment();
});
</script> 