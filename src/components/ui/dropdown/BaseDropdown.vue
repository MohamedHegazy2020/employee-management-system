<template>
  <div class="form-field">
    <div class="dropdown-container">
      <!-- Dropdown Field -->
      <Dropdown
        :id="id"
        v-model="dropdownValue"
        :options="options"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
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

      <!-- Floating Label -->
      <label
        v-if="label"
        :for="id"
        class="floating-label"
        :class="{
          'floating-label-active': hasValue || isFocused,
          'floating-label-error': error,
          'floating-label-focused': isFocused,
        }"
      >
        {{ label }}
        <span v-if="required" class="required-indicator">*</span>
      </label>

      <!-- Status Icons -->
      <div class="status-icons">
        <i
          v-if="error"
          class="pi pi-exclamation-circle error-icon"
          title="Error"
        />
        <i
          v-else-if="hasValue && !error"
          class="pi pi-check-circle success-icon"
          title="Valid"
        />
        <i
          v-if="loading"
          class="pi pi-spin pi-spinner loading-icon"
          title="Loading"
        />
        <i
          v-else
          class="pi pi-chevron-down dropdown-icon"
          :class="{ 'dropdown-icon-active': isFocused }"
          title="Dropdown"
        />
      </div>

      <!-- Focus Ring -->
      <div
        class="focus-ring"
        :class="{
          'focus-ring-active': isFocused,
          'focus-ring-error': error,
        }"
      ></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message" role="alert" aria-live="polite">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Hint Message -->
    <div v-else-if="hint" class="hint-message">
      <i class="pi pi-info-circle"></i>
      <span>{{ hint }}</span>
    </div>

    <!-- Selected Value Display -->
    <div v-if="hasValue && showSelectedValue" class="selected-value">
      <i class="pi pi-check text-green-600"></i>
      <span>{{ selectedLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Dropdown from "primevue/dropdown";

interface Props {
  modelValue: any;
  options: any[];
  label?: string;
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
  showSelectedValue?: boolean;
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
  showSelectedValue: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: any];
  change: [event: any];
  blur: [event: Event];
  focus: [event: Event];
}>();

const isFocused = ref(false);

const dropdownValue = computed({
  get: () => props.modelValue,
  set: (value: any) => emit("update:modelValue", value),
});

const hasValue = computed(() => {
  return (
    props.modelValue !== null &&
    props.modelValue !== undefined &&
    props.modelValue !== ""
  );
});

const selectedLabel = computed(() => {
  if (!hasValue.value) return "";
  const selectedOption = props.options.find(
    (option) => option[props.optionValue] === props.modelValue
  );
  return selectedOption ? selectedOption[props.optionLabel] : "";
});

const dropdownClasses = computed(() => {
  const baseClasses = "modern-dropdown";
  const sizeClasses = {
    small: "dropdown-small",
    medium: "dropdown-medium",
    large: "dropdown-large",
  };
  const stateClasses = {
    error: props.error ? "dropdown-error" : "",
    disabled: props.disabled ? "dropdown-disabled" : "",
    focused: isFocused.value ? "dropdown-focused" : "",
    hasValue: hasValue.value ? "dropdown-has-value" : "",
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses.error,
    stateClasses.disabled,
    stateClasses.focused,
    stateClasses.hasValue,
  ]
    .filter(Boolean)
    .join(" ");
});

const handleChange = (event: any) => {
  emit("change", event);
};

const handleBlur = (event: Event) => {
  isFocused.value = false;
  emit("blur", event);
};

const handleFocus = (event: Event) => {
  isFocused.value = true;
  emit("focus", event);
};
</script>

<style scoped>
.form-field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(249 250 251);
  padding: 0 0.5rem;
  color: rgb(107 114 128);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 5;
  border-radius: 0.375rem;
}

.floating-label-active {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  color: rgb(59 130 246);
  font-weight: 600;
  background: rgb(249 250 251);
  box-shadow: 0 0 0 2px rgb(249 250 251);
}

.floating-label-focused {
  color: rgb(59 130 246);
}

.floating-label-error {
  color: rgb(239 68 68);
}

.required-indicator {
  color: rgb(239 68 68);
  margin-left: 0.125rem;
}

.status-icons {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
  pointer-events: none;
}

.error-icon {
  color: rgb(239 68 68);
  font-size: 1rem;
  animation: shake 0.5s ease-in-out;
}

.success-icon {
  color: rgb(34 197 94);
  font-size: 1rem;
  animation: bounce 0.5s ease-in-out;
}

.loading-icon {
  color: rgb(59 130 246);
  font-size: 1rem;
}

.dropdown-icon {
  color: rgb(107 114 128);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.dropdown-icon-active {
  color: rgb(59 130 246);
  transform: rotate(180deg);
}

.focus-ring {
  position: absolute;
  inset: -2px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.focus-ring-active {
  opacity: 1;
}

.focus-ring-error {
  background: linear-gradient(135deg, rgb(239 68 68), rgb(220 38 38));
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(239 68 68);
  font-size: 0.75rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.error-message i {
  font-size: 0.875rem;
}

.hint-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(107 114 128);
  font-size: 0.75rem;
  animation: slideIn 0.3s ease-out;
}

.hint-message i {
  font-size: 0.875rem;
}

.selected-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(34 197 94);
  font-size: 0.75rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.selected-value i {
  font-size: 0.875rem;
}

/* Modern Dropdown Styling */
:deep(.modern-dropdown) {
  width: 100%;
  border: 2px solid rgb(229 231 235);
  border-radius: 0.75rem;
  background: rgb(249 250 251);
  color: rgb(17 24 39);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06);
  position: relative;
  z-index: 2;
}

/* Hide default dropdown arrow to prevent double arrows */
:deep(.modern-dropdown .p-dropdown-trigger-icon) {
  display: none;
}

:deep(.modern-dropdown:focus) {
  outline: none;
  border-color: transparent;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
}

:deep(.modern-dropdown:hover:not(:focus):not(.dropdown-disabled)) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
  transform: translateY(-1px);
}

/* Size Variants */
:deep(.dropdown-small) {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

:deep(.dropdown-medium) {
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

:deep(.dropdown-large) {
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
}

/* State Variants */
:deep(.dropdown-error) {
  border-color: rgb(239 68 68);
  background-color: rgb(254 242 242);
  color: rgb(239 68 68);
}

:deep(.dropdown-disabled) {
  background-color: rgb(249 250 251);
  color: rgb(156 163 175);
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

:deep(.dropdown-focused) {
  border-color: transparent;
}

:deep(.dropdown-has-value) {
  border-color: rgb(34 197 94);
}

/* Label Styling */
:deep(.modern-dropdown .p-dropdown-label) {
  color: rgb(17 24 39);
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.modern-dropdown:focus .p-dropdown-label) {
  color: rgb(59 130 246);
}

:deep(.modern-dropdown .p-dropdown-label.p-inputtext) {
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

/* Dropdown Trigger */
:deep(.modern-dropdown .p-dropdown-trigger) {
  width: auto;
  padding: 0;
  border: none;
  background: transparent;
  color: rgb(107 114 128);
  transition: color 0.2s ease;
}

:deep(.modern-dropdown:focus .p-dropdown-trigger) {
  color: rgb(59 130 246);
}

/* Dropdown Panel */
:deep(.modern-dropdown .p-dropdown-panel) {
  border: 2px solid rgb(229 231 235);
  border-radius: 0.75rem;
  background: rgb(249 250 251);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -2px rgb(0 0 0 / 0.05);
  margin-top: 0.5rem;
  animation: slideDown 0.2s ease-out;
}

:deep(.modern-dropdown .p-dropdown-items) {
  padding: 0.5rem 0;
}

:deep(.modern-dropdown .p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: rgb(17 24 39);
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  margin: 0 0.5rem;
  background: transparent;
}

:deep(.modern-dropdown .p-dropdown-item:hover) {
  background: rgb(243 244 246);
  color: rgb(59 130 246);
  transform: translateX(0.25rem);
}

:deep(.modern-dropdown .p-dropdown-item.p-highlight) {
  background: rgb(59 130 246);
  color: white;
}

/* Filter Input */
:deep(.modern-dropdown .p-dropdown-filter) {
  border: 1px solid rgb(229 231 235);
  border-radius: 0.5rem;
  background: rgb(249 250 251);
  color: rgb(17 24 39);
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.modern-dropdown .p-dropdown-filter:focus) {
  outline: none;
  border-color: rgb(59 130 246);
  background: white;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.1);
}

/* Clear Button */
:deep(.modern-dropdown .p-dropdown-clear-icon) {
  color: rgb(156 163 175);
  transition: color 0.2s ease;
}

:deep(.modern-dropdown .p-dropdown-clear-icon:hover) {
  color: rgb(239 68 68);
}

/* Animations */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.dropdown-medium) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  :deep(.dropdown-large) {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :deep(.modern-dropdown) {
    background: rgb(31 41 55);
    border-color: rgb(75 85 99);
    color: rgb(243 244 246);
  }

  .floating-label {
    background: rgb(31 41 55);
    color: rgb(156 163 175);
  }

  .floating-label-active {
    background: rgb(31 41 55);
    box-shadow: 0 0 0 2px rgb(31 41 55);
  }

  :deep(.modern-dropdown .p-dropdown-panel) {
    background: rgb(31 41 55);
    border-color: rgb(75 85 99);
  }

  :deep(.modern-dropdown .p-dropdown-item) {
    color: rgb(243 244 246);
  }

  :deep(.modern-dropdown .p-dropdown-item:hover) {
    background: rgb(55 65 81);
  }

  :deep(.modern-dropdown .p-dropdown-filter) {
    background: rgb(55 65 81);
    border-color: rgb(75 85 99);
    color: rgb(243 244 246);
  }
}
</style>
