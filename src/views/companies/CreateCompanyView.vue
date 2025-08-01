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
          <span class="text-gray-900 font-medium">Add New Company</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Add New Company</h1>
        <p class="mt-1 text-sm text-gray-600">
          Create a new company record with complete information.
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
          @click="$router.push('/companies')"
        />
        <BaseButton
          label="Save Company"
          icon="pi pi-check"
          variant="primary"
          size="medium"
          padding="normal"
          :loading="saving"
          @click="handleSubmit"
        />
      </div>
    </div>

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

    <!-- Company Form -->
    <BaseForm
      :loading="saving"
      :show-default-actions="false"
      title="Company Information"
      description="Complete company details and information"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompaniesStore } from "@/stores/companies";
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
const companiesStore = useCompaniesStore();

// Form state
const saving = ref(false);
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
const parentCompanyOptions = computed(() => {
  return companiesStore.companies
    .filter((company) => !company.parentId) // Only show companies without parents
    .map((company) => ({
      id: company.id,
      name: company.name,
    }));
});

// Methods
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
      // Set default values for required fields
      employeeCount: formData.employeeCount || 0,
      departmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await companiesStore.createCompany(companyData);

    successMessage.value = "Company created successfully!";

    // Reset form after successful creation
    setTimeout(() => {
      router.push("/companies");
    }, 2000);
  } catch (error) {
    formError.value = "Failed to create company. Please try again.";
    console.error("Error creating company:", error);
  } finally {
    saving.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  try {
    await companiesStore.fetchCompanies();
  } catch (error) {
    console.error("Error loading companies:", error);
    formError.value = "Failed to load required data. Please refresh the page.";
  }
});
</script>
