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
    <div v-else-if="department">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <router-link
              to="/departments"
              class="hover:text-blue-600 transition-colors"
            >
              Departments
            </router-link>
            <i class="pi pi-chevron-right text-xs"></i>
            <span class="text-gray-900 font-medium">{{ department.name }}</span>
          </nav>
          <h1 class="text-3xl font-bold text-gray-900">{{ department.name }}</h1>
          <p class="mt-1 text-sm text-gray-600">
            Department Code: {{ department.code }} | Type: {{ department.type }}
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
            @click="$router.push('/departments')"
          />
          <BaseButton
            label="Edit Department"
            icon="pi pi-pencil"
            variant="primary"
            size="medium"
            padding="normal"
            @click="$router.push(`/departments/${department.id}/edit`)"
          />
        </div>
      </div>

      <!-- Department Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Department Card -->
        <div class="lg:col-span-2">
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-sitemap text-blue-600 mr-2"></i>
                <span>Department Overview</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Department Name</label>
                    <p class="text-lg font-semibold text-gray-900">{{ department.name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Department Code</label>
                    <p class="text-lg font-semibold text-gray-900">{{ department.code }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Department Type</label>
                    <p class="text-lg text-gray-900">{{ department.type }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Status</label>
                    <Tag
                      :value="department.status"
                      :severity="getStatusSeverity(department.status)"
                      class="text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Company</label>
                    <p class="text-lg text-gray-900">{{ department.company }}</p>
                  </div>
                  <div v-if="department.manager">
                    <label class="text-sm font-medium text-gray-700">Manager</label>
                    <p class="text-lg text-gray-900">{{ department.manager }}</p>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="text-sm font-medium text-gray-700">Email</label>
                      <p class="text-lg text-gray-900">
                        <a :href="`mailto:${department.email}`" class="text-blue-600 hover:text-blue-800">
                          {{ department.email }}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700">Phone</label>
                      <p class="text-lg text-gray-900">
                        <a :href="`tel:${department.phone}`" class="text-blue-600 hover:text-blue-800">
                          {{ department.phone }}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Location and Budget -->
                <div class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Location and Budget</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="text-sm font-medium text-gray-700">Location</label>
                      <p class="text-lg text-gray-900">{{ department.location }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700">Annual Budget</label>
                      <p class="text-lg font-semibold text-gray-900">${{ formatCurrency(department.budget) }}</p>
                    </div>
                    <div v-if="department.floor">
                      <label class="text-sm font-medium text-gray-700">Floor/Level</label>
                      <p class="text-lg text-gray-900">{{ department.floor }}</p>
                    </div>
                    <div v-if="department.roomNumber">
                      <label class="text-sm font-medium text-gray-700">Room Number</label>
                      <p class="text-lg text-gray-900">{{ department.roomNumber }}</p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="department.description" class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                  <p class="text-gray-700 leading-relaxed">{{ department.description }}</p>
                </div>

                <!-- Skills and Requirements -->
                <div v-if="department.requiredSkills?.length || department.preferredCertifications?.length" class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Skills and Requirements</h4>
                  <div class="space-y-4">
                    <div v-if="department.requiredSkills?.length">
                      <label class="text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                      <div class="flex flex-wrap gap-2">
                        <Tag
                          v-for="skill in department.requiredSkills"
                          :key="skill"
                          :value="skill"
                          severity="info"
                        />
                      </div>
                    </div>
                    <div v-if="department.preferredCertifications?.length">
                      <label class="text-sm font-medium text-gray-700 mb-2">Preferred Certifications</label>
                      <div class="flex flex-wrap gap-2">
                        <Tag
                          v-for="cert in department.preferredCertifications"
                          :key="cert"
                          :value="cert"
                          severity="success"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Statistics Sidebar -->
        <div class="space-y-6">
          <!-- Quick Stats -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-chart-bar text-green-600 mr-2"></i>
                <span>Quick Stats</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Employees</span>
                  <span class="text-lg font-semibold text-gray-900">{{ department.employeeCount || 0 }}</span>
                </div>
                <div v-if="department.maxEmployees" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Max Employees</span>
                  <span class="text-lg font-semibold text-gray-900">{{ department.maxEmployees }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Budget Used</span>
                  <span class="text-sm text-gray-900">{{ calculateBudgetUsage() }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Created</span>
                  <span class="text-sm text-gray-900">{{ formatDate(department.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Updated</span>
                  <span class="text-sm text-gray-900">{{ formatDate(department.updatedAt) }}</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- Company Info -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-building text-purple-600 mr-2"></i>
                <span>Company Information</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-700">Company Name</label>
                  <p class="text-lg font-semibold text-gray-900">{{ department.company }}</p>
                </div>
                <div v-if="companyInfo">
                  <label class="text-sm font-medium text-gray-700">Industry</label>
                  <p class="text-gray-900">{{ companyInfo.industry }}</p>
                </div>
                <BaseButton
                  label="View Company"
                  icon="pi pi-external-link"
                  variant="outline"
                  size="small"
                  padding="compact"
                  @click="$router.push(`/companies/${department.companyId}`)"
                />
              </div>
            </template>
          </Card>

          <!-- Department Settings -->
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-cog text-orange-600 mr-2"></i>
                <span>Department Settings</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Active Department</span>
                  <Tag
                    :value="department.isActive ? 'Yes' : 'No'"
                    :severity="department.isActive ? 'success' : 'danger'"
                    class="text-xs"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Remote Work Allowed</span>
                  <Tag
                    :value="department.allowRemoteWork ? 'Yes' : 'No'"
                    :severity="department.allowRemoteWork ? 'success' : 'secondary'"
                    class="text-xs"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Budget Management</span>
                  <Tag
                    :value="department.hasBudget ? 'Yes' : 'No'"
                    :severity="department.hasBudget ? 'success' : 'secondary'"
                    class="text-xs"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-700">Hiring Approval Required</span>
                  <Tag
                    :value="department.requiresApproval ? 'Yes' : 'No'"
                    :severity="department.requiresApproval ? 'warning' : 'secondary'"
                    class="text-xs"
                  />
                </div>
              </div>
            </template>
          </Card>
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