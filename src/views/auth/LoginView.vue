<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full">
      <Card class="shadow-xl">
        <template #header>
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p class="text-gray-600">Employee Management System</p>
          </div>
        </template>

        <template #content>
          <BaseForm
            :loading="authStore.loading"
            submit-text="Sign In"
            :show-cancel="false"
            layout="vertical"
            @submit="handleLogin"
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

            <BasePassword
              v-model="form.password"
              label="Password"
              placeholder="Enter your password"
              icon="pi pi-lock"
              :feedback="false"
              :toggle-mask="true"
              :error="authStore.error"
              :disabled="authStore.loading"
              required
            />

            <div class="flex items-center justify-between">
              <BaseCheckbox
                v-model="form.rememberMe"
                label="Remember me"
              />

              <router-link
                to="/forgot-password"
                class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </router-link>
            </div>

            <Message
              v-if="authStore.error"
              severity="error"
              :closable="false"
              class="mb-4"
            >
              {{ authStore.error }}
            </Message>
          </BaseForm>
        </template>

        <template #footer>
          <div class="text-center text-sm text-gray-500">
            <p class="mb-2">Demo Credentials:</p>
            <p class="font-mono text-xs bg-gray-100 p-2 rounded">
              Email: admin@example.com | Password: password
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Card from "primevue/card";
import Message from "primevue/message";
import {
  BaseForm,
  BaseInput,
  BasePassword,
  BaseCheckbox
} from "@/components/ui";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const handleLogin = async () => {
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>
