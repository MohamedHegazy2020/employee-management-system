<template>
  <div class="space-y-6">
    <!-- Header -->
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
          <router-link
            :to="`/companies/${companyId}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ company?.name }}
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">Edit Company</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">
          Edit Company: {{ company?.name }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          Update company information and details.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <BaseButton
          label="Cancel"
          icon="pi pi-times"
          variant="secondary"
          size="medium"
          padding="normal"
          @click="$router.push(`/companies/${companyId}`)"
        />
        <BaseButton
          label="Save Changes"
          icon="pi pi-check"
          variant="primary"
          size="medium"
          padding="normal"
          :loading="saving"
          @click="handleSubmit"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading company data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Error Loading Company
      </h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <BaseButton
        label="Try Again"
        icon="pi pi-refresh"
        variant="primary"
        @click="loadCompany"
      />
    </div>

    <!-- Company Form -->
    <div v-else-if="company">
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
        v-if="formError"
        severity="error"
        :closable="true"
        @close="formError = ''"
      >
        {{ formError }}
      </Message>

      <BaseForm
        :loading="saving"
        :show-default-actions="false"
        title="Company Information"
        description="Update company details and information"
      >
        <template #content>
          <!-- Basic Information -->
          <div class="space-y-6">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-building text-blue-600 mr-2"></i>
              Basic Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.name"
                label="Company Name"
                placeholder="Enter company name"
                :error="errors.name"
                required
              />

              <BaseInput
                v-model="formData.code"
                label="Company Code"
                placeholder="Enter company code"
                :error="errors.code"
                required
              />

              <BaseInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="Enter company email"
                :error="errors.email"
                required
              />

              <BaseInput
                v-model="formData.phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter company phone"
                :error="errors.phone"
                required
              />

              <BaseInput
                v-model="formData.website"
                label="Website"
                type="url"
                placeholder="Enter company website"
                :error="errors.website"
                hint="e.g., https://example.com"
              />

              <BaseDropdown
                v-model="formData.industry"
                label="Industry"
                :options="industryOptions"
                placeholder="Select industry"
                :error="errors.industry"
                required
              />

              <BaseDropdown
                v-model="formData.size"
                label="Company Size"
                :options="sizeOptions"
                placeholder="Select company size"
                :error="errors.size"
                required
              />

              <BaseDropdown
                v-model="formData.status"
                label="Status"
                :options="statusOptions"
                placeholder="Select status"
                :error="errors.status"
                required
              />
            </div>
          </div>

          <!-- Address Information -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-map-marker text-orange-600 mr-2"></i>
              Address Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.address.street"
                label="Street Address"
                placeholder="Enter street address"
                :error="errors.address?.street"
                required
              />

              <BaseInput
                v-model="formData.address.city"
                label="City"
                placeholder="Enter city"
                :error="errors.address?.city"
                required
              />

              <BaseInput
                v-model="formData.address.state"
                label="State/Province"
                placeholder="Enter state or province"
                :error="errors.address?.state"
                required
              />

              <BaseInput
                v-model="formData.address.zipCode"
                label="ZIP/Postal Code"
                placeholder="Enter ZIP or postal code"
                :error="errors.address?.zipCode"
                required
              />

              <BaseDropdown
                v-model="formData.address.country"
                label="Country"
                :options="countryOptions"
                placeholder="Select country"
                :error="errors.address?.country"
                required
              />
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-info-circle text-green-600 mr-2"></i>
              Additional Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseDropdown
                v-model="formData.parentId"
                label="Parent Company"
                :options="parentCompanyOptions"
                option-label="name"
                option-value="id"
                placeholder="Select parent company (optional)"
                :show-clear="true"
                :error="errors.parentId"
                hint="Leave empty if this is a parent company"
              />

              <BaseInput
                v-model.number="formData.foundedYear"
                label="Founded Year"
                type="number"
                placeholder="Enter founded year"
                :error="errors.foundedYear"
                :min="1800"
                :max="new Date().getFullYear()"
              />

              <BaseInput
                v-model.number="formData.annualRevenue"
                label="Annual Revenue"
                type="number"
                placeholder="Enter annual revenue"
                :error="errors.annualRevenue"
                hint="In USD"
              />

              <BaseInput
                v-model.number="formData.employeeCount"
                label="Number of Employees"
                type="number"
                placeholder="Enter employee count"
                :error="errors.employeeCount"
                :min="1"
              />
            </div>

            <BaseTextarea
              v-model="formData.description"
              label="Company Description"
              placeholder="Enter company description"
              :rows="4"
              :error="errors.description"
              hint="Brief description of the company's business and mission"
            />
          </div>

          <!-- Social Media & Contact -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-globe text-purple-600 mr-2"></i>
              Social Media & Contact
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.socialMedia.linkedin"
                label="LinkedIn"
                placeholder="Enter LinkedIn URL"
                :error="errors.socialMedia?.linkedin"
              />

              <BaseInput
                v-model="formData.socialMedia.twitter"
                label="Twitter"
                placeholder="Enter Twitter URL"
                :error="errors.socialMedia?.twitter"
              />

              <BaseInput
                v-model="formData.socialMedia.facebook"
                label="Facebook"
                placeholder="Enter Facebook URL"
                :error="errors.socialMedia?.facebook"
              />

              <BaseInput
                v-model="formData.socialMedia.instagram"
                label="Instagram"
                placeholder="Enter Instagram URL"
                :error="errors.socialMedia?.instagram"
              />
            </div>
          </div>
        </template>
      </BaseForm>

      <!-- Danger Zone -->
      <Card class="mt-8 border-red-200 bg-red-50">
        <template #title>
          <div class="flex items-center text-red-700">
            <i class="pi pi-exclamation-triangle mr-2"></i>
            <span>Danger Zone</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <p class="text-sm text-red-600">
              Once you delete a company, there is no going back. This will also
              delete all associated employees and departments.
            </p>
            <BaseButton
              label="Delete Company"
              icon="pi pi-trash"
              variant="danger"
              size="medium"
              padding="normal"
              @click="confirmDelete"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCompaniesStore } from "@/stores/companies";
import { useConfirm } from "primevue/useconfirm";
import Card from "primevue/card";
import Message from "primevue/message";
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BaseDropdown,
  BaseButton,
} from "@/components/ui";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();

const companiesStore = useCompaniesStore();

// Route params
const companyId = route.params.id as string;

// Component state
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");
const formError = ref("");

// Form data
const formData = reactive({
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  industry: null,
  size: null,
  status: null,
  parentId: null,
  foundedYear: null,
  annualRevenue: null,
  employeeCount: null,
  description: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: null,
  },
  socialMedia: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
});

// Validation errors
const errors = reactive({
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  size: "",
  status: "",
  parentId: "",
  foundedYear: "",
  annualRevenue: "",
  employeeCount: "",
  description: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  socialMedia: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
});

// Options
const industryOptions = [
  { label: "Technology", value: "Technology" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Finance", value: "Finance" },
  { label: "Education", value: "Education" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Retail", value: "Retail" },
  { label: "Consulting", value: "Consulting" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "Transportation", value: "Transportation" },
  { label: "Energy", value: "Energy" },
  { label: "Media & Entertainment", value: "Media & Entertainment" },
  { label: "Other", value: "Other" },
];

const sizeOptions = [
  { label: "Small (1-50)", value: "Small" },
  { label: "Medium (51-200)", value: "Medium" },
  { label: "Large (201-1000)", value: "Large" },
  { label: "Enterprise (1000+)", value: "Enterprise" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
  { label: "Suspended", value: "Suspended" },
];

const countryOptions = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "UK" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "Australia", value: "AU" },
  { label: "Japan", value: "JP" },
  { label: "China", value: "CN" },
  { label: "India", value: "IN" },
  { label: "Brazil", value: "BR" },
];

// Computed properties
const company = computed(() => {
  return companiesStore.getCompanyById(companyId);
});

const parentCompanyOptions = computed(() => {
  return companiesStore.companies
    .filter((comp) => comp.id !== companyId && !comp.parentId) // Exclude current company and companies with parents
    .map((comp) => ({
      id: comp.id,
      name: comp.name,
    }));
});

// Methods
const loadCompany = async () => {
  loading.value = true;
  error.value = "";

  try {
    await companiesStore.fetchCompanies();

    const companyData = company.value;
    if (!companyData) {
      error.value = "Company not found";
      return;
    }

    // Populate form data
    Object.assign(formData, {
      name: companyData.name || "",
      code: companyData.code || "",
      email: companyData.email || "",
      phone: companyData.phone || "",
      website: companyData.website || "",
      industry: companyData.industry || null,
      size: companyData.size || null,
      status: companyData.status || null,
      parentId: companyData.parentId || null,
      foundedYear: companyData.foundedYear || null,
      annualRevenue: companyData.annualRevenue || null,
      employeeCount: companyData.employeeCount || null,
      description: companyData.description || "",
      address: {
        street: companyData.address?.street || "",
        city: companyData.address?.city || "",
        state: companyData.address?.state || "",
        zipCode: companyData.address?.zipCode || "",
        country: companyData.address?.country || null,
      },
      socialMedia: {
        linkedin: companyData.socialMedia?.linkedin || "",
        twitter: companyData.socialMedia?.twitter || "",
        facebook: companyData.socialMedia?.facebook || "",
        instagram: companyData.socialMedia?.instagram || "",
      },
    });
  } catch (err) {
    error.value = "Failed to load company data";
    console.error("Error loading company:", err);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    if (typeof errors[key] === "object") {
      Object.keys(errors[key]).forEach((subKey) => {
        errors[key][subKey] = "";
      });
    } else {
      errors[key] = "";
    }
  });

  // Required field validation
  if (!formData.name.trim()) {
    errors.name = "Company name is required";
    isValid = false;
  }

  if (!formData.code.trim()) {
    errors.code = "Company code is required";
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  }

  if (!formData.industry) {
    errors.industry = "Industry is required";
    isValid = false;
  }

  if (!formData.size) {
    errors.size = "Company size is required";
    isValid = false;
  }

  if (!formData.status) {
    errors.status = "Status is required";
    isValid = false;
  }

  // Address validation
  if (!formData.address.street.trim()) {
    errors.address.street = "Street address is required";
    isValid = false;
  }

  if (!formData.address.city.trim()) {
    errors.address.city = "City is required";
    isValid = false;
  }

  if (!formData.address.state.trim()) {
    errors.address.state = "State is required";
    isValid = false;
  }

  if (!formData.address.zipCode.trim()) {
    errors.address.zipCode = "ZIP code is required";
    isValid = false;
  }

  if (!formData.address.country) {
    errors.address.country = "Country is required";
    isValid = false;
  }

  // Optional field validation
  if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
    errors.website = "Please enter a valid website URL";
    isValid = false;
  }

  if (
    formData.foundedYear &&
    (formData.foundedYear < 1800 ||
      formData.foundedYear > new Date().getFullYear())
  ) {
    errors.foundedYear = "Please enter a valid founded year";
    isValid = false;
  }

  if (formData.employeeCount && formData.employeeCount < 1) {
    errors.employeeCount = "Employee count must be at least 1";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    formError.value = "Please fix the errors above before submitting.";
    return;
  }

  saving.value = true;
  formError.value = "";

  try {
    const companyData = {
      ...formData,
      id: companyId,
      updatedAt: new Date().toISOString(),
    };

    await companiesStore.updateCompany(companyId, companyData);

    successMessage.value = "Company updated successfully!";

    // Redirect after successful update
    setTimeout(() => {
      router.push(`/companies/${companyId}`);
    }, 2000);
  } catch (error) {
    formError.value = "Failed to update company. Please try again.";
    console.error("Error updating company:", error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${company.value?.name}? This action cannot be undone and will delete all associated employees and departments.`,
    header: "Delete Company",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: () => deleteCompany(),
    reject: () => {
      // User rejected the deletion
    },
  });
};

const deleteCompany = async () => {
  try {
    await companiesStore.deleteCompany(companyId);
    successMessage.value = "Company deleted successfully!";

    setTimeout(() => {
      router.push("/companies");
    }, 2000);
  } catch (error) {
    formError.value = "Failed to delete company. Please try again.";
    console.error("Error deleting company:", error);
  }
};

// Load data on mount
onMounted(() => {
  loadCompany();
});
</script>

<style scoped>
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

/* Danger zone styling */
:deep(.p-card.border-red-200) {
  border-color: rgb(252 165 165);
  background: linear-gradient(
    135deg,
    rgb(254 242 242) 0%,
    rgb(254 226 226) 100%
  );
}

/* Responsive design */
@media (max-width: 768px) {
  :deep(.p-card-content) {
    padding: 1rem;
  }
}
</style>
