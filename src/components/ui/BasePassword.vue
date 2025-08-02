<template>
  <div class="form-field">
    <div class="password-container">
      <!-- Icon (if provided) -->
      <div v-if="icon" class="password-icon">
        <i :class="icon" />
      </div>

      <!-- Password Toggle Icon -->
      <div class="password-toggle-icon">
        <i
          :class="toggleIconClass"
          @click="togglePasswordVisibility"
          title="Toggle password visibility"
        />
      </div>

      <!-- Password Field -->
      <Password
        :id="id"
        v-model="passwordValue"
        :disabled="disabled"
        :class="passwordClasses"
        :required="required"
        :feedback="feedback"
        :toggleMask="false"
        :promptLabel="promptLabel"
        :weakLabel="weakLabel"
        :mediumLabel="mediumLabel"
        :strongLabel="strongLabel"
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
    <div v-if="error" class="error-message" role="alert" aria-live="polite">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Hint Message -->
    <div v-else-if="hint" class="hint-message">
      <i class="pi pi-info-circle"></i>
      <span>{{ hint }}</span>
    </div>

    <!-- Password Strength Indicator -->
    <div v-if="feedback && hasValue" class="password-strength">
      <div class="strength-bar">
        <div
          class="strength-fill"
          :class="strengthClass"
          :style="{ width: strengthWidth }"
        ></div>
      </div>
      <span class="strength-text" :class="strengthClass">
        {{ strengthText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Password from "primevue/password";

interface Props {
  modelValue: string;
  label?: string;
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
  loading?: boolean;
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
  loading: false,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: Event];
  focus: [event: Event];
}>();

const isFocused = ref(false);
const isPasswordVisible = ref(false);

const passwordValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const hasValue = computed(() => {
  return props.modelValue && props.modelValue.length > 0;
});

const toggleIconClass = computed(() => {
  return isPasswordVisible.value ? "pi pi-eye-slash" : "pi pi-eye";
});

const passwordStrength = computed(() => {
  if (!hasValue.value) return 0;

  const password = props.modelValue;
  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;

  // Character variety checks
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;

  return Math.min(strength, 100);
});

const strengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 30) return "strength-weak";
  if (strength < 70) return "strength-medium";
  return "strength-strong";
});

const strengthWidth = computed(() => {
  return `${passwordStrength.value}%`;
});

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 30) return props.weakLabel;
  if (strength < 70) return props.mediumLabel;
  return props.strongLabel;
});

const passwordClasses = computed(() => {
  const baseClasses = "modern-password";
  const sizeClasses = {
    small: "password-small",
    medium: "password-medium",
    large: "password-large",
  };
  const stateClasses = {
    error: props.error ? "password-error" : "",
    disabled: props.disabled ? "password-disabled" : "",
    focused: isFocused.value ? "password-focused" : "",
    hasValue: hasValue.value ? "password-has-value" : "",
    hasIcon: props.icon ? "password-has-icon" : "",
    hasToggle: "password-has-toggle",
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    stateClasses.error,
    stateClasses.disabled,
    stateClasses.focused,
    stateClasses.hasValue,
    stateClasses.hasIcon,
    stateClasses.hasToggle,
  ]
    .filter(Boolean)
    .join(" ");
});

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
  // Update the input type
  const input = document.querySelector(`#${props.id}`) as HTMLInputElement;
  if (input) {
    input.type = isPasswordVisible.value ? "text" : "password";
  }
};

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

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: rgb(107 114 128);
  transition: all 0.2s ease;
  pointer-events: none;
}

.password-icon i {
  font-size: 1.125rem;
}

.password-toggle-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: rgb(107 114 128);
  transition: all 0.2s ease;
  cursor: pointer;
}

.password-toggle-icon i {
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.password-toggle-icon:hover i {
  color: rgb(59 130 246);
  background: rgb(243 244 246);
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
  right: 3rem;
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

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;
}

.strength-bar {
  flex: 1;
  height: 0.25rem;
  background: rgb(229 231 235);
  border-radius: 0.125rem;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 0.125rem;
  transition: all 0.3s ease;
}

.strength-weak {
  background: rgb(239 68 68);
}

.strength-medium {
  background: rgb(245 158 11);
}

.strength-strong {
  background: rgb(34 197 94);
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 6rem;
  text-align: right;
}

.strength-text.strength-weak {
  color: rgb(239 68 68);
}

.strength-text.strength-medium {
  color: rgb(245 158 11);
}

.strength-text.strength-strong {
  color: rgb(34 197 94);
}

/* Modern Password Styling */
:deep(.modern-password) {
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

:deep(.modern-password:focus) {
  outline: none;
  border-color: transparent;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
}

:deep(.modern-password:hover:not(:focus):not(.password-disabled)) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
  transform: translateY(-1px);
}

/* Size Variants */
:deep(.password-small) {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

:deep(.password-medium) {
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

:deep(.password-large) {
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
}

/* State Variants */
:deep(.password-error) {
  border-color: rgb(239 68 68);
  background-color: rgb(254 242 242);
  color: rgb(239 68 68);
}

:deep(.password-disabled) {
  background-color: rgb(249 250 251);
  color: rgb(156 163 175);
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

:deep(.password-focused) {
  border-color: transparent;
}

:deep(.password-has-value) {
  border-color: rgb(34 197 94);
}

/* Icon Positioning */
:deep(.password-has-icon) {
  padding-left: 3rem;
}

:deep(.password-has-toggle) {
  padding-right: 2.5rem;
}

/* Input Styling */
:deep(.modern-password .p-password-input) {
  border: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  box-shadow: none;
}

/* Hide default toggle button */
:deep(.modern-password .p-password-toggle) {
  display: none;
}

/* Panel Styling */
:deep(.modern-password .p-password-panel) {
  border: 2px solid rgb(229 231 235);
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -2px rgb(0 0 0 / 0.05);
  margin-top: 0.5rem;
  animation: slideDown 0.2s ease-out;
  padding: 1rem;
}

:deep(.modern-password .p-password-meter) {
  height: 0.25rem;
  background: rgb(229 231 235);
  border-radius: 0.125rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

:deep(.modern-password .p-password-meter .p-password-strength) {
  height: 100%;
  border-radius: 0.125rem;
  transition: all 0.3s ease;
}

:deep(.modern-password .p-password-meter .p-password-strength.weak) {
  background: rgb(239 68 68);
}

:deep(.modern-password .p-password-meter .p-password-strength.medium) {
  background: rgb(245 158 11);
}

:deep(.modern-password .p-password-meter .p-password-strength.strong) {
  background: rgb(34 197 94);
}

:deep(.modern-password .p-password-info) {
  color: rgb(107 114 128);
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
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

/* Focus state with icon */
:deep(.password-has-icon:focus) + .password-icon {
  color: rgb(59 130 246);
  transform: translateY(-50%) scale(1.1);
}

/* Focus state with toggle */
:deep(.password-has-toggle:focus) ~ .password-toggle-icon {
  color: rgb(59 130 246);
}

/* Error state with icon */
:deep(.password-error) + .password-icon {
  color: rgb(239 68 68);
}

/* Error state with toggle */
:deep(.password-error) ~ .password-toggle-icon {
  color: rgb(239 68 68);
}

/* Success state with icon */
:deep(.password-has-value:not(.password-error)) + .password-icon {
  color: rgb(34 197 94);
}

/* Success state with toggle */
:deep(.password-has-value:not(.password-error)) ~ .password-toggle-icon {
  color: rgb(34 197 94);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.password-medium) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  :deep(.password-large) {
    padding: 1rem 1.25rem;
    font-size: 1.125rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :deep(.modern-password) {
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

  :deep(.modern-password .p-password-panel) {
    background: rgb(31 41 55);
    border-color: rgb(75 85 99);
  }

  :deep(.modern-password .p-password-meter) {
    background: rgb(55 65 81);
  }

  :deep(.modern-password .p-password-info) {
    color: rgb(156 163 175);
  }

  .strength-bar {
    background: rgb(55 65 81);
  }
}
</style>
