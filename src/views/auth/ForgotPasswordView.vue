<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <Card class="shadow-xl">
        <template #header>
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              Reset your password
            </h2>
            <p class="text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>
        </template>

        <template #content>
          <BaseForm
            :loading="authStore.loading"
            submit-text="Send reset link"
            :show-cancel="false"
            layout="vertical"
            @submit="handleForgotPassword"
          >
            <BaseInput
              v-model="form.email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon="pi pi-envelope"
              :error="authStore.error"
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
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";
import Message from "primevue/message";
import { BaseForm, BaseInput } from "@/components/ui";

const authStore = useAuthStore();
const successMessage = ref("");

const form = reactive({
  email: "",
});

const handleForgotPassword = async () => {
  try {
    await authStore.forgotPassword(form.email);
    successMessage.value =
      "Password reset email sent successfully! Check your inbox.";
  } catch (error) {
    console.error("Forgot password failed:", error);
  }
};
</script>
