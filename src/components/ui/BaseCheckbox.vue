<template>
  <div class="form-field">
    <div class="flex items-center space-x-3">
      <Checkbox
        :id="id"
        v-model="checkboxValue"
        :binary="binary"
        :disabled="disabled"
        :required="required"
        :class="checkboxClasses"
        @change="handleChange"
      />
      <label
        v-if="label"
        :for="id"
        class="text-sm font-medium text-gray-700 cursor-pointer select-none"
        :class="{
          'text-red-600': error,
          'text-gray-400 cursor-not-allowed': disabled,
        }"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>
    </div>

    <small
      v-if="error"
      class="p-error text-red-600 text-xs font-medium mt-1 ml-6"
    >
      {{ error }}
    </small>
    <small v-else-if="hint" class="text-gray-500 text-xs mt-1 ml-6">
      {{ hint }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Checkbox from "primevue/checkbox";

interface Props {
  modelValue: boolean | any[];
  label?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  binary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  binary: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean | any[]];
  change: [event: any];
}>();

const checkboxValue = computed({
  get: () => props.modelValue,
  set: (value: boolean | any[]) => emit("update:modelValue", value),
});

const checkboxClasses = computed(() => {
  const baseClasses = "transition-all duration-200";
  const errorClasses = props.error ? "border-red-300" : "";

  return `${baseClasses} ${errorClasses}`;
});

const handleChange = (event: any) => {
  emit("change", event);
};
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Checkbox styling */
:deep(.p-checkbox) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
  background-color: rgb(249 250 251);
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-checkbox:not(.p-disabled):hover) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-checkbox:not(.p-disabled).p-focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-checkbox.p-checkbox-checked) {
  background-color: rgb(59 130 246);
  border-color: rgb(59 130 246);
}

:deep(.p-checkbox.p-checked:not(.p-disabled):hover) {
  background-color: rgb(37 99 235);
  border-color: rgb(37 99 235);
}

:deep(.p-checkbox.p-disabled) {
  background-color: rgb(249 250 251);
  border-color: rgb(229 231 235);
  cursor: not-allowed;
  opacity: 0.5;
}

:deep(.p-checkbox-icon) {
  color: rgb(255 255 255);
  font-size: 0.75rem;
  font-weight: 600;
}

:deep(.p-checkbox.p-checked .p-checkbox-icon) {
  animation: checkmark 0.2s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Checkbox label styling */
:deep(.p-checkbox-label) {
  color: rgb(17 24 39);
  font-weight: 500;
  margin-left: 0.5rem;
  cursor: pointer;
  user-select: none;
}

:deep(.p-checkbox.p-disabled + .p-checkbox-label) {
  color: rgb(156 163 175);
  cursor: not-allowed;
}

/* Animation for error states */
:deep(.p-checkbox.p-invalid) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1);
  border-color: rgb(252 165 165);
  background-color: rgb(254 242 242);
}

/* Success state styling */
:deep(.p-checkbox:not(.p-invalid).p-checked) {
  border-color: rgb(34 197 94);
  background-color: rgb(34 197 94);
}

/* Loading state */
:deep(.p-checkbox[disabled]) {
  opacity: 0.6;
}
</style>
