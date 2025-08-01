<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
  >
    <!-- Floating Sidebar -->
    <Sidebar
      v-model:visible="sidebarVisible"
      :modal="true"
      class="w-72 custom-sidebar floating-sidebar"
      :class="{
        'sidebar-visible': sidebarVisible,
        'sidebar-hidden': !sidebarVisible,
      }"
      :dismissable="false"
      :show-close-icon="false"
    >
      <div
        class="flex items-center justify-between h-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden"
      >
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent"
          ></div>
        </div>
        <div class="flex items-center space-x-3 relative z-10">
          <div
            class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm"
          >
            <i class="pi pi-building text-white text-xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-white drop-shadow-lg">EMS</h1>
        </div>
        <BaseButton
          icon="pi pi-times"
          @click="sidebarVisible = false"
          variant="secondary"
          size="small"
          padding="compact"
          class="lg:hidden text-white hover:bg-white hover:bg-opacity-20 w-9 h-9 rounded-lg"
        />
      </div>

      <div class="p-6 bg-white/95 backdrop-blur-sm h-full flex flex-col">
        <nav class="space-y-3 flex-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 group hover:scale-105 relative overflow-hidden"
            :class="[
              $route.path.startsWith(item.to)
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow-xl transform scale-105'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:via-blue-50 hover:to-indigo-50 hover:shadow-lg',
            ]"
          >
            <!-- Active state background effect -->
            <div
              v-if="$route.path.startsWith(item.to)"
              class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
            ></div>

            <div
              class="flex items-center justify-center w-8 h-8 mr-4 rounded-xl transition-all duration-300 shadow-md relative z-10"
              :class="[
                $route.path.startsWith(item.to)
                  ? 'bg-white/20 shadow-lg'
                  : 'bg-gray-100 group-hover:bg-white group-hover:shadow-lg',
              ]"
            >
              <i
                :class="[
                  item.icon,
                  $route.path.startsWith(item.to)
                    ? 'text-white'
                    : 'text-gray-600 group-hover:text-blue-600',
                ]"
              ></i>
            </div>
            <span class="font-bold relative z-10">{{ item.name }}</span>

            <!-- Hover effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </router-link>
        </nav>

        <!-- User info at bottom of sidebar -->
        <div class="mt-auto pt-6 border-t border-gray-200/50">
          <div
            class="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-4 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div class="flex items-center space-x-4">
              <div class="relative">
                <Avatar
                  :image="authStore.user?.avatar || '/default-avatar.png'"
                  :alt="authStore.user?.name"
                  size="0.25rem"
                  shape="circle"
                  class="ring-3 ring-blue-200 shadow-lg group-hover:ring-blue-300 transition-all duration-300"
                />
                <div
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-md"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">
                  {{ authStore.user?.name }}
                </p>
                <p class="text-xs text-gray-500 capitalize font-medium">
                  {{ authStore.userRole }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>

    <!-- Main content - Full width -->
    <div class="w-full transition-all duration-500">
      <!-- Header - Full width -->
      <header
        class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 w-full shadow-lg"
      >
        <div class="flex items-center justify-between h-16 px-6 lg:px-8">
          <div class="flex items-center space-x-4">
            <BaseButton
              icon="pi pi-bars"
              @click="sidebarVisible = true"
              variant="secondary"
              size="small"
              padding="compact"
              class="lg:hidden bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 w-9 h-9 rounded-lg"
            />
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-home text-white text-sm"></i>
              </div>
              <div>
                <h2 class="text-lg lg:text-xl font-bold text-gray-900">
                  {{ currentPageTitle }}
                </h2>
                <p class="text-xs text-gray-500 font-medium">Welcome back!</p>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <!-- User menu -->
            <Menu
              ref="userMenu"
              :model="userMenuItems"
              :popup="true"
              class="custom-menu"
            />
            <BaseButton
              @click="userMenu.toggle($event)"
              variant="secondary"
              size="small"
              padding="compact"
              class="user-menu-button flex items-center space-x-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg px-3 py-1.5"
            >
              <div class="relative w-12 h-12 flex items-center justify-center">
                <Avatar
                  :image="authStore.user?.avatar || '/default-avatar.png'"
                  :alt="authStore.user?.name"
                  size="normal"
                  shape="circle"
                  class="ring-2 ring-gray-200 shadow-md"
                />
                <div
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-md"
                ></div>
              </div>
              <div class="hidden lg:block text-left">
                <p class="text-sm font-semibold text-gray-900">
                  {{ authStore.user?.name }}
                </p>
                <p class="text-xs text-gray-500 capitalize">
                  {{ authStore.userRole }}
                </p>
              </div>
              <i class="pi pi-chevron-down text-gray-500 text-sm"></i>
            </BaseButton>
          </div>
        </div>
      </header>

      <!-- Page content - Full width with responsive padding -->
      <main class="p-6 lg:p-8 xl:p-10 w-full">
        <router-view />
      </main>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarVisible"
      @click="sidebarVisible = false"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Sidebar from "primevue/sidebar";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import { BaseButton } from "@/components/ui";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarVisible = ref(false);
const userMenu = ref();

// Initialize sidebar visibility based on screen size
const initializeSidebar = () => {
  if (window.innerWidth >= 1024) {
    sidebarVisible.value = true;
  } else {
    sidebarVisible.value = false;
  }
};

const navigationItems = computed(() => {
  const items = [
    { name: "Dashboard", to: "/dashboard", icon: "pi pi-home" },
    { name: "Companies", to: "/companies", icon: "pi pi-building" },
    { name: "Employees", to: "/employees", icon: "pi pi-users" },
  ];

  // Add departments for admin and manager roles
  if (["admin", "manager"].includes(authStore.userRole)) {
    items.push({
      name: "Departments",
      to: "/departments",
      icon: "pi pi-sitemap",
    });
  }

  return items;
});

const currentPageTitle = computed(() => {
  const currentItem = navigationItems.value.find((item) =>
    route.path.startsWith(item.to)
  );
  return currentItem?.name || "Dashboard";
});

const userMenuItems = ref([
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => router.push("/profile"),
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    command: () => router.push("/settings"),
  },
  {
    separator: true,
  },
  {
    label: "Sign out",
    icon: "pi pi-sign-out",
    command: () => handleLogout(),
  },
]);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target.closest(".p-menu") && !target.closest(".user-menu-button")) {
    userMenu.value?.hide();
  }
};

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarVisible.value = true;
  } else {
    sidebarVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
  initializeSidebar();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.custom-sidebar {
  border: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.floating-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-visible {
  transform: translateX(0) !important;
}

.sidebar-hidden {
  transform: translateX(-100%) !important;
}

/* Desktop behavior - sidebar always visible but floating */
@media (min-width: 1024px) {
  .floating-sidebar {
    transform: translateX(0) !important;
  }

  .sidebar-hidden {
    transform: translateX(0) !important;
  }
}

.custom-sidebar :deep(.p-sidebar-content) {
  padding: 0;
  background: transparent;
  height: 100vh;
  overflow-y: auto;
}

.custom-sidebar :deep(.p-sidebar-left) {
  border: none;
  box-shadow: none;
  position: relative;
}

.custom-menu :deep(.p-menu) {
  border: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  padding: 0.75rem;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  min-width: 200px;
}

.custom-menu :deep(.p-menuitem-link) {
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 0.25rem;
}

.custom-menu :deep(.p-menuitem-link:hover) {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-menu :deep(.p-menuitem-icon) {
  color: #6b7280;
}

.custom-menu :deep(.p-menuitem-text) {
  font-weight: 600;
  color: #374151;
}

.custom-menu :deep(.p-menuitem-separator) {
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  margin: 0.5rem 0;
}

.custom-menu :deep(.p-menuitem) {
  margin-bottom: 0.25rem;
}

.custom-menu :deep(.p-menuitem:last-child) {
  margin-bottom: 0;
}

/* Custom scrollbar for sidebar */
.custom-sidebar :deep(.p-sidebar-content)::-webkit-scrollbar {
  width: 6px;
}

.custom-sidebar :deep(.p-sidebar-content)::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 3px;
}

.custom-sidebar :deep(.p-sidebar-content)::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.8);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.custom-sidebar :deep(.p-sidebar-content)::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.9);
}

/* Focus styles for accessibility */
input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Button hover effects */
.p-button-text:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .custom-sidebar {
    width: 300px;
  }
}

/* Ensure main content takes full width and doesn't move */
.w-full {
  width: 100%;
  margin-left: 0 !important;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Override PrimeVue sidebar styles */
.custom-sidebar :deep(.p-sidebar) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 50 !important;
  width: 288px !important;
}

.custom-sidebar :deep(.p-sidebar-mask) {
  display: none !important;
}

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Glass morphism effect for header */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Enhanced shadows */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation keyframes */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
