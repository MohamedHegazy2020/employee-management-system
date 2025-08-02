<template>
  <div class="form-field">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-semibold text-gray-700 mb-2"
      :class="{ 'text-red-600': error }"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <Calendar
      :id="id"
      v-model="calendarValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="calendarClasses"
      :required="required"
      :showIcon="showIcon"
      :dateFormat="dateFormat"
      :showTime="showTime"
      :timeOnly="timeOnly"
      :hourFormat="hourFormat"
      :minDate="minDate"
      :maxDate="maxDate"
      :readonlyInput="readonlyInput"
      :manualInput="manualInput"
      @date-select="handleDateSelect"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <small v-if="error" class="p-error text-red-600 text-xs font-medium mt-1">
      {{ error }}
    </small>
    <small v-else-if="hint" class="text-gray-500 text-xs mt-1">
      {{ hint }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Calendar from "primevue/calendar";

interface Props {
  modelValue: Date | Date[] | null;
  label?: string;
  placeholder?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  showIcon?: boolean;
  dateFormat?: string;
  showTime?: boolean;
  timeOnly?: boolean;
  hourFormat?: "12" | "24";
  minDate?: Date;
  maxDate?: Date;
  readonlyInput?: boolean;
  manualInput?: boolean;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  showIcon: true,
  dateFormat: "dd/mm/yy",
  showTime: false,
  timeOnly: false,
  hourFormat: "24",
  readonlyInput: false,
  manualInput: true,
  size: "medium",
});

const emit = defineEmits<{
  "update:modelValue": [value: Date | Date[] | null];
  "date-select": [event: any];
  blur: [event: Event];
  focus: [event: Event];
}>();

const calendarValue = computed({
  get: () => props.modelValue,
  set: (value: Date | Date[] | null) => emit("update:modelValue", value),
});

const calendarClasses = computed(() => {
  const baseClasses = "w-full transition-all duration-200";
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  const errorClasses = props.error
    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
    : "";

  return `${baseClasses} ${sizeClasses[props.size]} ${errorClasses}`;
});

const handleDateSelect = (event: any) => {
  emit("date-select", event);
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

/* Calendar field styling */
:deep(.p-calendar) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.75rem;
  background-color: rgb(249 250 251);
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-calendar:not(.p-disabled):hover) {
  border-color: rgb(156 163 175);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-calendar:not(.p-disabled).p-focus) {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

:deep(.p-calendar.p-invalid) {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

:deep(.p-inputtext) {
  border: 1px solid rgb(209 213 219);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  box-shadow: 0 0 0 2px rgb(59 130 246), 0 0 0 1px rgb(59 130 246);
  border: 1px solid rgb(156 163 175);
  transition: all 0.2s;
}

:deep(.p-inputtext:disabled) {
  background-color: rgb(249 250 251);
  color: rgb(107 114 128);
  cursor: not-allowed;
}

:deep(.p-calendar-w-btn .p-inputtext) {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger) {
  border: 1px solid rgb(209 213 235);
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background-color: rgb(255 255 255);
  color: rgb(107 114 128);
  transition: all 0.2s;
}

:deep(.p-calendar-w-btn .p-datepicker-trigger:hover) {
  background-color: rgb(249 250 251);
  color: rgb(55 65 81);
}

/* Calendar panel styling */
:deep(.p-datepicker-panel) {
  border: 1px solid rgb(229 231 235);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -2px rgb(0 0 0 / 0.05);
  border-radius: 0.5rem;
  background-color: rgb(255 255 255);
}

:deep(.p-datepicker-header) {
  border-bottom: 1px solid rgb(229 231 235);
}

:deep(.p-datepicker-title) {
  color: rgb(17 24 39);
  font-weight: 600;
}

:deep(.p-datepicker-prev, .p-datepicker-next) {
  color: rgb(107 114 128);
  transition: all 0.2s;
}

:deep(.p-datepicker-prev:hover, .p-datepicker-next:hover) {
  color: rgb(55 65 81);
  background-color: rgb(243 244 246);
  border-radius: 0.375rem;
}

:deep(.p-datepicker-calendar) {
  border-collapse: collapse;
}

:deep(.p-datepicker-calendar th) {
  color: rgb(75 85 99);
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.5rem;
}

:deep(.p-datepicker-calendar td) {
  padding: 0.25rem;
}

:deep(.p-datepicker-calendar td > span) {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(55 65 81);
  background-color: rgb(255 255 255);
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;
}

:deep(.p-datepicker-calendar td > span:hover) {
  background-color: rgb(239 246 255);
  color: rgb(59 130 246);
}

:deep(.p-datepicker-calendar td > span.p-highlight) {
  background-color: rgb(239 246 255);
  color: rgb(59 130 246);
  font-weight: 600;
}

:deep(.p-datepicker-calendar td > span.p-today) {
  background-color: rgb(59 130 246);
  color: rgb(255 255 255);
  font-weight: 600;
}

:deep(.p-datepicker-calendar td > span.p-other-month) {
  color: rgb(156 163 175);
}
</style>
