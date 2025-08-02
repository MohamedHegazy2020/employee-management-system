<template>
  <div class="form-field">
    <div class="input-container">
      <!-- Icon (if provided) -->
      <div v-if="icon" class="input-icon">
        <i :class="icon" />
      </div>

      <!-- Input Field -->
      <InputText
        :id="id"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        :required="required"
        @input="handleInput"
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
    <div
      v-if="error"
      class="error-message"
      role="alert"
      aria-live="polite"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Hint Message -->
    <div
      v-else-if="hint"
      class="hint-message"
    >
      <i class="pi pi-info-circle"></i>
      <span>{{ hint }}</span>
    </div>

    <!-- Character Counter (for text inputs) -->
    <div
      v-if="showCounter && type === 'text'"
      class="character-counter"
      :class="{ 'character-counter-warning': isNearLimit }"
    >
      {{ inputValue.length }}/{{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import InputText from "primevue/inputtext";

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  icon?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
  maxLength?: number;
  showCounter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
  loading: false,
  size: "medium",
  showCounter: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: Event];
  focus: [event: Event];
  enter: [event: Event];
}>();

const isFocused = ref(false);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const hasValue = computed(() => {
  return props.modelValue && props.modelValue.length > 0;
});

const isNearLimit = computed(() => {
  if (!props.maxLength) return false;
  return props.modelValue.length >= props.maxLength * 0.9;
});

const inputClasses = computed(() => {
  const baseClasses = "modern-input";
  const sizeClasses = {
    small: "input-small",
    medium: "input-medium",
    large: "input-large",
  };
  const stateClasses = {
    error: props.error ? "input-error" : "",
    disabled: props.disabled ? "input-disabled" : "",
    focused: isFocused.value ? "input-focused" : "",
    hasValue: hasValue.value ? "input-has-value" : "",
    hasIcon: props.icon ? "input-has-icon" : "",
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses.error,
    stateClasses.disabled,
    stateClasses.focused,
    stateClasses.hasValue,
    stateClasses.hasIcon,
  ].filter(Boolean).join(" ");
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
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

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: rgb(107 114 128);
  transition: all 0.2s ease;
  pointer-events: none;
}

.input-icon i {
  font-size: 1.125rem;
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: white;
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
  background: white;
  box-shadow: 0 0 0 2px white;
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

.character-counter {
  text-align: right;
  font-size: 0.75rem;
  color: rgb(107 114 128);
  font-weight: 500;
}

.character-counter-warning {
  color: rgb(245 158 11);
}

/* Modern Input Styling */
:deep(.modern-input) {
  width: 100%;
  border: 2px solid rgb(229 231 235);
  border-radius: 0.75rem;
  background: white;
  color: rgb(17 24 39);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06);
  position: relative;
  z-index: 2;
}

:deep(.modern-input:focus) {
  outline: none;
  border-color: transparent;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
}

:deep(.modern-input:hover:not(:focus):not(.input-disabled)) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
  transform: translateY(-1px);
}

/* Size Variants */
:deep(.input-small) {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

:deep(.input-medium) {
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

:deep(.input-large) {
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
}

/* State Variants */
:deep(.input-error) {
  border-color: rgb(239 68 68);
  background-color: rgb(254 242 242);
  color: rgb(239 68 68);
}

:deep(.input-disabled) {
  background-color: rgb(249 250 251);
  color: rgb(156 163 175);
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

:deep(.input-focused) {
  border-color: transparent;
}

:deep(.input-has-value) {
  border-color: rgb(34 197 94);
}

/* Icon Positioning */
:deep(.input-has-icon) {
  padding-left: 3rem;
}

/* Placeholder Styling */
:deep(.modern-input::placeholder) {
  color: rgb(156 163 175);
  font-weight: 400;
  transition: color 0.2s ease;
}

:deep(.modern-input:focus::placeholder) {
  color: rgb(107 114 128);
}

/* Type-specific Styling */
:deep(.modern-input[type="email"]) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 3rem;
}

:deep(.modern-input[type="password"]) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 3rem;
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
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

/* Focus state with icon */
:deep(.input-has-icon:focus) + .input-icon {
  color: rgb(59 130 246);
  transform: translateY(-50%) scale(1.1);
}

/* Error state with icon */
:deep(.input-error) + .input-icon {
  color: rgb(239 68 68);
}

/* Success state with icon */
:deep(.input-has-value:not(.input-error)) + .input-icon {
  color: rgb(34 197 94);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.input-medium) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
  
  :deep(.input-large) {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :deep(.modern-input) {
    background: rgb(31 41 55);
    border-color: rgb(75 85 99);
    color: rgb(243 244 246);
  }
  
  :deep(.modern-input::placeholder) {
    color: rgb(156 163 175);
  }
  
  .floating-label {
    background: rgb(31 41 55);
    color: rgb(156 163 175);
  }
  
  .floating-label-active {
    background: rgb(31 41 55);
    box-shadow: 0 0 0 2px rgb(31 41 55);
  }
}
</style>
