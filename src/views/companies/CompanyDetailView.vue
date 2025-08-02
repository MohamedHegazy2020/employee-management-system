<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading company details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Company</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <BaseButton
        label="Try Again"
        icon="pi pi-refresh"
        variant="primary"
        @click="loadCompany"
      />
    </div>

    <!-- Company Details -->
    <div v-else-if="company" class="space-y-8">
      <!-- Company Header Card -->
      <div class="detail-card">
        <div class="detail-header">
          <div class="flex items-center space-x-6">
            <!-- Company Logo -->
            <div class="flex-shrink-0">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <i class="pi pi-building text-white text-3xl"></i>
              </div>
            </div>

            <!-- Company Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">{{ company.name }}</h2>
                <Tag
                  :value="company.status"
                  :severity="getStatusSeverity(company.status)"
                  class="text-xs font-semibold"
                />
              </div>
              <p class="text-lg text-gray-600 mb-1">{{ company.industry }}</p>
              <p class="text-sm text-gray-500">{{ company.size }} Company</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <BaseButton
              label="Back to List"
              icon="pi pi-arrow-left"
              variant="secondary"
              size="medium"
              @click="$router.push('/companies')"
            />
            <BaseButton
              label="Edit Company"
              icon="pi pi-pencil"
              variant="primary"
              size="medium"
              @click="$router.push(`/companies/${companyId}/edit`)"
            />
          </div>
        </div>

        <div class="detail-content">
          <!-- Company Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600">Employees</p>
                  <p class="text-2xl font-bold text-blue-900">{{ company.employeeCount }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-users text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600">Departments</p>
                  <p class="text-2xl font-bold text-green-900">{{ company.departmentCount }}</p>
                </div>
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-sitemap text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600">Founded</p>
                  <p class="text-2xl font-bold text-purple-900">{{ company.foundedYear || 'N/A' }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-calendar text-white text-xl"></i>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600">Revenue</p>
                  <p class="text-2xl font-bold text-orange-900">{{ formatCurrency(company.annualRevenue) }}</p>
                </div>
                <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <i class="pi pi-dollar text-white text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <i class="pi pi-envelope text-blue-600 mr-2"></i>
                Contact Information
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-envelope text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="text-gray-900">{{ company.email }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-phone text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Phone</p>
                    <p class="text-gray-900">{{ company.phone }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-globe text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Website</p>
                    <a :href="company.website" target="_blank" class="text-blue-600 hover:text-blue-800">
                      {{ company.website || 'N/A' }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <i class="pi pi-map-marker text-orange-600 mr-2"></i>
                Address
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                    <i class="pi pi-map-marker text-orange-600 text-sm"></i>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Address</p>
                    <p class="text-gray-900">{{ company.address }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Company Card -->
        <div class="lg:col-span-2">
          <Card>
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-building text-blue-600 mr-2"></i>
                <span>Company Overview</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <!-- Basic Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Company Name</label>
                    <p class="text-lg font-semibold text-gray-900">{{ company.name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Company Code</label>
                    <p class="text-lg font-semibold text-gray-900">{{ company.code }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Industry</label>
                    <p class="text-lg text-gray-900">{{ company.industry }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Company Size</label>
                    <p class="text-lg text-gray-900">{{ company.size }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Status</label>
                    <Tag
                      :value="company.status"
                      :severity="getStatusSeverity(company.status)"
                      class="text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700">Founded Year</label>
                    <p class="text-lg text-gray-900">{{ company.foundedYear || 'Not specified' }}</p>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="text-sm font-medium text-gray-700">Email</label>
                      <p class="text-lg text-gray-900">
                        <a :href="`mailto:${company.email}`" class="text-blue-600 hover:text-blue-800">
                          {{ company.email }}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-700">Phone</label>
                      <p class="text-lg text-gray-900">
                        <a :href="`tel:${company.phone}`" class="text-blue-600 hover:text-blue-800">
                          {{ company.phone }}
                        </a>
                      </p>
                    </div>
                    <div v-if="company.website">
                      <label class="text-sm font-medium text-gray-700">Website</label>
                      <p class="text-lg text-gray-900">
                        <a :href="company.website" target="_blank" class="text-blue-600 hover:text-blue-800">
                          {{ company.website }}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Address</h4>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-900">
                      {{ company.address?.street }}<br>
                      {{ company.address?.city }}, {{ company.address?.state }} {{ company.address?.zipCode }}<br>
                      {{ getCountryName(company.address?.country) }}
                    </p>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="company.description" class="border-t pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                  <p class="text-gray-700 leading-relaxed">{{ company.description }}</p>
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
                  <span class="text-lg font-semibold text-gray-900">{{ company.employeeCount || 0 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Departments</span>
                  <span class="text-lg font-semibold text-gray-900">{{ company.departmentCount || 0 }}</span>
                </div>
                <div v-if="company.annualRevenue" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Annual Revenue</span>
                  <span class="text-lg font-semibold text-gray-900">${{ formatCurrency(company.annualRevenue) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Created</span>
                  <span class="text-sm text-gray-900">{{ formatDate(company.createdAt) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Updated</span>
                  <span class="text-sm text-gray-900">{{ formatDate(company.updatedAt) }}</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- Parent Company -->
          <Card v-if="parentCompany">
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-sitemap text-purple-600 mr-2"></i>
                <span>Parent Company</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-3">
                <div>
                  <label class="text-sm font-medium text-gray-700">Name</label>
                  <p class="text-lg font-semibold text-gray-900">{{ parentCompany.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Industry</label>
                  <p class="text-gray-900">{{ parentCompany.industry }}</p>
                </div>
                <BaseButton
                  label="View Parent"
                  icon="pi pi-external-link"
                  variant="outline"
                  size="small"
                  padding="compact"
                  @click="$router.push(`/companies/${parentCompany.id}`)"
                />
              </div>
            </template>
          </Card>

          <!-- Social Media -->
          <Card v-if="hasSocialMedia">
            <template #title>
              <div class="flex items-center">
                <i class="pi pi-globe text-blue-600 mr-2"></i>
                <span>Social Media</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-3">
                <div v-if="company.socialMedia?.linkedin">
                  <a :href="company.socialMedia.linkedin" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
                    <i class="pi pi-linkedin mr-2"></i>
                    <span>LinkedIn</span>
                  </a>
                </div>
                <div v-if="company.socialMedia?.twitter">
                  <a :href="company.socialMedia.twitter" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
                    <i class="pi pi-twitter mr-2"></i>
                    <span>Twitter</span>
                  </a>
                </div>
                <div v-if="company.socialMedia?.facebook">
                  <a :href="company.socialMedia.facebook" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
                    <i class="pi pi-facebook mr-2"></i>
                    <span>Facebook</span>
                  </a>
                </div>
                <div v-if="company.socialMedia?.instagram">
                  <a :href="company.socialMedia.instagram" target="_blank" class="flex items-center text-blue-600 hover:text-blue-800">
                    <i class="pi pi-instagram mr-2"></i>
                    <span>Instagram</span>
                  </a>
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
                <p class="text-sm text-gray-900">Company profile updated</p>
                <p class="text-xs text-gray-500">{{ formatDate(company.updatedAt) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">Company created</p>
                <p class="text-xs text-gray-500">{{ formatDate(company.createdAt) }}</p>
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
import { useCompaniesStore } from "@/stores/companies";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { BaseButton } from "@/components/ui";

const router = useRouter();
const route = useRoute();
const companiesStore = useCompaniesStore();

// Route params
const companyId = route.params.id as string;

// Component state
const loading = ref(true);
const error = ref("");

// Computed properties
const company = computed(() => {
  return companiesStore.getCompanyById(companyId);
});

const parentCompany = computed(() => {
  if (!company.value?.parentId) return null;
  return companiesStore.getCompanyById(company.value.parentId);
});

const hasSocialMedia = computed(() => {
  const social = company.value?.socialMedia;
  return social && (social.linkedin || social.twitter || social.facebook || social.instagram);
});

// Methods
const loadCompany = async () => {
  loading.value = true;
  error.value = "";

  try {
    await companiesStore.fetchCompanies();

    if (!company.value) {
      error.value = "Company not found";
    }
  } catch (err) {
    error.value = "Failed to load company data";
    console.error("Error loading company:", err);
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
    case 'pending':
      return 'warning';
    case 'suspended':
      return 'secondary';
    default:
      return 'info';
  }
};

const getCountryName = (countryCode: string) => {
  const countries: { [key: string]: string } = {
    'US': 'United States',
    'CA': 'Canada',
    'UK': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'AU': 'Australia',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
  };
  return countries[countryCode] || countryCode;
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

// Load data on mount
onMounted(() => {
  loadCompany();
});
</script>

<style scoped>
.company-header-card {
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

/* Enhanced card styling */
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

/* Responsive design */
@media (max-width: 768px) {
  .company-header-card {
    padding: 1rem;
  }

  :deep(.p-card-content) {
    padding: 1rem;
  }
}
</style>

