<template>
  <div class="space-y-6">
    <!-- Header -->
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
          <router-link
            :to="`/employees/${employeeId}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ employee?.firstName }} {{ employee?.lastName }}
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">Edit Employee</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">
          Edit Employee: {{ employee?.firstName }} {{ employee?.lastName }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          Update employee information and details.
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
          @click="$router.push(`/employees/${employeeId}`)"
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
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading employee data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <i class="pi pi-exclamation-triangle text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Error Loading Employee</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <BaseButton
        label="Try Again"
        icon="pi pi-refresh"
        variant="primary"
        @click="loadEmployee"
      />
    </div>

    <!-- Employee Form -->
    <div v-else-if="employee">
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
        title="Employee Information"
        description="Update employee details and information"
      >
        <template #content>
          <!-- Personal Information -->
          <div class="space-y-6">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-user text-blue-600 mr-2"></i>
              Personal Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.firstName"
                label="First Name"
                placeholder="Enter first name"
                :error="errors.firstName"
                required
              />

              <BaseInput
                v-model="formData.lastName"
                label="Last Name"
                placeholder="Enter last name"
                :error="errors.lastName"
                required
              />

              <BaseInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                :error="errors.email"
                required
              />

              <BaseInput
                v-model="formData.phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                :error="errors.phone"
                required
              />

              <BaseCalendar
                v-model="formData.dateOfBirth"
                label="Date of Birth"
                placeholder="Select date of birth"
                :error="errors.dateOfBirth"
                required
              />

              <BaseDropdown
                v-model="formData.gender"
                label="Gender"
                :options="genderOptions"
                placeholder="Select gender"
                :error="errors.gender"
                required
              />
            </div>
          </div>

          <!-- Work Information -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-briefcase text-green-600 mr-2"></i>
              Work Information
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.position"
                label="Position/Title"
                placeholder="Enter job position"
                :error="errors.position"
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
                v-model="formData.departmentId"
                label="Department"
                :options="departmentOptions"
                option-label="name"
                option-value="id"
                placeholder="Select department"
                :error="errors.departmentId"
                :loading="departmentsStore.loading"
                required
              />

              <BaseDropdown
                v-model="formData.managerId"
                label="Manager"
                :options="managerOptions"
                option-label="name"
                option-value="id"
                placeholder="Select manager (optional)"
                :show-clear="true"
                :error="errors.managerId"
              />

              <BaseInput
                v-model.number="formData.salary"
                label="Annual Salary"
                type="number"
                placeholder="Enter annual salary"
                :error="errors.salary"
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

              <BaseCalendar
                v-model="formData.hireDate"
                label="Hire Date"
                placeholder="Select hire date"
                :error="errors.hireDate"
                required
              />

              <BaseDropdown
                v-model="formData.employmentType"
                label="Employment Type"
                :options="employmentTypeOptions"
                placeholder="Select employment type"
                :error="errors.employmentType"
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

          <!-- Emergency Contact -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-phone text-red-600 mr-2"></i>
              Emergency Contact
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="formData.emergencyContact.name"
                label="Emergency Contact Name"
                placeholder="Enter emergency contact name"
                :error="errors.emergencyContact?.name"
                required
              />

              <BaseInput
                v-model="formData.emergencyContact.phone"
                label="Emergency Contact Phone"
                type="tel"
                placeholder="Enter emergency contact phone"
                :error="errors.emergencyContact?.phone"
                required
              />

              <BaseInput
                v-model="formData.emergencyContact.relationship"
                label="Relationship"
                placeholder="Enter relationship (e.g., Spouse, Parent)"
                :error="errors.emergencyContact?.relationship"
                required
              />
            </div>
          </div>

          <!-- Skills and Certifications -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-star text-yellow-600 mr-2"></i>
              Skills and Certifications
            </h3>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Skills
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <Tag
                    v-for="skill in formData.skills"
                    :key="skill"
                    :value="skill"
                    severity="info"
                    class="cursor-pointer"
                    @click="removeSkill(skill)"
                  />
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newSkill"
                    placeholder="Add a skill"
                    class="flex-1"
                    @keyup.enter="addSkill"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    variant="info"
                    size="small"
                    padding="compact"
                    @click="addSkill"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Certifications
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <Tag
                    v-for="cert in formData.certifications"
                    :key="cert"
                    :value="cert"
                    severity="success"
                    class="cursor-pointer"
                    @click="removeCertification(cert)"
                  />
                </div>
                <div class="flex gap-2">
                  <BaseInput
                    v-model="newCertification"
                    placeholder="Add a certification"
                    class="flex-1"
                    @keyup.enter="addCertification"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    variant="success"
                    size="small"
                    padding="compact"
                    @click="addCertification"
                  />
                </div>
              </div>
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
              Once you delete an employee, there is no going back. Please be certain.
            </p>
            <BaseButton
              label="Delete Employee"
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
import { useEmployeesStore } from "@/stores/employees";
import { useCompaniesStore } from "@/stores/companies";
import { useDepartmentsStore } from "@/stores/departments";
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
  BaseButton,
} from "@/components/ui";

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();

const employeesStore = useEmployeesStore();
const companiesStore = useCompaniesStore();
const departmentsStore = useDepartmentsStore();

// Route params
const employeeId = route.params.id as string;

// Component state
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const successMessage = ref("");
const formError = ref("");

// Skills and certifications
const newSkill = ref("");
const newCertification = ref("");

// Form data
const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: null,
  gender: null,
  position: "",
  companyId: null,
  departmentId: null,
  managerId: null,
  salary: null,
  status: null,
  hireDate: null,
  employmentType: null,
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: null,
  },
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
  skills: [] as string[],
  certifications: [] as string[],
});

// Validation errors
const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  position: "",
  companyId: "",
  departmentId: "",
  managerId: "",
  salary: "",
  status: "",
  hireDate: "",
  employmentType: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  emergencyContact: {
    name: "",
    phone: "",
    relationship: "",
  },
});

// Options
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
  { label: "Prefer not to say", value: "Prefer not to say" },
];

const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "On Leave", value: "On Leave" },
  { label: "Terminated", value: "Terminated" },
];

const employmentTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
  { label: "Intern", value: "Intern" },
  { label: "Temporary", value: "Temporary" },
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
const employee = computed(() => {
  return employeesStore.getEmployeeById(employeeId);
});

const companyOptions = computed(() => {
  return companiesStore.companies.map(company => ({
    id: company.id,
    name: company.name,
  }));
});

const departmentOptions = computed(() => {
  if (!formData.companyId) return [];
  return departmentsStore.departments
    .filter(dept => dept.companyId === formData.companyId)
    .map(dept => ({
      id: dept.id,
      name: dept.name,
    }));
});

const managerOptions = computed(() => {
  if (!formData.companyId) return [];
  return employeesStore.employees
    .filter(emp => emp.companyId === formData.companyId && emp.id !== employeeId)
    .map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
    }));
});

// Methods
const loadEmployee = async () => {
  loading.value = true;
  error.value = "";

  try {
    await Promise.all([
      companiesStore.fetchCompanies(),
      departmentsStore.fetchDepartments(),
      employeesStore.fetchEmployees(),
    ]);

    const employeeData = employee.value;
    if (!employeeData) {
      error.value = "Employee not found";
      return;
    }

    // Populate form data
    Object.assign(formData, {
      firstName: employeeData.firstName || "",
      lastName: employeeData.lastName || "",
      email: employeeData.email || "",
      phone: employeeData.phone || "",
      dateOfBirth: employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : null,
      gender: employeeData.gender || null,
      position: employeeData.position || "",
      companyId: employeeData.companyId || null,
      departmentId: employeeData.departmentId || null,
      managerId: employeeData.managerId || null,
      salary: employeeData.salary || null,
      status: employeeData.status || null,
      hireDate: employeeData.hireDate ? new Date(employeeData.hireDate) : null,
      employmentType: employeeData.employmentType || null,
      address: {
        street: employeeData.address?.street || "",
        city: employeeData.address?.city || "",
        state: employeeData.address?.state || "",
        zipCode: employeeData.address?.zipCode || "",
        country: employeeData.address?.country || null,
      },
      emergencyContact: {
        name: employeeData.emergencyContact?.name || "",
        phone: employeeData.emergencyContact?.phone || "",
        relationship: employeeData.emergencyContact?.relationship || "",
      },
      skills: employeeData.skills || [],
      certifications: employeeData.certifications || [],
    });
  } catch (err) {
    error.value = "Failed to load employee data";
    console.error("Error loading employee:", err);
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    if (typeof errors[key] === 'object') {
      Object.keys(errors[key]).forEach(subKey => {
        errors[key][subKey] = "";
      });
    } else {
      errors[key] = "";
    }
  });

  // Required field validation
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
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

  if (!formData.position.trim()) {
    errors.position = "Position is required";
    isValid = false;
  }

  if (!formData.companyId) {
    errors.companyId = "Company is required";
    isValid = false;
  }

  if (!formData.departmentId) {
    errors.departmentId = "Department is required";
    isValid = false;
  }

  if (!formData.salary || formData.salary <= 0) {
    errors.salary = "Valid salary is required";
    isValid = false;
  }

  if (!formData.status) {
    errors.status = "Status is required";
    isValid = false;
  }

  if (!formData.hireDate) {
    errors.hireDate = "Hire date is required";
    isValid = false;
  }

  if (!formData.employmentType) {
    errors.employmentType = "Employment type is required";
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

  // Emergency contact validation
  if (!formData.emergencyContact.name.trim()) {
    errors.emergencyContact.name = "Emergency contact name is required";
    isValid = false;
  }

  if (!formData.emergencyContact.phone.trim()) {
    errors.emergencyContact.phone = "Emergency contact phone is required";
    isValid = false;
  }

  if (!formData.emergencyContact.relationship.trim()) {
    errors.emergencyContact.relationship = "Relationship is required";
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
    const employeeData = {
      ...formData,
      id: employeeId,
      name: `${formData.firstName} ${formData.lastName}`,
      department: departmentsStore.getDepartmentById(formData.departmentId)?.name || "",
      company: companiesStore.getCompanyById(formData.companyId)?.name || "",
    };

    await employeesStore.updateEmployee(employeeId, employeeData);
    
    successMessage.value = "Employee updated successfully!";
    
    // Redirect after successful update
    setTimeout(() => {
      router.push(`/employees/${employeeId}`);
    }, 2000);
  } catch (error) {
    formError.value = "Failed to update employee. Please try again.";
    console.error("Error updating employee:", error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${employee.value?.firstName} ${employee.value?.lastName}? This action cannot be undone.`,
    header: 'Delete Employee',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deleteEmployee(),
    reject: () => {
      // User rejected the deletion
    }
  });
};

const deleteEmployee = async () => {
  try {
    await employeesStore.deleteEmployee(employeeId);
    successMessage.value = "Employee deleted successfully!";
    
    setTimeout(() => {
      router.push('/employees');
    }, 2000);
  } catch (error) {
    formError.value = "Failed to delete employee. Please try again.";
    console.error("Error deleting employee:", error);
  }
};

const addSkill = () => {
  if (newSkill.value.trim() && !formData.skills.includes(newSkill.value.trim())) {
    formData.skills.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

const removeSkill = (skill: string) => {
  formData.skills = formData.skills.filter(s => s !== skill);
};

const addCertification = () => {
  if (newCertification.value.trim() && !formData.certifications.includes(newCertification.value.trim())) {
    formData.certifications.push(newCertification.value.trim());
    newCertification.value = "";
  }
};

const removeCertification = (certification: string) => {
  formData.certifications = formData.certifications.filter(c => c !== certification);
};

// Load data on mount
onMounted(() => {
  loadEmployee();
});
</script>

<style scoped>
:deep(.p-card) {
  border-radius: 0.75rem;
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s;
}

:deep(.p-card:hover) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.p-card-content) {
  padding: 1.5rem;
}

:deep(.p-card.border-red-200) {
  border-color: rgb(252 165 165);
  background: linear-gradient(
    135deg,
    rgb(254 242 242) 0%,
    rgb(254 226 226) 100%
  );
}
</style>
