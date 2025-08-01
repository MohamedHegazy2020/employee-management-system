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
      <span v-if="icon" class="p-input-icon-left w-full">
        <i :class="icon" />
        <Password
          :id="id"
          v-model="passwordValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="passwordClasses"
          :required="required"
          :feedback="feedback"
          :toggleMask="toggleMask"
          :promptLabel="promptLabel"
          :weakLabel="weakLabel"
          :mediumLabel="mediumLabel"
          :strongLabel="strongLabel"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </span>
      <Password
        v-else
        :id="id"
        v-model="passwordValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="passwordClasses"
        :required="required"
        :feedback="feedback"
        :toggleMask="toggleMask"
        :promptLabel="promptLabel"
        :weakLabel="weakLabel"
        :mediumLabel="mediumLabel"
        :strongLabel="strongLabel"
        @input="handleInput"
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
import Password from "primevue/password";

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  id?: string;
  icon?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  feedback?: boolean;
  toggleMask?: boolean;
  promptLabel?: string;
  weakLabel?: string;
  mediumLabel?: string;
  strongLabel?: string;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  feedback: true,
  toggleMask: true,
  promptLabel: "Please enter a password",
  weakLabel: "Too simple",
  mediumLabel: "Average complexity",
  strongLabel: "Complex password",
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: Event];
  focus: [event: Event];
}>();

const passwordValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const passwordClasses = computed(() => {
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

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
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

/* Password field styling */
:deep(.p-password) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  background-color: white;
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-password:not(.p-disabled):hover) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-password:not(.p-disabled).p-focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-password.p-invalid) {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

:deep(.p-password-input) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  box-shadow: 0 0 0 2px rgb(59 130 246), 0 0 0 1px rgb(59 130 246);
  border: 1px solid rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease-out;
  background-color: rgb(255 255 255);
  color: rgb(17 24 39);
  font-weight: 500;
}

:deep(.p-password-input:focus) {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-color: rgb(59 130 246);
  outline: none;
}

:deep(.p-password-input:hover:not(:focus):not(.p-disabled)) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-password-input:disabled) {
  background-color: rgb(249 250 251);
  color: rgb(107 114 128);
  cursor: not-allowed;
  border-color: rgb(229 231 235);
  box-shadow: none;
  transform: none;
}

:deep(.p-password-input) {
  padding-left: 3rem;
}

:deep(.p-password-icon) {
  color: rgb(156 163 175);
  transition: color 0.2s;
}

:deep(.p-password-input:focus + .p-password-icon) {
  color: rgb(59 130 246);
}

/* Password strength meter */
:deep(.p-password-panel) {
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-radius: 0.75rem;
  background-color: rgb(255 255 255);
  margin-top: 0.5rem;
  overflow: hidden;
}

:deep(.p-password-meter) {
  background-color: rgb(229 231 235);
  border-radius: 9999px;
  overflow: hidden;
  height: 0.5rem;
  margin-bottom: 0.5rem;
}

:deep(.p-password-strength) {
  height: 100%;
  transition: all 0.3s ease-out;
}

:deep(.p-password-strength.weak) {
  background-color: rgb(239 68 68);
}

:deep(.p-password-strength.medium) {
  background-color: rgb(234 179 8);
}

:deep(.p-password-strength.strong) {
  background-color: rgb(34 197 94);
}

:deep(.p-password-info) {
  font-size: 0.75rem;
  color: rgb(107 114 128);
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Toggle button styling */
:deep(.p-password-toggle) {
  color: rgb(156 163 175);
  transition: color 0.2s;
  cursor: pointer;
}

:deep(.p-password-toggle:hover) {
  color: rgb(107 114 128);
}

:deep(.p-password-toggle:focus) {
  color: rgb(59 130 246);
}

/* Animation for error states */
:deep(.p-password-input.p-invalid) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  border-color: rgb(252 165 165);
  background-color: rgb(254 242 242);
}

/* Success state styling */
:deep(.p-password-input:not(.p-invalid):focus) {
  border-color: rgb(34 197 94);
  box-shadow: 0 0 0 2px rgb(187 247 208);
}

/* Loading state */
:deep(.p-password-input[disabled]) {
  opacity: 0.6;
}

/* Custom scrollbar */
:deep(.p-password-input::-webkit-scrollbar) {
  width: 0.5rem;
}

:deep(.p-password-input::-webkit-scrollbar-track) {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

:deep(.p-password-input::-webkit-scrollbar-thumb) {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:deep(.p-password-input::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(156 163 175);
}

/* Strength meter animation */
:deep(.p-password-strength) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
}

:deep(.p-password-icon) {
  color: rgb(59 130 246);
}
</style>
