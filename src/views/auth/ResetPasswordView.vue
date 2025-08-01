<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <Card class="shadow-xl">
        <template #header>
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Set new password
            </h2>
            <p class="text-gray-600">Enter your new password below.</p>
          </div>
        </template>

        <template #content>
          <BaseForm
            :loading="authStore.loading"
            submit-text="Reset password"
            :show-cancel="false"
            layout="vertical"
            @submit="handleResetPassword"
          >
            <BasePassword
              v-model="form.password"
              label="New Password"
              placeholder="Enter new password"
              icon="pi pi-lock"
              :feedback="true"
              :toggle-mask="true"
              :error="authStore.error"
              :disabled="authStore.loading"
              required
            />

            <BasePassword
              v-model="form.confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              icon="pi pi-lock"
              :feedback="false"
              :toggle-mask="true"
              :error="passwordMismatchError"
              :disabled="authStore.loading"
              required
            />

            <Message
              v-if="successMessage"
              severity="success"
              :closable="false"
              class="mb-4"
            >
              {{ successMessage }}
            </Message>
          </BaseForm>
        </template>

        <template #footer>
          <div class="text-center">
            <router-link
              to="/login"
              class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Back to sign in
            </router-link>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";
import Message from "primevue/message";
import { BaseForm, BasePassword } from "@/components/ui";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const successMessage = ref("");

const form = reactive({
  password: "",
  confirmPassword: "",
});

const isFormValid = computed(() => {
  return form.password.length >= 8 && form.password === form.confirmPassword;
});

const passwordMismatchError = computed(() => {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
});

const handleResetPassword = async () => {
  if (!isFormValid.value) return;

  const token = route.query.token as string;
  if (!token) {
    console.error("No reset token provided");
    return;
  }

  try {
    await authStore.resetPassword(token, form.password);
    successMessage.value =
      "Password reset successfully! Redirecting to login...";

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error("Reset password failed:", error);
  }
};
</script>
