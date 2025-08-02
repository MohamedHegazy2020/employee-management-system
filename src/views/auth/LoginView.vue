<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div
            class="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          >
            <i class="pi pi-users text-white text-2xl"></i>
          </div>
          <h2 class="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-lg text-gray-600 mb-8">
            Sign in to your Employee Management System
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <BaseForm
            :loading="authStore.loading"
            submit-text="Sign In"
            submit-variant="primary"
            :show-cancel="false"
            layout="vertical"
            @submit="handleLogin"
          >
            <div class="space-y-6">
              <!-- Email Input -->
              <div>
                <BaseInput
                  v-model="form.email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  :error="errors.email"
                  :disabled="authStore.loading"
                  required
                />
              </div>

              <!-- Password Input -->
              <div>
                <BasePassword
                  v-model="form.password"
                  label="Password"
                  placeholder="Enter your password"
                  :feedback="false"
                  :toggle-mask="true"
                  :error="errors.password"
                  :disabled="authStore.loading"
                  required
                />
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <BaseCheckbox
                  v-model="form.rememberMe"
                  label="Remember me for 30 days"
                />

                <router-link
                  to="/forgot-password"
                  class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </router-link>
              </div>

              <!-- Error Message -->
              <Message
                v-if="authStore.error"
                severity="error"
                :closable="true"
                @close="clearError"
                class="mb-4"
              >
                <div class="flex items-center">
                  <i class="pi pi-exclamation-triangle mr-2"></i>
                  {{ authStore.error }}
                </div>
              </Message>

              <!-- Success Message -->
              <Message
                v-if="successMessage"
                severity="success"
                :closable="true"
                @close="successMessage = ''"
                class="mb-4"
              >
                <div class="flex items-center">
                  <i class="pi pi-check-circle mr-2"></i>
                  {{ successMessage }}
                </div>
              </Message>
            </div>
          </BaseForm>

          <!-- Demo Credentials -->
          <div
            class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
          >
            <div class="flex items-center mb-2">
              <i class="pi pi-info-circle text-blue-600 mr-2"></i>
              <span class="text-sm font-semibold text-blue-800"
                >Demo Credentials</span
              >
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Admin:</span>
                <code class="bg-white px-2 py-1 rounded text-blue-700 font-mono"
                  >admin@ems.com</code
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Manager:</span>
                <code class="bg-white px-2 py-1 rounded text-blue-700 font-mono"
                  >manager@techcorp.com</code
                >
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Password:</span>
                <code class="bg-white px-2 py-1 rounded text-blue-700 font-mono"
                  >admin123 / manager123</code
                >
              </div>
            </div>
          </div>

          <!-- Quick Login Buttons -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Quick Login</span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <BaseButton
                label="Admin"
                variant="secondary"
                size="small"
                padding="compact"
                :loading="authStore.loading"
                @click="quickLogin('admin')"
              />
              <BaseButton
                label="Demo User"
                variant="secondary"
                size="small"
                padding="compact"
                :loading="authStore.loading"
                @click="quickLogin('demo')"
              />
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="text-center space-y-4">
          <p class="text-sm text-gray-500">
            Don't have an account?
            <router-link
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
            >
              Contact your administrator
            </router-link>
          </p>

          <div
            class="flex items-center justify-center space-x-6 text-xs text-gray-400"
          >
            <a href="#" class="hover:text-gray-600 transition-colors"
              >Privacy Policy</a
            >
            <span>•</span>
            <a href="#" class="hover:text-gray-600 transition-colors"
              >Terms of Service</a
            >
            <span>•</span>
            <a href="#" class="hover:text-gray-600 transition-colors"
              >Support</a
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Hero Section -->
    <div
      class="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style="
            background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='006060' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
          "
        ></div>
      </div>

      <!-- Content -->
      <div class="relative flex flex-col justify-center px-12 py-16 text-white">
        <div class="max-w-lg">
          <h1 class="text-4xl font-bold mb-6 leading-tight">
            Streamline Your <br />
            <span class="text-blue-200">Employee Management</span>
          </h1>

          <p class="text-xl text-blue-100 mb-8 leading-relaxed">
            Efficiently manage your workforce with our comprehensive employee
            management system. Track performance, manage departments, and
            streamline HR processes.
          </p>

          <!-- Features List -->
          <div class="space-y-4">
            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
              >
                <i class="pi pi-users text-white text-sm"></i>
              </div>
              <span class="text-blue-100">Comprehensive employee profiles</span>
            </div>

            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
              >
                <i class="pi pi-chart-line text-white text-sm"></i>
              </div>
              <span class="text-blue-100"
                >Performance tracking & analytics</span
              >
            </div>

            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
              >
                <i class="pi pi-sitemap text-white text-sm"></i>
              </div>
              <span class="text-blue-100">Department & company management</span>
            </div>

            <div class="flex items-center">
              <div
                class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4"
              >
                <i class="pi pi-shield text-white text-sm"></i>
              </div>
              <span class="text-blue-100">Secure & role-based access</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-12 grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">500+</div>
              <div class="text-sm text-blue-200">Employees</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">25+</div>
              <div class="text-sm text-blue-200">Departments</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-white">99.9%</div>
              <div class="text-sm text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Elements -->
      <div
        class="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"
      ></div>
      <div
        class="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"
      ></div>
      <div
        class="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Message from "primevue/message";
import {
  BaseForm,
  BaseInput,
  BasePassword,
  BaseCheckbox,
  BaseButton,
} from "@/components/ui";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const errors = reactive({
  email: "",
  password: "",
});

const successMessage = ref("");

const validateForm = () => {
  let isValid = true;

  // Clear previous errors
  errors.email = "";
  errors.password = "";

  // Email validation
  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    isValid = false;
  }

  // Password validation
  if (!form.password.trim()) {
    errors.password = "Password is required";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    successMessage.value = "Login successful! Redirecting...";

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const quickLogin = async (type: "admin" | "demo") => {
  if (type === "admin") {
    form.email = "admin@ems.com";
    form.password = "admin123";
  } else {
    form.email = "manager@techcorp.com";
    form.password = "manager123";
  }

  await handleLogin();
};

const clearError = () => {
  authStore.clearError();
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Apply animations */
.min-h-screen > div:first-child {
  animation: fadeInUp 0.6s ease-out;
}

/* Floating elements animation */
.absolute.top-20.right-20,
.absolute.bottom-20.left-20,
.absolute.top-1\/2.right-10 {
  animation: float 6s ease-in-out infinite;
}

.absolute.bottom-20.left-20 {
  animation-delay: 2s;
}

.absolute.top-1\/2.right-10 {
  animation-delay: 4s;
}

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
