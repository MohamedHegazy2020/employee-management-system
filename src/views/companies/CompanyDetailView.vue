<template>
  <div class="space-y-6">
    <!-- Header with Breadcrumb -->
    <div class="flex items-center justify-between">
      <div>
        <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <router-link
            to="/companies"
            class="hover:text-blue-600 transition-colors"
          >
            Companies
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">{{
            company?.name || "Loading..."
          }}</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Company Details</h1>
        <p class="mt-1 text-sm text-gray-600">
          View comprehensive information about {{ company?.name }}
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
          @click="$router.push('/companies')"
        />
        <BaseButton
          label="Edit Company"
          icon="pi pi-pencil"
          variant="primary"
          size="medium"
          padding="normal"
          @click="$router.push(`/companies/${companyId}/edit`)"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading company details...</p>
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
          <h3 class="text-red-800 font-semibold">Error Loading Company</h3>
          <p class="text-red-600 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Company Details -->
    <div v-else-if="company" class="space-y-6">
      <!-- Company Header Card -->
      <Card class="company-header-card">
        <template #content>
          <div class="flex items-start space-x-6">
            <!-- Company Avatar -->
            <div class="flex-shrink-0">
              <div
                class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-building text-white text-3xl"></i>
              </div>
            </div>

            <!-- Company Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h2 class="text-2xl font-bold text-gray-900">
                  {{ company.name }}
                </h2>
                <span
                  class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
                >
                  {{ company.code }}
                </span>
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"
              >
                <div class="flex items-center">
                  <i class="pi pi-envelope text-gray-400 mr-2"></i>
                  <a
                    :href="`mailto:${company.email}`"
                    class="hover:text-blue-600 transition-colors"
                  >
                    {{ company.email }}
                  </a>
                </div>
                <div class="flex items-center">
                  <i class="pi pi-phone text-gray-400 mr-2"></i>
                  <a
                    :href="`tel:${company.phone}`"
                    class="hover:text-blue-600 transition-colors"
                  >
                    {{ company.phone }}
                  </a>
                </div>
                <div v-if="company.website" class="flex items-center">
                  <i class="pi pi-globe text-gray-400 mr-2"></i>
                  <a
                    :href="company.website"
                    target="_blank"
                    class="hover:text-blue-600 transition-colors"
                  >
                    {{ company.website }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex-shrink-0">
              <span
                class="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full"
              >
                Active
              </span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-users text-blue-600 text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ company.employeeCount }}
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
                <i class="pi pi-sitemap text-green-600 text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-900">
                {{ company.departmentCount }}
              </h3>
              <p class="text-gray-600 text-sm">Departments</p>
            </div>
          </template>
        </Card>

        <Card class="stat-card">
          <template #content>
            <div class="text-center">
              <div
                class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <i class="pi pi-calendar text-purple-600 text-xl"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900">
                {{ formatDate(company.createdAt) }}
              </h3>
              <p class="text-gray-600 text-sm">Founded</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Detailed Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Company Information -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-info-circle text-blue-600 mr-2"></i>
              <span>Company Information</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Company Name</span>
                <span class="text-gray-900 font-semibold">{{
                  company.name
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Company Code</span>
                <span class="text-gray-900 font-semibold">{{
                  company.code
                }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Email Address</span>
                <span class="text-gray-900">{{ company.email }}</span>
              </div>
              <div
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Phone Number</span>
                <span class="text-gray-900">{{ company.phone }}</span>
              </div>
              <div
                v-if="company.website"
                class="flex justify-between items-start py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Website</span>
                <a
                  :href="company.website"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {{ company.website }}
                </a>
              </div>
              <div class="flex justify-between items-start py-3">
                <span class="text-gray-600 font-medium">Last Updated</span>
                <span class="text-gray-900">{{
                  formatDate(company.updatedAt)
                }}</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Address Information -->
        <Card>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-map-marker text-green-600 mr-2"></i>
              <span>Address Information</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <i class="pi pi-map-marker text-gray-400 mt-1"></i>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">
                    Company Address
                  </h4>
                  <p class="text-gray-600 leading-relaxed">
                    {{ company.address }}
                  </p>
                </div>
              </div>

              <div
                v-if="company.parentId"
                class="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <i class="pi pi-building text-blue-600"></i>
                  <span class="font-semibold text-blue-900"
                    >Parent Company</span
                  >
                </div>
                <p class="text-blue-800">
                  {{ getParentCompanyName(company.parentId) }}
                </p>
              </div>
            </div>
          </template>
        </Card>
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
              variant="text"
              size="small"
              @click="viewActivity"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div
              class="flex items-center space-x-3 py-3 border-b border-gray-100"
            >
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-plus text-green-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  New employee added
                </p>
                <p class="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div
              class="flex items-center space-x-3 py-3 border-b border-gray-100"
            >
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-pencil text-blue-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  Company information updated
                </p>
                <p class="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>

            <div class="flex items-center space-x-3 py-3">
              <div
                class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
              >
                <i class="pi pi-sitemap text-purple-600 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  New department created
                </p>
                <p class="text-xs text-gray-500">3 days ago</p>
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
        Company Not Found
      </h3>
      <p class="text-gray-600 mb-6">
        The company you're looking for doesn't exist or has been removed.
      </p>
      <BaseButton
        label="Back to Companies"
        variant="primary"
        @click="$router.push('/companies')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompaniesStore } from "@/stores/companies";
import { BaseButton } from "@/components/ui";
import Card from "primevue/card";

const route = useRoute();
const router = useRouter();
const companiesStore = useCompaniesStore();

const companyId = computed(() => route.params.id as string);
const loading = ref(false);
const error = ref<string | null>(null);
const company = ref<any>(null);

// Methods
const fetchCompanyDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundCompany = companiesStore.getCompanyById(companyId.value);
    if (foundCompany) {
      company.value = foundCompany;
    } else {
      error.value = "Company not found";
    }
  } catch (err) {
    error.value = "Failed to load company details";
    console.error("Error fetching company:", err);
  } finally {
    loading.value = false;
  }
};

const getParentCompanyName = (parentId: string) => {
  const parent = companiesStore.companies.find((c) => c.id === parentId);
  return parent?.name || "Unknown Parent Company";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const viewActivity = () => {
  // Navigate to activity page or show modal
  console.log("View activity for company:", company.value?.id);
};

onMounted(() => {
  fetchCompanyDetails();
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
