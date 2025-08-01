<template>
  <div class="form-field">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative group">
      <Dropdown
        :id="id"
        v-model="dropdownValue"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="dropdownClasses"
        :required="required"
        :filter="filter"
        :filterPlaceholder="filterPlaceholder"
        :showClear="showClear"
        :loading="loading"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Focus ring overlay -->
      <div
        class="absolute inset-0 rounded-xl pointer-events-none transition-all duration-200"
        :class="focusRingClasses"
      ></div>
    </div>

    <small
      v-if="error"
      class="p-error text-red-600 text-xs font-medium mt-2 flex items-center"
    >
      <i class="pi pi-exclamation-circle mr-1"></i>
      {{ error }}
    </small>
    <small
      v-else-if="hint"
      class="text-gray-500 text-xs mt-2 flex items-center"
    >
      <i class="pi pi-info-circle mr-1"></i>
      {{ hint }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Dropdown from "primevue/dropdown";

interface Props {
  modelValue: any;
  options: any[];
  label?: string;
  placeholder?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  optionLabel?: string;
  optionValue?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  showClear?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  optionLabel: "label",
  optionValue: "value",
  filter: false,
  filterPlaceholder: "Search...",
  showClear: false,
  loading: false,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
  change: [event: any];
  blur: [event: Event];
  focus: [event: Event];
}>();

const dropdownValue = computed({
  get: () => props.modelValue,
  set: (value: any) => emit("update:modelValue", value),
});

const dropdownClasses = computed(() => {
  const baseClasses = "w-full transition-all duration-300 ease-out";
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  const errorClasses = props.error ? "border-red-300 bg-red-50" : "";
  const disabledClasses = props.disabled
    ? "bg-gray-50 text-gray-500 cursor-not-allowed"
    : "";

  return `${baseClasses} ${
    sizeClasses[props.size]
  } ${errorClasses} ${disabledClasses}`;
});

const focusRingClasses = computed(() => {
  if (props.error) {
    return "ring-2 ring-red-200 opacity-0 group-focus-within:opacity-100";
  }
  return "ring-2 ring-blue-200 opacity-0 group-focus-within:opacity-100";
});

const handleChange = (event: any) => {
  emit("change", event);
};

const handleBlur = (event: Event) => {
  emit("blur", event);
};

const handleFocus = (event: Event) => {
  emit("focus", event);
};
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Dropdown field styling */
:deep(.p-dropdown) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  background-color: white;
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  min-height: 2.75rem;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-dropdown.p-disabled) {
  background-color: rgb(249 250 251);
  color: rgb(107 114 128);
  cursor: not-allowed;
  border-color: rgb(229 231 235);
  box-shadow: none;
}

:deep(.p-dropdown-label) {
  color: rgb(17 24 39);
  font-weight: 500;
  padding: 0.5rem 0.75rem;
}

:deep(.p-dropdown-trigger) {
  color: rgb(156 163 175);
  transition: color 0.2s;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.p-dropdown:not(.p-disabled).p-focus .p-dropdown-trigger) {
  color: rgb(59 130 246);
}

/* Dropdown panel styling */
:deep(.p-dropdown-panel) {
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  background-color: rgb(255 255 255);
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 1000;
}

:deep(.p-dropdown-items-wrapper) {
  max-height: 200px;
  overflow-y: auto;
  background-color: rgb(255 255 255);
}

:deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: rgb(17 24 39);
  transition: all 0.2s;
  cursor: pointer;
  border-radius: 0.375rem;
  margin: 0.125rem;
  background-color: transparent;
}

:deep(.p-dropdown-item:hover) {
  background-color: rgb(239 246 255);
  color: rgb(59 130 246);
  transform: translateX(0.25rem);
}

:deep(.p-dropdown-item.p-highlight) {
  background-color: rgb(59 130 246);
  color: rgb(255 255 255);
  font-weight: 600;
}

:deep(.p-dropdown-item.p-highlight:hover) {
  background-color: rgb(37 99 235);
  color: rgb(255 255 255);
}

/* Filter input styling */
:deep(.p-dropdown-filter) {
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem;
  width: calc(100% - 1rem);
  background-color: rgb(249 250 251);
  color: rgb(17 24 39);
  font-size: 0.875rem;
}

:deep(.p-dropdown-filter:focus) {
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(147 197 253);
  outline: none;
  background-color: rgb(255 255 255);
}

/* Custom scrollbar for dropdown */
:deep(.p-dropdown-items-wrapper::-webkit-scrollbar) {
  width: 0.5rem;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-track) {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-thumb) {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:deep(.p-dropdown-items-wrapper::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(156 163 175);
}

/* Loading state */
:deep(.p-dropdown.p-loading) {
  position: relative;
}

:deep(.p-dropdown.p-loading::after) {
  content: "";
  position: absolute;
  top: 50%;
  right: 2.5rem;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgb(229 231 235);
  border-top: 2px solid rgb(59 130 246);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translateY(-50%);
}

/* Animation for error states */
:deep(.p-dropdown.p-invalid) {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  background-color: rgb(254 242 242);
}

/* Success state styling */
:deep(.p-dropdown:not(.p-invalid).p-focus) {
  border-color: rgb(34 197 94);
  box-shadow: 0 0 0 2px rgb(187 247 208);
}

/* Loading state */
:deep(.p-dropdown[disabled]) {
  opacity: 0.6;
}

/* Fade in animation for panel */
:deep(.p-dropdown-panel) {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
