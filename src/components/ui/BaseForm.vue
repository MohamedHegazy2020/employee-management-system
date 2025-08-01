<template>
  <form :class="formClasses" @submit.prevent="handleSubmit">
    <div class="space-y-6">
      <slot />
    </div>

    <!-- Form Actions -->
    <div
      v-if="$slots.actions || showDefaultActions"
      class="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-gray-200"
    >
      <slot name="actions">
        <BaseButton
          v-if="showCancel"
          type="button"
          variant="secondary"
          size="medium"
          padding="normal"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </BaseButton>
        <BaseButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          :variant="submitVariant"
          size="medium"
          padding="normal"
        >
          {{ submitText }}
        </BaseButton>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";

interface Props {
  loading?: boolean;
  showDefaultActions?: boolean;
  showCancel?: boolean;
  submitText?: string;
  cancelText?: string;
  submitVariant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "purple"
    | "pink"
    | "indigo"
    | "teal"
    | "emerald"
    | "lime"
    | "amber"
    | "rose"
    | "slate"
    | "zinc"
    | "neutral"
    | "stone";
  layout?: "vertical" | "horizontal" | "grid";
  gridCols?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showDefaultActions: true,
  showCancel: true,
  submitText: "Submit",
  cancelText: "Cancel",
  submitVariant: "primary",
  layout: "vertical",
  gridCols: 2,
});

const emit = defineEmits<{
  submit: [event: Event];
  cancel: [event: Event];
}>();

const formClasses = computed(() => {
  const baseClasses = "w-full";
  const layoutClasses = {
    vertical: "space-y-6",
    horizontal: "space-y-6",
    grid: `grid grid-cols-1 md:grid-cols-${props.gridCols} gap-6`,
  };

  return `${baseClasses} ${layoutClasses[props.layout]}`;
});

const handleSubmit = (event: Event) => {
  emit("submit", event);
};

const handleCancel = (event: Event) => {
  emit("cancel", event);
};
</script>

<style scoped>
/* Additional form styling can be added here */
</style>
