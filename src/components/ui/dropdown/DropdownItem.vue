<template>
  <div
    class="dropdown-item"
    :class="itemClasses"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="flex items-center space-x-3">
      <!-- Icon slot -->
      <div v-if="$slots.icon" class="flex-shrink-0">
        <slot name="icon" :item="item" />
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ displayLabel }}
        </div>
        <div v-if="item.description" class="text-xs text-gray-500 truncate">
          {{ item.description }}
        </div>
      </div>
      
      <!-- Badge slot -->
      <div v-if="$slots.badge" class="flex-shrink-0">
        <slot name="badge" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  item: any;
  optionLabel?: string;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  optionLabel: 'label',
  selected: false,
  highlighted: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [item: any];
  mouseenter: [item: any];
  mouseleave: [item: any];
}>();

const displayLabel = computed(() => {
  if (typeof props.item === 'string') {
    return props.item;
  }
  return props.item[props.optionLabel] || props.item.label || props.item.name || 'Unknown';
});

const itemClasses = computed(() => {
  const baseClasses = 'px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg';
  
  if (props.disabled) {
    return `${baseClasses} opacity-50 cursor-not-allowed bg-gray-50 text-gray-400`;
  }
  
  if (props.highlighted) {
    return `${baseClasses} bg-blue-50 text-blue-900 border border-blue-200`;
  }
  
  if (props.selected) {
    return `${baseClasses} bg-blue-600 text-white`;
  }
  
  return `${baseClasses} hover:bg-gray-50 text-gray-900`;
});

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.item);
  }
};

const handleMouseEnter = () => {
  emit('mouseenter', props.item);
};

const handleMouseLeave = () => {
  emit('mouseleave', props.item);
};
</script>

<style scoped>
.dropdown-item {
  position: relative;
  overflow: hidden;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.2s ease-out;
  pointer-events: none;
}

.dropdown-item:hover::before {
  opacity: 1;
}

.dropdown-item:active {
  transform: scale(0.98);
}
</style> 