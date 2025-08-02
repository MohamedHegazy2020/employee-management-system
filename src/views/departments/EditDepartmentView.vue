<template>
  <div class="space-y-6">
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
          <router-link
            :to="`/departments/${departmentId}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ department?.name }}
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">Edit Department</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">
          Edit Department: {{ department?.name }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          Update department information and details.
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
          @click="$router.push(`/departments/${departmentId}`)"
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
        <p class="mt-4 text-gray-600">Loading department data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        Error Loading Department
      </h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <BaseButton
        label="Try Again"
        icon="pi pi-refresh"
        variant="primary"
        @click="loadDepartment"
      />
    </div>

    <!-- Department Form -->
    <div v-else-if="department">
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
        title="Department Information"
        description="Update department details and information"
      >
        <template #content>
          <!-- Basic Information -->
          <div class="space-y-6">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-sitemap text-blue-600 mr-2"></i>
              Basic Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.name"
                label="Department Name"
                placeholder="Enter department name"
                :error="errors.name"
                required
              />

              <BaseInput
                v-model="formData.code"
                label="Department Code"
                placeholder="Enter department code"
                :error="errors.code"
                required
              />

              <BaseDropdown
                v-model="formData.companyId"
                label="Company"
                :options="companyOptions"
                option-label="name"
                option-value="id"
                placeholder="Select company"
                :error="errors.companyId"
                :loading="companiesStore.loading"
                required
              />

              <BaseDropdown
                v-model="formData.managerId"
                label="Department Manager"
                :options="managerOptions"
                option-label="name"
                option-value="id"
                placeholder="Select manager (optional)"
                :show-clear="true"
                :error="errors.managerId"
                :loading="employeesStore.loading"
              />

              <BaseInput
                v-model="formData.email"
                label="Department Email"
                type="email"
                placeholder="Enter department email"
                :error="errors.email"
                required
              />

              <BaseInput
                v-model="formData.phone"
                label="Department Phone"
                type="tel"
                placeholder="Enter department phone"
                :error="errors.phone"
                required
              />
            </div>
          </div>

          <!-- Location and Budget -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-map-marker text-orange-600 mr-2"></i>
              Location and Budget
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.location"
                label="Location"
                placeholder="Enter department location"
                :error="errors.location"
                required
              />

              <BaseInput
                v-model.number="formData.budget"
                label="Annual Budget"
                type="number"
                placeholder="Enter annual budget"
                :error="errors.budget"
                required
              />

              <BaseInput
                v-model="formData.floor"
                label="Floor/Level"
                placeholder="Enter floor or level"
                :error="errors.floor"
              />

              <BaseInput
                v-model="formData.roomNumber"
                label="Room Number"
                placeholder="Enter room number"
                :error="errors.roomNumber"
              />
            </div>
          </div>

          <!-- Department Details -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-info-circle text-green-600 mr-2"></i>
              Department Details
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseDropdown
                v-model="formData.type"
                label="Department Type"
                :options="departmentTypeOptions"
                placeholder="Select department type"
                :error="errors.type"
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

              <BaseInput
                v-model.number="formData.maxEmployees"
                label="Maximum Employees"
                type="number"
                placeholder="Enter maximum employees"
                :error="errors.maxEmployees"
                :min="1"
              />

              <BaseCalendar
                v-model="formData.establishedDate"
                label="Established Date"
                placeholder="Select established date"
                :error="errors.establishedDate"
              />
            </div>

            <BaseTextarea
              v-model="formData.description"
              label="Department Description"
              placeholder="Enter department description"
              :rows="4"
              :error="errors.description"
              hint="Brief description of the department's purpose and responsibilities"
            />
          </div>

          <!-- Skills and Requirements -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-star text-yellow-600 mr-2"></i>
              Skills and Requirements
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Required Skills
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <Tag
                    v-for="skill in formData.requiredSkills"
                    :key="skill"
                    :value="skill"
                    severity="info"
                    class="cursor-pointer"
                    @click="removeRequiredSkill(skill)"
                  />
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newRequiredSkill"
                    placeholder="Add a required skill"
                    class="flex-1"
                    @keyup.enter="addRequiredSkill"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    variant="info"
                    size="small"
                    padding="compact"
                    @click="addRequiredSkill"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Certifications
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <Tag
                    v-for="cert in formData.preferredCertifications"
                    :key="cert"
                    :value="cert"
                    severity="success"
                    class="cursor-pointer"
                    @click="removePreferredCertification(cert)"
                  />
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newPreferredCertification"
                    placeholder="Add a preferred certification"
                    class="flex-1"
                    @keyup.enter="addPreferredCertification"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    variant="success"
                    size="small"
                    padding="compact"
                    @click="addPreferredCertification"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Settings -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-cog text-purple-600 mr-2"></i>
              Additional Settings
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseCheckbox
                v-model="formData.isActive"
                label="Active Department"
                :error="errors.isActive"
              />

              <BaseCheckbox
                v-model="formData.allowRemoteWork"
                label="Allow Remote Work"
                :error="errors.allowRemoteWork"
              />

              <BaseCheckbox
                v-model="formData.hasBudget"
                label="Has Budget Management"
                :error="errors.hasBudget"
              />

              <BaseCheckbox
                v-model="formData.requiresApproval"
                label="Requires Approval for Hiring"
                :error="errors.requiresApproval"
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
              Once you delete a department, there is no going back. This will
              also affect all associated employees.
            </p>
            <BaseButton
              label="Delete Department"
              icon="pi pi-trash"
              variant="error"
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
import { useDepartmentsStore } from "@/stores/departments";
import { useCompaniesStore } from "@/stores/companies";
import { useEmployeesStore } from "@/stores/employees";
import { useConfirm } from "primevue/useconfirm";
import Card from "primevue/card";
import Message from "primevue/message";
import Tag from "primevue/tag";
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BaseDropdown,
  BaseCalendar,
  BaseCheckbox,
  BaseButton,
} from "@/components/ui";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();

const departmentsStore = useDepartmentsStore();
const companiesStore = useCompaniesStore();
const employeesStore = useEmployeesStore();

// Route params
const departmentId = route.params.id as string;

// Component state
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");
const formError = ref("");

// Skills and certifications
const newRequiredSkill = ref("");
const newPreferredCertification = ref("");

// Form data
const formData = reactive({
  name: "",
  code: "",
  companyId: null,
  managerId: null,
  email: "",
  phone: "",
  location: "",
  budget: null,
  floor: "",
  roomNumber: "",
  type: null,
  status: null,
  maxEmployees: null,
  establishedDate: null,
  description: "",
  requiredSkills: [] as string[],
  preferredCertifications: [] as string[],
  isActive: true,
  allowRemoteWork: false,
  hasBudget: true,
  requiresApproval: false,
});

// Validation errors
const errors = reactive({
  name: "",
  code: "",
  companyId: "",
  managerId: "",
  email: "",
  phone: "",
  location: "",
  budget: "",
  floor: "",
  roomNumber: "",
  type: "",
  status: "",
  maxEmployees: "",
  establishedDate: "",
  description: "",
  isActive: "",
  allowRemoteWork: "",
  hasBudget: "",
  requiresApproval: "",
});

// Options
const departmentTypeOptions = [
  { label: "Administration", value: "Administration" },
  { label: "Engineering", value: "Engineering" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Finance", value: "Finance" },
  { label: "Operations", value: "Operations" },
  { label: "Research & Development", value: "Research & Development" },
  { label: "Customer Support", value: "Customer Support" },
  { label: "Legal", value: "Legal" },
  { label: "IT", value: "IT" },
  { label: "Other", value: "Other" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Planning", value: "Planning" },
  { label: "Suspended", value: "Suspended" },
];

// Computed properties
const department = computed(() => {
  return departmentsStore.getDepartmentById(departmentId);
});

const companyOptions = computed(() => {
  return companiesStore.companies.map((company) => ({
    id: company.id,
    name: company.name,
  }));
});

const managerOptions = computed(() => {
  if (!formData.companyId) return [];
  return employeesStore.employees
    .filter((emp) => emp.companyId === formData.companyId)
    .map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
    }));
});

// Methods
const loadDepartment = async () => {
  loading.value = true;
  error.value = "";

  try {
    await Promise.all([
      companiesStore.fetchCompanies(),
      employeesStore.fetchEmployees(),
      departmentsStore.fetchDepartments(),
    ]);

    const departmentData = department.value;
    if (!departmentData) {
      error.value = "Department not found";
      return;
    }

    // Populate form data
    Object.assign(formData, {
      name: departmentData.name || "",
      code: departmentData.code || "",
      companyId: departmentData.companyId || null,
      managerId: departmentData.managerId || null,
      email: departmentData.email || "",
      phone: departmentData.phone || "",
      location: departmentData.location || "",
      budget: departmentData.budget || null,
      floor: departmentData.floor || "",
      roomNumber: departmentData.roomNumber || "",
      type: departmentData.type || null,
      status: departmentData.status || null,
      maxEmployees: departmentData.maxEmployees || null,
      establishedDate: departmentData.establishedDate
        ? new Date(departmentData.establishedDate)
        : null,
      description: departmentData.description || "",
      requiredSkills: departmentData.requiredSkills || [],
      preferredCertifications: departmentData.preferredCertifications || [],
      isActive:
        departmentData.isActive !== undefined ? departmentData.isActive : true,
      allowRemoteWork: departmentData.allowRemoteWork || false,
      hasBudget:
        departmentData.hasBudget !== undefined
          ? departmentData.hasBudget
          : true,
      requiresApproval: departmentData.requiresApproval || false,
    });
  } catch (err) {
    error.value = "Failed to load department data";
    console.error("Error loading department:", err);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  // Required field validation
  if (!formData.name.trim()) {
    errors.name = "Department name is required";
    isValid = false;
  }

  if (!formData.code.trim()) {
    errors.code = "Department code is required";
    isValid = false;
  }

  if (!formData.companyId) {
    errors.companyId = "Company is required";
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

  if (!formData.location.trim()) {
    errors.location = "Location is required";
    isValid = false;
  }

  if (!formData.budget || formData.budget <= 0) {
    errors.budget = "Valid budget is required";
    isValid = false;
  }

  if (!formData.type) {
    errors.type = "Department type is required";
    isValid = false;
  }

  if (!formData.status) {
    errors.status = "Status is required";
    isValid = false;
  }

  // Optional field validation
  if (formData.maxEmployees && formData.maxEmployees < 1) {
    errors.maxEmployees = "Maximum employees must be at least 1";
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
    const departmentData = {
      ...formData,
      id: departmentId,
      company: companiesStore.getCompanyById(formData.companyId)?.name || "",
      manager: formData.managerId
        ? employeesStore.getEmployeeById(formData.managerId)?.name || ""
        : "",
      updatedAt: new Date().toISOString(),
    };

    await departmentsStore.updateDepartment(departmentId, departmentData);

    successMessage.value = "Department updated successfully!";

    // Redirect after successful update
    setTimeout(() => {
      router.push(`/departments/${departmentId}`);
    }, 2000);
  } catch (error) {
    formError.value = "Failed to update department. Please try again.";
    console.error("Error updating department:", error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${department.value?.name}? This action cannot be undone and will affect all associated employees.`,
    header: "Delete Department",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: () => deleteDepartment(),
    reject: () => {
      // User rejected the deletion
    },
  });
};

const deleteDepartment = async () => {
  try {
    await departmentsStore.deleteDepartment(departmentId);
    successMessage.value = "Department deleted successfully!";

    setTimeout(() => {
      router.push("/departments");
    }, 2000);
  } catch (error) {
    formError.value = "Failed to delete department. Please try again.";
    console.error("Error deleting department:", error);
  }
};

const addRequiredSkill = () => {
  if (
    newRequiredSkill.value.trim() &&
    !formData.requiredSkills.includes(newRequiredSkill.value.trim())
  ) {
    formData.requiredSkills.push(newRequiredSkill.value.trim());
    newRequiredSkill.value = "";
  }
};

const removeRequiredSkill = (skill: string) => {
  formData.requiredSkills = formData.requiredSkills.filter((s) => s !== skill);
};

const addPreferredCertification = () => {
  if (
    newPreferredCertification.value.trim() &&
    !formData.preferredCertifications.includes(
      newPreferredCertification.value.trim()
    )
  ) {
    formData.preferredCertifications.push(
      newPreferredCertification.value.trim()
    );
    newPreferredCertification.value = "";
  }
};

const removePreferredCertification = (certification: string) => {
  formData.preferredCertifications = formData.preferredCertifications.filter(
    (c) => c !== certification
  );
};

// Load data on mount
onMounted(() => {
  loadDepartment();
});
</script>
