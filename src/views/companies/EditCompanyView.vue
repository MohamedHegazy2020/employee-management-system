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
          <router-link
            :to="`/companies/${companyId}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ company?.name || "Loading..." }}
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">Edit</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Edit Company</h1>
        <p class="mt-1 text-sm text-gray-600">
          Update company information and details
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

    <!-- Edit Form -->
    <div v-else-if="company" class="space-y-6">
      <!-- Success Message -->
      <Message
        v-if="successMessage"
        severity="success"
        :closable="true"
        @close="successMessage = ''"
      >
        {{ successMessage }}
      </Message>

      <!-- Error Message -->
      <Message
        v-if="formError"
        severity="error"
        :closable="true"
        @close="formError = ''"
      >
        {{ formError }}
      </Message>

      <!-- Company Information Form -->
      <BaseForm
        :loading="saving"
        :show-default-actions="false"
        title="Company Information"
        description="Update the basic information about the company"
      >
        <template #content>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Company Name -->
            <BaseInput
              v-model="formData.name"
              label="Company Name"
              placeholder="Enter company name"
              icon="pi pi-building"
              :error="errors.name"
              required
            />

            <!-- Company Code -->
            <BaseInput
              v-model="formData.code"
              label="Company Code"
              placeholder="Enter company code"
              icon="pi pi-tag"
              :error="errors.code"
              required
            />

            <!-- Email Address -->
            <BaseInput
              v-model="formData.email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              icon="pi pi-envelope"
              :error="errors.email"
              required
            />

            <!-- Phone Number -->
            <BaseInput
              v-model="formData.phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
              icon="pi pi-phone"
              :error="errors.phone"
              required
            />

            <!-- Website -->
            <BaseInput
              v-model="formData.website"
              label="Website"
              type="url"
              placeholder="Enter website URL"
              icon="pi pi-globe"
              :error="errors.website"
              hint="Optional - Include https://"
            />

            <!-- Parent Company -->
            <BaseDropdown
              v-model="formData.parentId"
              label="Parent Company"
              :options="parentCompanyOptions"
              option-label="name"
              option-value="id"
              placeholder="Select parent company"
              :error="errors.parentId"
              :show-clear="true"
              hint="Optional - Leave empty if this is a parent company"
            />
          </div>

          <!-- Address -->
          <BaseTextarea
            v-model="formData.address"
            label="Company Address"
            placeholder="Enter complete company address"
            :rows="3"
            icon="pi pi-map-marker"
            :error="errors.address"
            required
          />
        </template>

        <!-- Form Actions -->
        <template #actions>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <i class="pi pi-info-circle"></i>
              <span>All fields marked with * are required</span>
            </div>

            <div class="flex items-center space-x-3">
              <BaseButton
                label="Reset Form"
                icon="pi pi-refresh"
                variant="outline"
                @click="resetForm"
              />
              <BaseButton
                label="Save Changes"
                icon="pi pi-check"
                variant="primary"
                :loading="saving"
                @click="handleSubmit"
              />
            </div>
          </div>
        </template>
      </BaseForm>

      <!-- Additional Information -->
      <Card>
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-info-circle text-blue-600 mr-2"></i>
            <span>Additional Information</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Created Date -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Created Date</label
              >
              <div class="flex items-center space-x-2 text-gray-600">
                <i class="pi pi-calendar text-gray-400"></i>
                <span>{{ formatDate(company.createdAt) }}</span>
              </div>
            </div>

            <!-- Last Updated -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Last Updated</label
              >
              <div class="flex items-center space-x-2 text-gray-600">
                <i class="pi pi-clock text-gray-400"></i>
                <span>{{ formatDate(company.updatedAt) }}</span>
              </div>
            </div>

            <!-- Employee Count -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Total Employees</label
              >
              <div class="flex items-center space-x-2 text-gray-600">
                <i class="pi pi-users text-gray-400"></i>
                <span>{{ company.employeeCount }} employees</span>
              </div>
            </div>

            <!-- Department Count -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Departments</label
              >
              <div class="flex items-center space-x-2 text-gray-600">
                <i class="pi pi-sitemap text-gray-400"></i>
                <span>{{ company.departmentCount }} departments</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Danger Zone -->
      <Card class="border-red-200 bg-red-50">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
            <span class="text-red-800">Danger Zone</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-semibold text-red-800">Delete Company</h4>
                <p class="text-red-600 text-sm mt-1">
                  Permanently delete this company and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <BaseButton
                label="Delete Company"
                icon="pi pi-trash"
                variant="danger"
                @click="confirmDelete"
              />
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
        The company you're trying to edit doesn't exist or has been removed.
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
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useCompaniesStore } from "@/stores/companies";
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BaseDropdown,
  BaseButton,
} from "@/components/ui";
import Card from "primevue/card";
import Message from "primevue/message";

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const companiesStore = useCompaniesStore();

const companyId = computed(() => route.params.id as string);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref("");
const formError = ref("");
const company = ref<any>(null);

// Form data
const formData = reactive({
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  parentId: null as string | null,
});

// Form validation errors
const errors = reactive({
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  parentId: "",
});

// Computed properties
const parentCompanyOptions = computed(() => {
  return companiesStore.companies
    .filter((c) => c.id !== companyId.value)
    .map((c) => ({ id: c.id, name: c.name }));
});

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
      populateForm(foundCompany);
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

const populateForm = (companyData: any) => {
  formData.name = companyData.name;
  formData.code = companyData.code;
  formData.email = companyData.email;
  formData.phone = companyData.phone;
  formData.website = companyData.website || "";
  formData.address = companyData.address;
  formData.parentId = companyData.parentId || null;
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  let isValid = true;

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Company name is required";
    isValid = false;
  } else if (formData.name.length < 2) {
    errors.name = "Company name must be at least 2 characters";
    isValid = false;
  }

  // Code validation
  if (!formData.code.trim()) {
    errors.code = "Company code is required";
    isValid = false;
  } else if (formData.code.length < 3) {
    errors.code = "Company code must be at least 3 characters";
    isValid = false;
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email address is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  }

  // Address validation
  if (!formData.address.trim()) {
    errors.address = "Company address is required";
    isValid = false;
  }

  // Website validation (optional)
  if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
    errors.website =
      "Please enter a valid website URL (include http:// or https://)";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    formError.value = "Please fix the errors above before submitting";
    return;
  }

  saving.value = true;
  formError.value = "";

  try {
    await companiesStore.updateCompany(companyId.value, formData);
    successMessage.value = "Company updated successfully!";

    // Redirect after a short delay
    setTimeout(() => {
      router.push(`/companies/${companyId.value}`);
    }, 1500);
  } catch (err) {
    formError.value = "Failed to update company. Please try again.";
    console.error("Error updating company:", err);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (company.value) {
    populateForm(company.value);
  }
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
  formError.value = "";
  successMessage.value = "";
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${company.value?.name}? This action cannot be undone and will permanently remove all associated data.`,
    header: "Delete Company Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: () => handleDelete(),
    reject: () => {
      // Rejection handled
    },
  });
};

const handleDelete = async () => {
  try {
    await companiesStore.deleteCompany(companyId.value);
    router.push("/companies");
  } catch (err) {
    formError.value = "Failed to delete company. Please try again.";
    console.error("Error deleting company:", err);
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchCompanyDetails();
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
