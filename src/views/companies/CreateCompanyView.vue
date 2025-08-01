<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Company</h1>
        <p class="text-gray-600">Add a new company to your organization.</p>
      </div>
      <BaseButton
        label="Back to Companies"
        icon="pi pi-arrow-left"
        variant="secondary"
        size="medium"
        padding="normal"
        @click="$router.push('/companies')"
      />
    </div>

    <!-- Form -->
    <Card class="max-w-2xl">
      <template #content>
        <BaseForm
          :loading="companiesStore.loading"
          submit-text="Create Company"
          submit-variant="primary"
          layout="grid"
          :grid-cols="2"
          @submit="handleSubmit"
          @cancel="$router.push('/companies')"
        >
          <BaseInput
            v-model="form.name"
            label="Company Name"
            placeholder="Enter company name"
            :error="
              v$.form.name.$error ? v$.form.name.$errors[0].$message : undefined
            "
            :disabled="companiesStore.loading"
            required
            icon="pi pi-building"
          />

          <BaseInput
            v-model="form.code"
            label="Company Code"
            placeholder="Enter company code"
            :error="
              v$.form.code.$error ? v$.form.code.$errors[0].$message : undefined
            "
            :disabled="companiesStore.loading"
            required
            icon="pi pi-tag"
          />

          <BaseInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            :error="
              v$.form.email.$error
                ? v$.form.email.$errors[0].$message
                : undefined
            "
            :disabled="companiesStore.loading"
            required
            icon="pi pi-envelope"
          />

          <BaseInput
            v-model="form.phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            :error="
              v$.form.phone.$error
                ? v$.form.phone.$errors[0].$message
                : undefined
            "
            :disabled="companiesStore.loading"
            required
            icon="pi pi-phone"
          />

          <BaseInput
            v-model="form.website"
            label="Website"
            type="url"
            placeholder="Enter website URL"
            :disabled="companiesStore.loading"
            icon="pi pi-globe"
            hint="e.g., https://example.com"
          />

          <BaseDropdown
            v-model="form.parentId"
            :options="availableParentCompanies"
            label="Parent Company"
            placeholder="Select parent company (optional)"
            option-label="name"
            option-value="id"
            :disabled="companiesStore.loading"
            :show-clear="true"
            filter
            filter-placeholder="Search companies..."
          />

          <BaseTextarea
            v-model="form.address"
            label="Address"
            placeholder="Enter company address"
            :error="
              v$.form.address.$error
                ? v$.form.address.$errors[0].$message
                : undefined
            "
            :disabled="companiesStore.loading"
            required
            :rows="4"
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompaniesStore } from "@/stores/companies";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
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
const successMessage = ref("");

const form = reactive({
  name: "",
  code: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  parentId: "",
});

const rules = {
  form: {
    name: { required, minLength: minLength(2) },
    code: { required, minLength: minLength(2) },
    email: { required, email },
    phone: { required, minLength: minLength(10) },
    address: { required, minLength: minLength(10) },
  },
};

const v$ = useVuelidate(rules, { form });

const availableParentCompanies = computed(() => {
  return companiesStore.companies.filter((company) => !company.parentId);
});

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await companiesStore.createCompany(form);
    successMessage.value = "Company created successfully!";

    // Reset form
    Object.assign(form, {
      name: "",
      code: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      parentId: "",
    });

    v$.value.$reset();

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/companies");
    }, 2000);
  } catch (error) {
    console.error("Create company failed:", error);
  }
};

onMounted(async () => {
  await companiesStore.fetchCompanies();
});
</script>
