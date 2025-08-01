<template>
  <div class="dropdown-filter-container">
    <div class="relative">
      <!-- Search icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="pi pi-search text-gray-400 text-sm"></i>
      </div>
      
      <!-- Input field -->
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="dropdown-filter-input"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- Clear button -->
      <button
        v-if="modelValue && !disabled"
        type="button"
        class="dropdown-filter-clear"
        @click="handleClear"
      >
        <i class="pi pi-times text-gray-400 text-sm"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  disabled: false,
  size: 'medium',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const inputClasses = computed(() => {
  const baseClasses = 'block w-full pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200';
  
  const sizeClasses = {
    small: 'text-sm py-2',
    medium: 'text-base py-2.5',
    large: 'text-lg py-3',
  };
  
  const disabledClasses = props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900';
  
  return `${baseClasses} ${sizeClasses[props.size]} ${disabledClasses}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('update:modelValue', '');
  }
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<style scoped>
.dropdown-filter-container {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(229 231 235);
  background-color: rgb(249 250 251);
}

.dropdown-filter-input {
  transition: all 0.2s ease-out;
}

.dropdown-filter-input:hover:not(:disabled) {
  border-color: rgb(156 163 175);
}

.dropdown-filter-input:focus {
  box-shadow: 0 0 0 3px rgb(147 197 253 / 0.1);
}

.dropdown-filter-clear {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-out;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dropdown-filter-clear:hover {
  background-color: rgb(229 231 235);
  color: rgb(107 114 128);
}

.dropdown-filter-clear:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(147 197 253);
}
</style> 