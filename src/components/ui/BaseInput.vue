<template>
  <div class="form-field">
    <div class="relative group">
      <span v-if="icon" class="p-input-icon-left w-full">
        <i :class="icon" />
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
      </span>
      <InputText
        v-else
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

      <!-- Float Label -->
      <label
        v-if="label"
        :for="id"
        class="float-label"
        :class="{
          'float-label-active': hasValue || isFocused,
          'float-label-error': error,
        }"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>

      <!-- Focus ring overlay -->
      <div
        class="absolute inset-0 rounded-lg pointer-events-none transition-all duration-200"
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
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: Event];
  focus: [event: Event];
}>();

const isFocused = ref(false);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const hasValue = computed(() => {
  return props.modelValue && props.modelValue.length > 0;
});

const inputClasses = computed(() => {
  const baseClasses = "w-full transition-all duration-300 ease-out";
  const sizeClasses = {
    small: "pt-5 pb-3 px-3 text-sm",
    medium: "pt-7 pb-4 px-4 text-base",
    large: "pt-9 pb-5 px-5 text-lg",
  };
  const errorClasses = props.error ? "border-red-300 bg-red-50" : "";
  const disabledClasses = props.disabled
    ? "bg-gray-50 text-gray-500 cursor-not-allowed"
    : "";
  const hasLabelClass = props.label ? "has-label" : "";

  return `${baseClasses} ${
    sizeClasses[props.size]
  } ${errorClasses} ${disabledClasses} ${hasLabelClass}`;
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
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.float-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  padding: 0 0.25rem;
  color: rgb(107 114 128);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease-out;
  pointer-events: none;
  z-index: 10;
}

.float-label-active {
  top: 0.75rem;
  transform: translateY(0);
  font-size: 0.75rem;
  color: rgb(59 130 246);
  font-weight: 600;
}

.float-label-error {
  color: rgb(239 68 68);
}

/* Input field styling */
:deep(.p-inputtext) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  background-color: white;
  color: rgb(17 24 39);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-inputtext:focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-inputtext.p-invalid) {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

:deep(.p-inputtext:disabled) {
  background-color: rgb(249 250 251);
  color: rgb(156 163 175);
  cursor: not-allowed;
  opacity: 0.7;
}

:deep(.p-inputtext.has-label) {
  padding-top: 1.75rem;
  padding-bottom: 1rem;
}

:deep(.p-inputtext:hover:not(:focus):not(.p-disabled)) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-input-icon-left .p-inputtext) {
  padding-left: 3rem;
}

:deep(.p-input-icon-left .p-inputtext.has-label) {
  padding-left: 3rem;
  padding-top: 1.75rem;
  padding-bottom: 1rem;
}

:deep(.p-input-icon-left i) {
  color: rgb(156 163 175);
  transition: color 0.2s;
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}

:deep(.p-inputtext:focus + .p-input-icon-left i) {
  color: rgb(59 130 246);
}

:deep(.p-input-icon-left .float-label) {
  left: 3rem;
}

/* Custom scrollbar for textarea-like inputs */
:deep(.p-inputtext::-webkit-scrollbar) {
  width: 0.5rem;
}

:deep(.p-inputtext::-webkit-scrollbar-track) {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

:deep(.p-inputtext::-webkit-scrollbar-thumb) {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:deep(.p-inputtext::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(156 163 175);
}

/* Animation for error states */
:deep(.p-inputtext.p-invalid) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  border-color: rgb(252 165 165);
  background-color: rgb(254 242 242);
}

/* Success state styling */
:deep(.p-inputtext:not(.p-invalid):focus) {
  border-color: rgb(34 197 94);
  box-shadow: 0 0 0 2px rgb(187 247 208);
}

/* Loading state */
:deep(.p-inputtext[disabled]) {
  opacity: 0.6;
}

/* Custom focus styles for different input types */
:deep(.p-inputtext[type="email"]:focus) {
  border-color: rgb(147 51 234);
  box-shadow: 0 0 0 2px rgb(233 213 255);
}

:deep(.p-inputtext[type="password"]:focus) {
  border-color: rgb(249 115 22);
  box-shadow: 0 0 0 2px rgb(254 215 170);
}

:deep(.p-inputtext[type="number"]:focus) {
  border-color: rgb(34 197 94);
  box-shadow: 0 0 0 2px rgb(187 247 208);
}

:deep(.p-inputtext[type="tel"]:focus) {
  border-color: rgb(6 182 212);
  box-shadow: 0 0 0 2px rgb(165 243 252);
}

:deep(.p-inputtext[type="url"]:focus) {
  border-color: rgb(99 102 241);
  box-shadow: 0 0 0 2px rgb(199 210 254);
}

/* Size-specific adjustments */
:deep(.p-inputtext.small) {
  padding-top: 1.5rem;
  padding-bottom: 0.75rem;
}

:deep(.p-inputtext.large) {
  padding-top: 2.5rem;
  padding-bottom: 1.25rem;
}

:deep(.p-inputtext.small + .float-label) {
  font-size: 0.75rem;
}

:deep(.p-inputtext.large + .float-label) {
  font-size: 1rem;
}

/* Icon positioning for different sizes */
:deep(.p-input-icon-left.small i) {
  top: 1.5rem;
  transform: none;
}

:deep(.p-input-icon-left.large i) {
  top: 2.5rem;
  transform: none;
}

/* Focus state adjustments */
:deep(.p-inputtext:focus + .float-label) {
  color: rgb(59 130 246);
}

:deep(.p-inputtext.p-invalid + .float-label) {
  color: rgb(239 68 68);
}

/* Animation for label movement */
@keyframes floatUp {
  from {
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
  }
  to {
    top: 0.75rem;
    transform: translateY(0);
    font-size: 0.75rem;
  }
}

@keyframes floatDown {
  from {
    top: 0.75rem;
    transform: translateY(0);
    font-size: 0.75rem;
  }
  to {
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
  }
}

.float-label-active {
  animation: floatUp 0.2s ease-out forwards;
}

.float-label:not(.float-label-active) {
  animation: floatDown 0.2s ease-out forwards;
}
</style>
