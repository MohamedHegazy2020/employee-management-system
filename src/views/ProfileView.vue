<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
      <p class="text-gray-600">Manage your account settings and preferences.</p>
    </div>

    <!-- Profile Information -->
    <Card class="max-w-2xl">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Account Information</h3>
      </template>

      <template #content>
        <div class="flex items-center space-x-6 mb-6">
          <div class="flex-shrink-0">
            <img
              :src="authStore.user?.avatar || '/default-avatar.png'"
              :alt="authStore.user?.name"
              class="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
          <div>
            <h4 class="text-lg font-medium text-gray-900">
              {{ authStore.user?.name }}
            </h4>
            <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
            <p class="text-sm text-gray-500 capitalize">
              {{ authStore.user?.role }}
            </p>
          </div>
        </div>

        <BaseForm
          :loading="loading"
          submit-text="Update Profile"
          submit-variant="primary"
          layout="grid"
          :grid-cols="2"
          @submit="handleUpdateProfile"
        >
          <BaseInput
            v-model="form.firstName"
            label="First Name"
            placeholder="Enter first name"
            icon="pi pi-user"
            :error="errors.firstName"
            required
          />

          <BaseInput
            v-model="form.lastName"
            label="Last Name"
            placeholder="Enter last name"
            icon="pi pi-user"
            :error="errors.lastName"
            required
          />

          <BaseInput
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            icon="pi pi-envelope"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="form.phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter phone number"
            icon="pi pi-phone"
            :error="errors.phone"
          />

          <BaseInput
            v-model="form.jobTitle"
            label="Job Title"
            placeholder="Enter job title"
            icon="pi pi-briefcase"
            :error="errors.jobTitle"
            class="md:col-span-2"
          />

          <BaseTextarea
            v-model="form.bio"
            label="Bio"
            placeholder="Tell us about yourself"
            :rows="3"
            class="md:col-span-2"
          />
        </BaseForm>
      </template>
    </Card>

    <!-- Change Password -->
    <Card class="max-w-2xl">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Change Password</h3>
      </template>

      <template #content>
        <BaseForm
          :loading="passwordLoading"
          submit-text="Change Password"
          submit-variant="warning"
          layout="vertical"
          @submit="handleChangePassword"
        >
          <BasePassword
            v-model="passwordForm.currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            icon="pi pi-lock"
            :error="passwordErrors.currentPassword"
            required
          />

          <BasePassword
            v-model="passwordForm.newPassword"
            label="New Password"
            placeholder="Enter new password"
            icon="pi pi-lock"
            :feedback="true"
            :toggle-mask="true"
            :error="passwordErrors.newPassword"
            required
          />

          <BasePassword
            v-model="passwordForm.confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm new password"
            icon="pi pi-lock"
            :feedback="false"
            :toggle-mask="true"
            :error="passwordErrors.confirmPassword"
            required
          />
        </BaseForm>
      </template>
    </Card>

    <!-- Preferences -->
    <Card class="max-w-2xl">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Preferences</h3>
      </template>

      <template #content>
        <div class="space-y-4">
          <BaseCheckbox
            v-model="preferences.emailNotifications"
            label="Email Notifications"
          />

          <BaseCheckbox
            v-model="preferences.smsNotifications"
            label="SMS Notifications"
          />

          <BaseCheckbox
            v-model="preferences.weeklyReports"
            label="Weekly Reports"
          />

          <BaseCheckbox v-model="preferences.darkMode" label="Dark Mode" />
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <BaseButton
            label="Save Preferences"
            variant="primary"
            size="medium"
            padding="normal"
            @click="handleSavePreferences"
          />
        </div>
      </template>
    </Card>

    <!-- Success Messages -->
    <Message
      v-if="successMessage"
      severity="success"
      :closable="false"
      class="max-w-2xl"
    >
      {{ successMessage }}
    </Message>

    <Message
      v-if="passwordSuccessMessage"
      severity="success"
      :closable="false"
      class="max-w-2xl"
    >
      {{ passwordSuccessMessage }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";
import Message from "primevue/message";
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BasePassword,
  BaseCheckbox,
  BaseButton,
} from "@/components/ui";

const authStore = useAuthStore();
const loading = ref(false);
const passwordLoading = ref(false);
const successMessage = ref("");
const passwordSuccessMessage = ref("");

// Profile form
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  bio: "",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
});

// Password form
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Preferences
const preferences = reactive({
  emailNotifications: true,
  smsNotifications: false,
  weeklyReports: true,
  darkMode: false,
});

const validateProfileForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  return isValid;
};

const validatePasswordForm = () => {
  // Reset errors
  Object.keys(passwordErrors).forEach((key) => {
    passwordErrors[key] = "";
  });

  let isValid = true;

  if (!passwordForm.currentPassword.trim()) {
    passwordErrors.currentPassword = "Current password is required";
    isValid = false;
  }

  if (!passwordForm.newPassword.trim()) {
    passwordErrors.newPassword = "New password is required";
    isValid = false;
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = "Password must be at least 8 characters";
    isValid = false;
  }

  if (!passwordForm.confirmPassword.trim()) {
    passwordErrors.confirmPassword = "Please confirm your new password";
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  return isValid;
};

const handleUpdateProfile = async () => {
  if (!validateProfileForm()) return;

  loading.value = true;

  try {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    successMessage.value = "Profile updated successfully!";

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Update profile failed:", error);
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  if (!validatePasswordForm()) return;

  passwordLoading.value = true;

  try {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    passwordSuccessMessage.value = "Password changed successfully!";

    // Reset password form
    Object.assign(passwordForm, {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccessMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Change password failed:", error);
  } finally {
    passwordLoading.value = false;
  }
};

const handleSavePreferences = async () => {
  try {
    // Mock API call - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 500));

    successMessage.value = "Preferences saved successfully!";

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Save preferences failed:", error);
  }
};

onMounted(() => {
  // Load user data into form
  if (authStore.user) {
    form.firstName = authStore.user.name?.split(" ")[0] || "";
    form.lastName = authStore.user.name?.split(" ").slice(1).join(" ") || "";
    form.email = authStore.user.email || "";
    form.phone = authStore.user.phone || "";
    form.jobTitle = authStore.user.jobTitle || "";
    form.bio = authStore.user.bio || "";
  }
});
</script>
