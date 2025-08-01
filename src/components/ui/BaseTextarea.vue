<template>
  <div class="form-field">
    <div class="relative group">
      <Textarea
        :id="id"
        v-model="textareaValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :autoResize="autoResize"
        :class="textareaClasses"
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
import { computed, ref } from "vue";
import Textarea from "primevue/textarea";

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  autoResize?: boolean;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 3,
  autoResize: true,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: Event];
  focus: [event: Event];
}>();

const isFocused = ref(false);

const textareaValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const hasValue = computed(() => {
  return props.modelValue && props.modelValue.length > 0;
});

const textareaClasses = computed(() => {
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
  const target = event.target as HTMLTextAreaElement;
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
  top: 0.75rem;
  background-color: white;
  padding: 0 0.25rem;
  color: rgb(107 114 128);
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease-out;
  pointer-events: none;
  z-index: 10;
}

.float-label-active {
  color: rgb(59 130 246);
}

.float-label-error {
  color: rgb(239 68 68);
}

/* Textarea field styling */
:deep(.p-inputtextarea) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  background-color: white;
  color: rgb(17 24 39);
  font-size: 0.875rem;
  line-height: 1.5;
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  resize: vertical;
  min-height: 6rem;
}

:deep(.p-inputtextarea:focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-inputtextarea.p-invalid) {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

:deep(.p-inputtextarea:disabled) {
  background-color: rgb(249 250 251);
  color: rgb(156 163 175);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Custom scrollbar for textarea */
:deep(.p-inputtextarea::-webkit-scrollbar) {
  width: 0.5rem;
}

:deep(.p-inputtextarea::-webkit-scrollbar-track) {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

:deep(.p-inputtextarea::-webkit-scrollbar-thumb) {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

:deep(.p-inputtextarea::-webkit-scrollbar-thumb:hover) {
  background-color: rgb(156 163 175);
}

/* Animation for error states */
:deep(.p-inputtextarea.p-invalid) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  border-color: rgb(252 165 165);
  background-color: rgb(254 242 242);
}

/* Success state styling */
:deep(.p-inputtextarea:not(.p-invalid):focus) {
  border-color: rgb(34 197 94);
  box-shadow: 0 0 0 2px rgb(187 247 208);
}

/* Loading state */
:deep(.p-inputtextarea[disabled]) {
  opacity: 0.6;
}

/* Auto-resize transition */
:deep(.p-inputtextarea) {
  transition: height 0.3s ease-out;
  line-height: 1.625;
}

/* Size-specific adjustments */
:deep(.p-inputtextarea.small) {
  padding-top: 2.5rem;
}

:deep(.p-inputtextarea.large) {
  padding-top: 3.5rem;
}

:deep(.p-inputtextarea.small + .float-label) {
  font-size: 0.7rem;
  top: 0.75rem;
}

:deep(.p-inputtextarea.large + .float-label) {
  font-size: 0.875rem;
  top: 1.25rem;
}

/* Focus state adjustments */
:deep(.p-inputtextarea:focus + .float-label) {
  color: rgb(59 130 246);
}

:deep(.p-inputtextarea.p-invalid + .float-label) {
  color: rgb(239 68 68);
}

/* Animation for label movement */
@keyframes floatUp {
  from {
    top: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  to {
    top: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

@keyframes floatDown {
  from {
    top: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
  to {
    top: 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.float-label-active {
  animation: floatUp 0.2s ease-out forwards;
}

.float-label:not(.float-label-active) {
  animation: floatDown 0.2s ease-out forwards;
}
</style>
