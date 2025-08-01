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
          <router-link
            :to="`/employees/${employeeId}`"
            class="hover:text-blue-600 transition-colors"
          >
            {{ employee?.firstName }} {{ employee?.lastName }}
          </router-link>
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-gray-900 font-medium">Edit</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Edit Employee</h1>
        <p class="mt-1 text-sm text-gray-600">
          Update employee information and details
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

    <!-- Edit Form -->
    <div v-else-if="employee" class="space-y-6">
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

      <!-- Employee Form -->
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
                icon="pi pi-user"
                :error="errors.firstName"
                required
              />

              <BaseInput
                v-model="formData.lastName"
                label="Last Name"
                placeholder="Enter last name"
                icon="pi pi-user"
                :error="errors.lastName"
                required
              />

              <BaseInput
                v-model="formData.email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                icon="pi pi-envelope"
                :error="errors.email"
                required
              />

              <BaseInput
                v-model="formData.phone"
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                icon="pi pi-phone"
                :error="errors.phone"
                required
              />

              <BaseCalendar
                v-model="formData.dateOfBirth"
                label="Date of Birth"
                :show-icon="true"
                date-format="mm/dd/yy"
                placeholder="Select date of birth"
                :error="errors.dateOfBirth"
                required
              />

              <BaseCalendar
                v-model="formData.hireDate"
                label="Hire Date"
                :show-icon="true"
                date-format="mm/dd/yy"
                placeholder="Select hire date"
                :error="errors.hireDate"
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
                icon="pi pi-id-card"
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
                required
              />

              <BaseDropdown
                v-model="formData.department"
                label="Department"
                :options="departmentOptions"
                placeholder="Select department"
                :error="errors.department"
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
                icon="pi pi-dollar"
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
                icon="pi pi-map-marker"
                :error="errors.address?.street"
                required
              />

              <BaseInput
                v-model="formData.address.city"
                label="City"
                placeholder="Enter city"
                icon="pi pi-map-marker"
                :error="errors.address?.city"
                required
              />

              <BaseInput
                v-model="formData.address.state"
                label="State/Province"
                placeholder="Enter state or province"
                icon="pi pi-map-marker"
                :error="errors.address?.state"
                required
              />

              <BaseInput
                v-model="formData.address.zipCode"
                label="ZIP/Postal Code"
                placeholder="Enter ZIP or postal code"
                icon="pi pi-map-marker"
                :error="errors.address?.zipCode"
                required
              />

              <BaseInput
                v-model="formData.address.country"
                label="Country"
                placeholder="Enter country"
                icon="pi pi-globe"
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

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BaseInput
                v-model="formData.emergencyContact.name"
                label="Contact Name"
                placeholder="Enter emergency contact name"
                icon="pi pi-user"
                :error="errors.emergencyContact?.name"
                required
              />

              <BaseInput
                v-model="formData.emergencyContact.relationship"
                label="Relationship"
                placeholder="e.g., Spouse, Parent"
                icon="pi pi-heart"
                :error="errors.emergencyContact?.relationship"
                required
              />

              <BaseInput
                v-model="formData.emergencyContact.phone"
                label="Contact Phone"
                type="tel"
                placeholder="Enter emergency contact phone"
                icon="pi pi-phone"
                :error="errors.emergencyContact?.phone"
                required
              />
            </div>
          </div>

          <!-- Skills and Certifications -->
          <div class="space-y-6 mt-8">
            <h3
              class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2"
            >
              <i class="pi pi-star text-purple-600 mr-2"></i>
              Skills and Certifications
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Skills</label>
                <div class="flex flex-wrap gap-2">
                  <Tag
                    v-for="skill in formData.skills"
                    :key="skill"
                    :value="skill"
                    severity="info"
                    class="cursor-pointer"
                    @click="removeSkill(skill)"
                  />
                </div>
                <div class="flex space-x-2">
                  <BaseInput
                    v-model="newSkill"
                    placeholder="Add a skill"
                    size="small"
                    @keyup.enter="addSkill"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    size="small"
                    @click="addSkill"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700"
                  >Certifications</label
                >
                <div class="flex flex-wrap gap-2">
                  <Tag
                    v-for="cert in formData.certifications"
                    :key="cert"
                    :value="cert"
                    severity="success"
                    class="cursor-pointer"
                    @click="removeCertification(cert)"
                  />
                </div>
                <div class="flex space-x-2">
                  <BaseInput
                    v-model="newCertification"
                    placeholder="Add a certification"
                    size="small"
                    @keyup.enter="addCertification"
                  />
                  <BaseButton
                    label="Add"
                    icon="pi pi-plus"
                    size="small"
                    @click="addCertification"
                  />
                </div>
              </div>
            </div>
          </div>
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
            <!-- Performance Rating -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Performance Rating</label
              >
              <div class="flex items-center space-x-2">
                <span class="text-lg font-semibold text-gray-900"
                  >{{ employee.performanceRating }}/5</span
                >
                <div class="flex items-center">
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
              <p class="text-xs text-gray-500">
                Last review: {{ formatDate(employee.lastReviewDate) }}
              </p>
            </div>

            <!-- Employee ID -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700"
                >Employee ID</label
              >
              <div class="text-lg font-semibold text-gray-900">
                {{ employee.id }}
              </div>
              <p class="text-xs text-gray-500">Unique identifier</p>
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
                <h4 class="font-semibold text-red-800">Delete Employee</h4>
                <p class="text-red-600 text-sm mt-1">
                  Permanently delete this employee and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <BaseButton
                label="Delete Employee"
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
        Employee Not Found
      </h3>
      <p class="text-gray-600 mb-6">
        The employee you're trying to edit doesn't exist or has been removed.
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useEmployeesStore } from '@/stores/employees';
import { useCompaniesStore } from '@/stores/companies';
import { useDepartmentsStore } from '@/stores/departments';
import { BaseForm, BaseInput, BaseCalendar, BaseDropdown, BaseButton } from '@/components/ui';
import Card from 'primevue/card';
import Message from 'primevue/message';
import Tag from 'primevue/tag';

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const employeesStore = useEmployeesStore();
const companiesStore = useCompaniesStore();
const departmentsStore = useDepartmentsStore();

const employeeId = computed(() => route.params.id as string);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref('');
const formError = ref('');
const employee = ref<any>(null);
const newSkill = ref('');
const newCertification = ref('');

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: null as Date | null,
  hireDate: null as Date | null,
  position: '',
  companyId: '',
  department: '',
  managerId: null as string | null,
  salary: 0,
  status: 'active',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  skills: [] as string[],
  certifications: [] as string[]
});

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  hireDate: '',
  position: '',
  companyId: '',
  department: '',
  managerId: '',
  salary: '',
  status: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  }
});

// Computed properties
const companyOptions = computed(() => {
  return companiesStore.companies.map(company => ({
    id: company.id,
    name: company.name
  }));
});

const departmentOptions = computed(() => {
  if (!formData.companyId) return [];
  const companyDepartments = departmentsStore.departments.filter(
    dept => dept.companyId === formData.companyId
  );
  return companyDepartments.map(dept => dept.name);
});

const managerOptions = computed(() => {
  if (!formData.companyId) return [];
  const companyEmployees = employeesStore.employees.filter(
    emp => emp.companyId === formData.companyId && emp.id !== employeeId.value
  );
  return companyEmployees.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`
  }));
});

const statusOptions = computed(() => [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
  { label: 'Terminated', value: 'terminated' }
]);

// Methods
const fetchEmployeeDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundEmployee = employeesStore.getEmployeeById(employeeId.value);
    if (foundEmployee) {
      employee.value = foundEmployee;
      populateForm(foundEmployee);
    } else {
      error.value = 'Employee not found';
    }
  } catch (err) {
    error.value = 'Failed to load employee details';
    console.error('Error fetching employee:', err);
  } finally {
    loading.value = false;
  }
};

const populateForm = (employeeData: any) => {
  formData.firstName = employeeData.firstName;
  formData.lastName = employeeData.lastName;
  formData.email = employeeData.email;
  formData.phone = employeeData.phone;
  formData.dateOfBirth = new Date(employeeData.dateOfBirth);
  formData.hireDate = new Date(employeeData.hireDate);
  formData.position = employeeData.position;
  formData.companyId = employeeData.companyId;
  formData.department = employeeData.department;
  formData.managerId = employeeData.managerId;
  formData.salary = employeeData.salary;
  formData.status = employeeData.status;
  formData.address = { ...employeeData.address };
  formData.emergencyContact = { ...employeeData.emergencyContact };
  formData.skills = [...employeeData.skills];
  formData.certifications = [...employeeData.certifications];
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    if (typeof errors[key as keyof typeof errors] === 'object') {
      Object.keys(errors[key as keyof typeof errors]).forEach(subKey => {
        errors[key as keyof typeof errors][subKey as keyof typeof errors[key as keyof typeof errors]] = '';
      });
    } else {
      errors[key as keyof typeof errors] = '';
    }
  });

  let isValid = true;

  // Personal information validation
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
    isValid = false;
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
    isValid = false;
  }

  if (!formData.hireDate) {
    errors.hireDate = 'Hire date is required';
    isValid = false;
  }

  // Work information validation
  if (!formData.position.trim()) {
    errors.position = 'Position is required';
    isValid = false;
  }

  if (!formData.companyId) {
    errors.companyId = 'Company is required';
    isValid = false;
  }

  if (!formData.department) {
    errors.department = 'Department is required';
    isValid = false;
  }

  if (formData.salary <= 0) {
    errors.salary = 'Salary must be greater than 0';
    isValid = false;
  }

  // Address validation
  if (!formData.address.street.trim()) {
    errors.address.street = 'Street address is required';
    isValid = false;
  }

  if (!formData.address.city.trim()) {
    errors.address.city = 'City is required';
    isValid = false;
  }

  if (!formData.address.state.trim()) {
    errors.address.state = 'State is required';
    isValid = false;
  }

  if (!formData.address.zipCode.trim()) {
    errors.address.zipCode = 'ZIP code is required';
    isValid = false;
  }

  // Emergency contact validation
  if (!formData.emergencyContact.name.trim()) {
    errors.emergencyContact.name = 'Emergency contact name is required';
    isValid = false;
  }

  if (!formData.emergencyContact.relationship.trim()) {
    errors.emergencyContact.relationship = 'Relationship is required';
    isValid = false;
  }

  if (!formData.emergencyContact.phone.trim()) {
    errors.emergencyContact.phone = 'Emergency contact phone is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    formError.value = 'Please fix the errors above before submitting';
    return;
  }

  saving.value = true;
  formError.value = '';

  try {
    const employeeData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0] || '',
      hireDate: formData.hireDate?.toISOString().split('T')[0] || ''
    };

    await employeesStore.updateEmployee(employeeId.value, employeeData);
    successMessage.value = 'Employee updated successfully!';

    // Redirect after a short delay
    setTimeout(() => {
      router.push(`/employees/${employeeId.value}`);
    }, 1500);
  } catch (err) {
    formError.value = 'Failed to update employee. Please try again.';
    console.error('Error updating employee:', err);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (employee.value) {
    populateForm(employee.value);
  }
  Object.keys(errors).forEach(key => {
    if (typeof errors[key as keyof typeof errors] === 'object') {
      Object.keys(errors[key as keyof typeof errors]).forEach(subKey => {
        errors[key as keyof typeof errors][subKey as keyof typeof errors[key as keyof typeof errors]] = '';
      });
    } else {
      errors[key as keyof typeof errors] = '';
    }
  });
  formError.value = '';
  successMessage.value = '';
};

const confirmDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${employee.value?.firstName} ${employee.value?.lastName}? This action cannot be undone and will permanently remove all associated data.`,
    header: 'Delete Employee Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => handleDelete(),
    reject: () => {
      // Rejection handled
    }
  });
};

const handleDelete = async () => {
  try {
    await employeesStore.deleteEmployee(employeeId.value);
    router.push('/employees');
  } catch (err) {
    formError.value = 'Failed to delete employee. Please try again.';
    console.error('Error deleting employee:', err);
  }
};

const addSkill = () => {
  if (newSkill.value.trim() && !formData.skills.includes(newSkill.value.trim())) {
    formData.skills.push(newSkill.value.trim());
    newSkill.value = '';
  }
};

const removeSkill = (skill: string) => {
  const index = formData.skills.indexOf(skill);
  if (index > -1) {
    formData.skills.splice(index, 1);
  }
};

const addCertification = () => {
  if (newCertification.value.trim() && !formData.certifications.includes(newCertification.value.trim())) {
    formData.certifications.push(newCertification.value.trim());
    newCertification.value = '';
  }
};

const removeCertification = (certification: string) => {
  const index = formData.certifications.indexOf(certification);
  if (index > -1) {
    formData.certifications.splice(index, 1);
  }
};

const getPerformanceColor = (rating: number) => {
  if (rating >= 4.5) return 'bg-green-500';
  if (rating >= 4.0) return 'bg-blue-500';
  if (rating >= 3.5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  await Promise.all([
    employeesStore.fetchEmployees(),
    companiesStore.fetchCompanies(),
    departmentsStore.fetchDepartments()
  ]);
  fetchEmployeeDetails();
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
