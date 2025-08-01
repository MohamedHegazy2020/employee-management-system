<template>
  <div class="dropdown-panel" :class="panelClasses" :style="panelStyle">
    <!-- Header slot -->
    <div v-if="$slots.header" class="dropdown-header">
      <slot name="header" />
    </div>

    <!-- Filter slot -->
    <div v-if="$slots.filter" class="dropdown-filter">
      <slot name="filter" />
    </div>

    <!-- Items container -->
    <div class="dropdown-items-container">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="dropdown-footer">
      <slot name="footer" />
    </div>

    <!-- Empty state -->
    <div v-if="empty" class="dropdown-empty">
      <slot name="empty">
        <div class="text-center py-8">
          <i class="pi pi-inbox text-gray-400 text-2xl mb-2"></i>
          <p class="text-gray-500 text-sm">{{ emptyMessage }}</p>
        </div>
      </slot>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="dropdown-loading">
      <slot name="loading">
        <div class="text-center py-8">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="text-gray-500 text-sm mt-2">{{ loadingMessage }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  width?: string;
  maxHeight?: string;
  empty?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  variant?: "default" | "compact" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  width: "auto",
  maxHeight: "300px",
  empty: false,
  loading: false,
  emptyMessage: "No options available",
  loadingMessage: "Loading...",
  variant: "default",
});

const panelClasses = computed(() => {
  const baseClasses =
    "bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden";

  const variantClasses = {
    default: "min-w-48",
    compact: "min-w-40",
    large: "min-w-64",
  };

  return `${baseClasses} ${variantClasses[props.variant]}`;
});

const panelStyle = computed(() => ({
  width: props.width,
  maxHeight: props.maxHeight,
}));
</script>

<style scoped>
.dropdown-panel {
  position: relative;
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(229 231 235);
  background-color: rgb(249 250 251);
}

.dropdown-filter {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(229 231 235);
  background-color: rgb(255 255 255);
}

.dropdown-items-container {
  max-height: 300px;
  overflow-y: auto;
  background-color: rgb(255 255 255);
}

.dropdown-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgb(229 231 235);
  background-color: rgb(249 250 251);
}

.dropdown-empty,
.dropdown-loading {
  padding: 2rem 1rem;
  text-align: center;
  background-color: rgb(255 255 255);
}

/* Custom scrollbar */
.dropdown-items-container::-webkit-scrollbar {
  width: 0.5rem;
}

.dropdown-items-container::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

.dropdown-items-container::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

.dropdown-items-container::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
