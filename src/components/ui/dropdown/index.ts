// Main dropdown component
export { default as BaseDropdown } from "./BaseDropdown.vue";

// Sub-components
export { default as DropdownItem } from "./DropdownItem.vue";
export { default as DropdownPanel } from "./DropdownPanel.vue";
export { default as DropdownFilter } from "./DropdownFilter.vue";

// Types
export interface DropdownOption {
  label: string;
  value: any;
  description?: string;
  disabled?: boolean;
  icon?: string;
  badge?: string;
}

export interface DropdownProps {
  modelValue: any;
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
  id?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  optionLabel?: string;
  optionValue?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  showClear?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
}
