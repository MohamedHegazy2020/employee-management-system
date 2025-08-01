<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Department</h1>
        <p class="text-gray-600">Add a new department to your organization.</p>
      </div>
      <BaseButton
        label="Back to Departments"
        icon="pi pi-arrow-left"
        variant="secondary"
        size="medium"
        padding="normal"
        @click="$router.push('/departments')"
      />
    </div>

    <!-- Form -->
    <Card class="max-w-2xl">
      <template #content>
        <BaseForm
          :loading="loading"
          submit-text="Create Department"
          submit-variant="primary"
          layout="grid"
          :grid-cols="2"
          @submit="handleSubmit"
          @cancel="$router.push('/departments')"
        >
          <BaseInput
            v-model="form.name"
            label="Department Name"
            placeholder="Enter department name"
            icon="pi pi-building"
            :error="errors.name"
            required
          />

          <BaseInput
            v-model="form.code"
            label="Department Code"
            placeholder="Enter department code"
            icon="pi pi-tag"
            :error="errors.code"
            required
          />

          <BaseDropdown
            v-model="form.companyId"
            :options="companies"
            label="Company"
            placeholder="Select company"
            option-label="name"
            option-value="id"
            :error="errors.companyId"
            filter
            filter-placeholder="Search companies..."
            required
          />

          <BaseDropdown
            v-model="form.managerId"
            :options="employees"
            label="Department Manager"
            placeholder="Select manager (optional)"
            option-label="name"
            option-value="id"
            :show-clear="true"
            filter
            filter-placeholder="Search employees..."
          />

          <BaseInput
            v-model="form.email"
            label="Department Email"
            type="email"
            placeholder="Enter department email"
            icon="pi pi-envelope"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="form.phone"
            label="Department Phone"
            type="tel"
            placeholder="Enter department phone"
            icon="pi pi-phone"
            :error="errors.phone"
            required
          />

          <BaseInput
            v-model="form.location"
            label="Location"
            placeholder="Enter department location"
            icon="pi pi-map-marker"
            :error="errors.location"
            required
          />

          <BaseInput
            v-model="form.budget"
            label="Annual Budget"
            type="number"
            placeholder="Enter annual budget"
            icon="pi pi-dollar"
            :error="errors.budget"
            required
          />

          <BaseTextarea
            v-model="form.description"
            label="Description"
            placeholder="Enter department description"
            :rows="4"
            class="md:col-span-2"
          />

          <BaseCheckbox
            v-model="form.isActive"
            label="Active Department"
            class="md:col-span-2"
          />
        </BaseForm>
      </template>
    </Card>

    <!-- Success Message -->
    <Message
      v-if="successMessage"
      severity="success"
      :closable="false"
      class="max-w-2xl"
    >
      {{ successMessage }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Card from "primevue/card";
import Message from "primevue/message";
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BaseDropdown,
  BaseCheckbox,
  BaseButton,
} from "@/components/ui";

const router = useRouter();
const loading = ref(false);
const successMessage = ref("");

// Mock data - replace with actual API calls
const companies = ref([
  { id: "1", name: "Tech Corp" },
  { id: "2", name: "Marketing Inc" },
  { id: "3", name: "Sales Solutions" },
]);

const employees = ref([
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Brown" },
]);

const form = reactive({
  name: "",
  code: "",
  companyId: "",
  managerId: "",
  email: "",
  phone: "",
  location: "",
  budget: "",
  description: "",
  isActive: true,
});

const errors = reactive({
  name: "",
  code: "",
  companyId: "",
  email: "",
  phone: "",
  location: "",
  budget: "",
});

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  if (!form.name.trim()) {
    errors.name = "Department name is required";
    isValid = false;
  }

  if (!form.code.trim()) {
    errors.code = "Department code is required";
    isValid = false;
  }

  if (!form.companyId) {
    errors.companyId = "Company is required";
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  }

  if (!form.location.trim()) {
    errors.location = "Location is required";
    isValid = false;
  }

  if (!form.budget.trim()) {
    errors.budget = "Budget is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    successMessage.value = "Department created successfully!";

    // Reset form
    Object.assign(form, {
      name: "",
      code: "",
      companyId: "",
      managerId: "",
      email: "",
      phone: "",
      location: "",
      budget: "",
      description: "",
      isActive: true,
    });

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/departments");
    }, 2000);
  } catch (error) {
    console.error("Create department failed:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Load companies and employees data
  // Replace with actual API calls
});
</script>
