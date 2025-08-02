<template>
  <Button
    :label="label"
    :icon="icon"
    :icon-pos="iconPos"
    :type="type"
    :disabled="disabled || loading"
    :loading="loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </Button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";

interface Props {
  label?: string;
  icon?: string;
  iconPos?: "left" | "right" | "top" | "bottom";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  size?: "xs" | "small" | "medium" | "large" | "xl";
  variant?:
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
    | "stone"
    | "outline"
    | "ghost"
    | "text";
  fullWidth?: boolean;
  rounded?: boolean;
  padding?: "none" | "compact" | "normal" | "comfortable" | "spacious";
}

const props = withDefaults(defineProps<Props>(), {
  iconPos: "left",
  type: "button",
  disabled: false,
  loading: false,
  size: "medium",
  variant: "primary",
  fullWidth: false,
  rounded: false,
  padding: "normal",
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const buttonClasses = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2.5 text-sm",
    large: "px-6 py-3 text-base",
    xlarge: "px-8 py-4 text-lg",
  };

  const paddingClasses = {
    compact: "px-2 py-1.5 text-xs",
    normal: "px-4 py-2.5 text-sm",
    relaxed: "px-6 py-3 text-base",
    loose: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    warning: "btn-warning",
    error: "btn-error",
    info: "btn-info",
    light: "btn-light",
    dark: "btn-dark",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const stateClasses = {
    loading: "opacity-75 cursor-not-allowed",
    disabled: "opacity-50 cursor-not-allowed hover:scale-100",
  };

  return [
    baseClasses,
    sizeClasses[props.size],
    paddingClasses[props.padding],
    variantClasses[props.variant],
    props.loading && stateClasses.loading,
    props.disabled && stateClasses.disabled,
  ]
    .filter(Boolean)
    .join(" ");
});

const handleClick = (event: Event) => {
  emit("click", event);
};
</script>

<style scoped>
:deep(.p-button) {
  position: relative;
  overflow: hidden;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.2s ease-out;
}

:deep(.p-button:not(.p-disabled):hover) {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

:deep(.p-button:not(.p-disabled):active) {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

:deep(.p-button.p-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

:deep(.p-button.p-button-loading) {
  cursor: wait;
}

:deep(.p-button .p-button-icon) {
  transition: transform 0.2s ease-out;
  position: relative;
  z-index: 10;
}

:deep(.p-button:hover .p-button-icon) {
  transform: scale(1.1);
}

/* Button Variant Styles */
:deep(.btn-primary) {
  background-color: rgb(37 99 235) !important;
  border-color: rgb(37 99 235) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.25),
    0 4px 6px -4px rgb(59 130 246 / 0.25) !important;
}

:deep(.btn-primary:hover) {
  background-color: rgb(29 78 216) !important;
  border-color: rgb(29 78 216) !important;
  box-shadow: 0 20px 25px -5px rgb(59 130 246 / 0.3),
    0 8px 10px -6px rgb(59 130 246 / 0.3) !important;
}

:deep(.btn-secondary) {
  background-color: rgb(75 85 99) !important;
  border-color: rgb(75 85 99) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(75 85 99 / 0.25),
    0 4px 6px -4px rgb(75 85 99 / 0.25) !important;
}

:deep(.btn-secondary:hover) {
  background-color: rgb(55 65 81) !important;
  border-color: rgb(55 65 81) !important;
  box-shadow: 0 20px 25px -5px rgb(75 85 99 / 0.3),
    0 8px 10px -6px rgb(75 85 99 / 0.3) !important;
}

:deep(.btn-success) {
  background-color: rgb(34 197 94) !important;
  border-color: rgb(34 197 94) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(34 197 94 / 0.25),
    0 4px 6px -4px rgb(34 197 94 / 0.25) !important;
}

:deep(.btn-success:hover) {
  background-color: rgb(22 163 74) !important;
  border-color: rgb(22 163 74) !important;
  box-shadow: 0 20px 25px -5px rgb(34 197 94 / 0.3),
    0 8px 10px -6px rgb(34 197 94 / 0.3) !important;
}

:deep(.btn-danger) {
  background-color: rgb(239 68 68) !important;
  border-color: rgb(239 68 68) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(239 68 68 / 0.25),
    0 4px 6px -4px rgb(239 68 68 / 0.25) !important;
}

:deep(.btn-danger:hover) {
  background-color: rgb(220 38 38) !important;
  border-color: rgb(220 38 38) !important;
  box-shadow: 0 20px 25px -5px rgb(239 68 68 / 0.3),
    0 8px 10px -6px rgb(239 68 68 / 0.3) !important;
}

:deep(.btn-warning) {
  background-color: rgb(249 115 22) !important;
  border-color: rgb(249 115 22) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(249 115 22 / 0.25),
    0 4px 6px -4px rgb(249 115 22 / 0.25) !important;
}

:deep(.btn-warning:hover) {
  background-color: rgb(234 88 12) !important;
  border-color: rgb(234 88 12) !important;
  box-shadow: 0 20px 25px -5px rgb(249 115 22 / 0.3),
    0 8px 10px -6px rgb(249 115 22 / 0.3) !important;
}

:deep(.btn-info) {
  background-color: rgb(6 182 212) !important;
  border-color: rgb(6 182 212) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(6 182 212 / 0.25),
    0 4px 6px -4px rgb(6 182 212 / 0.25) !important;
}

:deep(.btn-info:hover) {
  background-color: rgb(8 145 178) !important;
  border-color: rgb(8 145 178) !important;
  box-shadow: 0 20px 25px -5px rgb(6 182 212 / 0.3),
    0 8px 10px -6px rgb(6 182 212 / 0.3) !important;
}

:deep(.btn-purple) {
  background-color: rgb(147 51 234) !important;
  border-color: rgb(147 51 234) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(147 51 234 / 0.25),
    0 4px 6px -4px rgb(147 51 234 / 0.25) !important;
}

:deep(.btn-purple:hover) {
  background-color: rgb(126 34 206) !important;
  border-color: rgb(126 34 206) !important;
  box-shadow: 0 20px 25px -5px rgb(147 51 234 / 0.3),
    0 8px 10px -6px rgb(147 51 234 / 0.3) !important;
}

:deep(.btn-pink) {
  background-color: rgb(236 72 153) !important;
  border-color: rgb(236 72 153) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(236 72 153 / 0.25),
    0 4px 6px -4px rgb(236 72 153 / 0.25) !important;
}

:deep(.btn-pink:hover) {
  background-color: rgb(219 39 119) !important;
  border-color: rgb(219 39 119) !important;
  box-shadow: 0 20px 25px -5px rgb(236 72 153 / 0.3),
    0 8px 10px -6px rgb(236 72 153 / 0.3) !important;
}

:deep(.btn-indigo) {
  background-color: rgb(99 102 241) !important;
  border-color: rgb(99 102 241) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(99 102 241 / 0.25),
    0 4px 6px -4px rgb(99 102 241 / 0.25) !important;
}

:deep(.btn-indigo:hover) {
  background-color: rgb(79 70 229) !important;
  border-color: rgb(79 70 229) !important;
  box-shadow: 0 20px 25px -5px rgb(99 102 241 / 0.3),
    0 8px 10px -6px rgb(99 102 241 / 0.3) !important;
}

:deep(.btn-teal) {
  background-color: rgb(20 184 166) !important;
  border-color: rgb(20 184 166) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(20 184 166 / 0.25),
    0 4px 6px -4px rgb(20 184 166 / 0.25) !important;
}

:deep(.btn-teal:hover) {
  background-color: rgb(13 148 136) !important;
  border-color: rgb(13 148 136) !important;
  box-shadow: 0 20px 25px -5px rgb(20 184 166 / 0.3),
    0 8px 10px -6px rgb(20 184 166 / 0.3) !important;
}

:deep(.btn-emerald) {
  background-color: rgb(16 185 129) !important;
  border-color: rgb(16 185 129) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(16 185 129 / 0.25),
    0 4px 6px -4px rgb(16 185 129 / 0.25) !important;
}

:deep(.btn-emerald:hover) {
  background-color: rgb(5 150 105) !important;
  border-color: rgb(5 150 105) !important;
  box-shadow: 0 20px 25px -5px rgb(16 185 129 / 0.3),
    0 8px 10px -6px rgb(16 185 129 / 0.3) !important;
}

:deep(.btn-lime) {
  background-color: rgb(132 204 22) !important;
  border-color: rgb(132 204 22) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(132 204 22 / 0.25),
    0 4px 6px -4px rgb(132 204 22 / 0.25) !important;
}

:deep(.btn-lime:hover) {
  background-color: rgb(101 163 13) !important;
  border-color: rgb(101 163 13) !important;
  box-shadow: 0 20px 25px -5px rgb(132 204 22 / 0.3),
    0 8px 10px -6px rgb(132 204 22 / 0.3) !important;
}

:deep(.btn-amber) {
  background-color: rgb(245 158 11) !important;
  border-color: rgb(245 158 11) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(245 158 11 / 0.25),
    0 4px 6px -4px rgb(245 158 11 / 0.25) !important;
}

:deep(.btn-amber:hover) {
  background-color: rgb(217 119 6) !important;
  border-color: rgb(217 119 6) !important;
  box-shadow: 0 20px 25px -5px rgb(245 158 11 / 0.3),
    0 8px 10px -6px rgb(245 158 11 / 0.3) !important;
}

:deep(.btn-rose) {
  background-color: rgb(244 63 94) !important;
  border-color: rgb(244 63 94) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(244 63 94 / 0.25),
    0 4px 6px -4px rgb(244 63 94 / 0.25) !important;
}

:deep(.btn-rose:hover) {
  background-color: rgb(225 29 72) !important;
  border-color: rgb(225 29 72) !important;
  box-shadow: 0 20px 25px -5px rgb(244 63 94 / 0.3),
    0 8px 10px -6px rgb(244 63 94 / 0.3) !important;
}

:deep(.btn-slate) {
  background-color: rgb(100 116 139) !important;
  border-color: rgb(100 116 139) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(100 116 139 / 0.25),
    0 4px 6px -4px rgb(100 116 139 / 0.25) !important;
}

:deep(.btn-slate:hover) {
  background-color: rgb(71 85 105) !important;
  border-color: rgb(71 85 105) !important;
  box-shadow: 0 20px 25px -5px rgb(100 116 139 / 0.3),
    0 8px 10px -6px rgb(100 116 139 / 0.3) !important;
}

:deep(.btn-zinc) {
  background-color: rgb(113 113 122) !important;
  border-color: rgb(113 113 122) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(113 113 122 / 0.25),
    0 4px 6px -4px rgb(113 113 122 / 0.25) !important;
}

:deep(.btn-zinc:hover) {
  background-color: rgb(82 82 91) !important;
  border-color: rgb(82 82 91) !important;
  box-shadow: 0 20px 25px -5px rgb(113 113 122 / 0.3),
    0 8px 10px -6px rgb(113 113 122 / 0.3) !important;
}

:deep(.btn-neutral) {
  background-color: rgb(115 115 115) !important;
  border-color: rgb(115 115 115) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(115 115 115 / 0.25),
    0 4px 6px -4px rgb(115 115 115 / 0.25) !important;
}

:deep(.btn-neutral:hover) {
  background-color: rgb(82 82 82) !important;
  border-color: rgb(82 82 82) !important;
  box-shadow: 0 20px 25px -5px rgb(115 115 115 / 0.3),
    0 8px 10px -6px rgb(115 115 115 / 0.3) !important;
}

:deep(.btn-stone) {
  background-color: rgb(120 113 108) !important;
  border-color: rgb(120 113 108) !important;
  color: white !important;
  box-shadow: 0 10px 15px -3px rgb(120 113 108 / 0.25),
    0 4px 6px -4px rgb(120 113 108 / 0.25) !important;
}

:deep(.btn-stone:hover) {
  background-color: rgb(87 83 78) !important;
  border-color: rgb(87 83 78) !important;
  box-shadow: 0 20px 25px -5px rgb(120 113 108 / 0.3),
    0 8px 10px -6px rgb(120 113 108 / 0.3) !important;
}

:deep(.btn-outline) {
  background-color: transparent !important;
  border-color: rgb(209 213 219) !important;
  color: rgb(55 65 81) !important;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
}

:deep(.btn-outline:hover) {
  background-color: rgb(249 250 251) !important;
  border-color: rgb(156 163 175) !important;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
}

:deep(.btn-ghost) {
  background-color: transparent !important;
  border-color: transparent !important;
  color: rgb(55 65 81) !important;
  box-shadow: none !important;
}

:deep(.btn-ghost:hover) {
  background-color: rgb(243 244 246) !important;
  border-color: rgb(209 213 219) !important;
}

:deep(.btn-text) {
  background-color: transparent !important;
  border-color: transparent !important;
  color: rgb(55 65 81) !important;
  box-shadow: none !important;
  text-decoration: none !important;
}

:deep(.btn-text:hover) {
  background-color: rgb(243 244 246) !important;
  text-decoration: underline !important;
  text-underline-offset: 2px !important;
}

/* Loading spinner styling */
:deep(.p-button .p-button-loading-icon) {
  animation: spin 1s linear infinite;
  color: currentColor;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Size-specific adjustments */
:deep(.p-button.text-xs) {
  min-height: 1.5rem;
}

:deep(.p-button.text-sm) {
  min-height: 2rem;
}

:deep(.p-button.text-base) {
  min-height: 2.5rem;
}

:deep(.p-button.text-lg) {
  min-height: 3rem;
}

:deep(.p-button.text-xl) {
  min-height: 3.5rem;
}

/* Icon positioning improvements */
:deep(.p-button .p-button-icon-left) {
  margin-right: 0.5rem;
}

:deep(.p-button .p-button-icon-right) {
  margin-left: 0.5rem;
}

/* Disabled state improvements */
:deep(.p-button.p-disabled) {
  background-color: rgb(243 244 246) !important;
  border-color: rgb(229 231 235) !important;
  color: rgb(156 163 175) !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none !important;
}

/* Full width button adjustments */
:deep(.p-button.w-full) {
  width: 100%;
  justify-content: center;
}

/* Rounded button adjustments */
:deep(.p-button.rounded-full) {
  border-radius: 9999px;
}

/* Button group compatibility */
:deep(.p-button:not(:last-child)) {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.p-button) {
    font-size: 0.875rem;
  }

  /* Adjust padding for mobile */
  :deep(.p-button.px-1) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  :deep(.p-button.px-3) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  :deep(.p-button.px-6) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  :deep(.p-button.px-8) {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  :deep(.p-button.px-12) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  :deep(.p-button.py-0\\.5) {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  :deep(.p-button.py-1\\.5) {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
  }

  :deep(.p-button.py-3) {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  :deep(.p-button.py-4) {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  :deep(.p-button.py-6) {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
