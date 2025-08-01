# Reusable UI Components

This directory contains a comprehensive set of reusable form components built on top of PrimeVue components with enhanced styling and functionality.

## 🎨 **Components Overview**

### **Form Input Components**

#### **BaseInput**

A versatile text input component with built-in validation, icons, and error handling.

```vue
<BaseInput
  v-model="form.email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon="pi pi-envelope"
  :error="validationError"
  :disabled="loading"
  required
  hint="We'll never share your email"
/>
```

**Props:**

- `modelValue` (string) - Input value
- `label` (string) - Field label
- `placeholder` (string) - Placeholder text
- `type` (string) - Input type (text, email, tel, url, etc.)
- `icon` (string) - Icon class (e.g., "pi pi-envelope")
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable input
- `required` (boolean) - Mark as required
- `size` (string) - Size: 'small', 'normal', 'large'

#### **BaseTextarea**

Multi-line text input with auto-resize and validation support.

```vue
<BaseTextarea
  v-model="form.description"
  label="Description"
  placeholder="Enter description"
  :rows="4"
  :auto-resize="true"
  :error="validationError"
  required
/>
```

**Props:**

- `modelValue` (string) - Textarea value
- `label` (string) - Field label
- `placeholder` (string) - Placeholder text
- `rows` (number) - Number of visible rows
- `autoResize` (boolean) - Auto-resize to content
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable textarea
- `required` (boolean) - Mark as required
- `size` (string) - Size: 'small', 'normal', 'large'

#### **BaseDropdown**

Enhanced dropdown with filtering, search, and custom options.

```vue
<BaseDropdown
  v-model="form.category"
  :options="categories"
  label="Category"
  placeholder="Select a category"
  option-label="name"
  option-value="id"
  :show-clear="true"
  filter
  filter-placeholder="Search categories..."
  :loading="loading"
/>
```

**Props:**

- `modelValue` (any) - Selected value
- `options` (array) - Available options
- `label` (string) - Field label
- `placeholder` (string) - Placeholder text
- `optionLabel` (string) - Property name for display text
- `optionValue` (string) - Property name for value
- `filter` (boolean) - Enable filtering
- `filterPlaceholder` (string) - Filter input placeholder
- `showClear` (boolean) - Show clear button
- `loading` (boolean) - Show loading state
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable dropdown
- `required` (boolean) - Mark as required
- `size` (string) - Size: 'small', 'normal', 'large'

#### **BasePassword**

Password input with strength indicator and toggle visibility.

```vue
<BasePassword
  v-model="form.password"
  label="Password"
  placeholder="Enter password"
  icon="pi pi-lock"
  :feedback="true"
  :toggle-mask="true"
  :error="validationError"
  required
/>
```

**Props:**

- `modelValue` (string) - Password value
- `label` (string) - Field label
- `placeholder` (string) - Placeholder text
- `icon` (string) - Icon class
- `feedback` (boolean) - Show strength indicator
- `toggleMask` (boolean) - Show/hide password toggle
- `promptLabel` (string) - Strength prompt text
- `weakLabel` (string) - Weak password text
- `mediumLabel` (string) - Medium password text
- `strongLabel` (string) - Strong password text
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable input
- `required` (boolean) - Mark as required
- `size` (string) - Size: 'small', 'normal', 'large'

#### **BaseCalendar**

Date and time picker with various formats and constraints.

```vue
<BaseCalendar
  v-model="form.birthDate"
  label="Birth Date"
  placeholder="Select date"
  :show-icon="true"
  date-format="dd/mm/yy"
  :min-date="minDate"
  :max-date="maxDate"
  :error="validationError"
  required
/>
```

**Props:**

- `modelValue` (Date|Date[]|null) - Selected date(s)
- `label` (string) - Field label
- `placeholder` (string) - Placeholder text
- `showIcon` (boolean) - Show calendar icon
- `dateFormat` (string) - Date format string
- `showTime` (boolean) - Show time picker
- `timeOnly` (boolean) - Time picker only
- `hourFormat` (string) - '12' or '24' hour format
- `minDate` (Date) - Minimum selectable date
- `maxDate` (Date) - Maximum selectable date
- `readonlyInput` (boolean) - Read-only input
- `manualInput` (boolean) - Allow manual input
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable calendar
- `required` (boolean) - Mark as required
- `size` (string) - Size: 'small', 'normal', 'large'

#### **BaseCheckbox**

Checkbox with label and validation support.

```vue
<BaseCheckbox
  v-model="form.agreement"
  label="I agree to the terms and conditions"
  :error="validationError"
  required
/>
```

**Props:**

- `modelValue` (boolean|array) - Checkbox value
- `label` (string) - Checkbox label
- `binary` (boolean) - Single checkbox mode
- `error` (string) - Error message
- `hint` (string) - Helper text
- `disabled` (boolean) - Disable checkbox
- `required` (boolean) - Mark as required

### **Button Components**

#### **BaseButton**

Enhanced button with multiple variants, sizes, and states.

```vue
<BaseButton
  label="Submit"
  icon="pi pi-check"
  variant="primary"
  size="large"
  :loading="loading"
  :full-width="false"
  :rounded="false"
  @click="handleSubmit"
/>
```

**Props:**

- `label` (string) - Button text
- `icon` (string) - Icon class
- `iconPos` (string) - Icon position: 'left', 'right', 'top', 'bottom'
- `type` (string) - Button type: 'button', 'submit', 'reset'
- `disabled` (boolean) - Disable button
- `loading` (boolean) - Show loading state
- `size` (string) - Size: 'small', 'normal', 'large'
- `variant` (string) - Style variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost', 'text'
- `fullWidth` (boolean) - Full width button
- `rounded` (boolean) - Rounded corners

### **Form Wrapper**

#### **BaseForm**

Complete form wrapper with built-in actions and layout options.

```vue
<BaseForm
  :loading="loading"
  submit-text="Create User"
  submit-variant="primary"
  layout="grid"
  :grid-cols="2"
  @submit="handleSubmit"
  @cancel="handleCancel"
>
  <!-- Form fields here -->
  
  <!-- Custom actions slot -->
  <template #actions>
    <BaseButton variant="outline" @click="resetForm">Reset</BaseButton>
    <BaseButton variant="primary" type="submit">Submit</BaseButton>
  </template>
</BaseForm>
```

**Props:**

- `loading` (boolean) - Form loading state
- `showDefaultActions` (boolean) - Show default action buttons
- `showCancel` (boolean) - Show cancel button
- `submitText` (string) - Submit button text
- `cancelText` (string) - Cancel button text
- `submitVariant` (string) - Submit button variant
- `layout` (string) - Layout: 'vertical', 'horizontal', 'grid'
- `gridCols` (number) - Number of grid columns

## 🎯 **Usage Examples**

### **Complete Form Example**

```vue
<template>
  <BaseForm
    :loading="loading"
    submit-text="Create Employee"
    layout="grid"
    :grid-cols="2"
    @submit="handleSubmit"
  >
    <BaseInput
      v-model="form.firstName"
      label="First Name"
      placeholder="Enter first name"
      icon="pi pi-user"
      :error="errors.firstName"
      required
    />

    <BaseInput
      v-model="form.lastName"
      label="Last Name"
      placeholder="Enter last name"
      icon="pi pi-user"
      :error="errors.lastName"
      required
    />

    <BaseInput
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="Enter email"
      icon="pi pi-envelope"
      :error="errors.email"
      required
    />

    <BaseInput
      v-model="form.phone"
      label="Phone"
      type="tel"
      placeholder="Enter phone"
      icon="pi pi-phone"
      :error="errors.phone"
      required
    />

    <BaseDropdown
      v-model="form.department"
      :options="departments"
      label="Department"
      placeholder="Select department"
      option-label="name"
      option-value="id"
      filter
      :error="errors.department"
      required
    />

    <BaseCalendar
      v-model="form.hireDate"
      label="Hire Date"
      placeholder="Select hire date"
      :error="errors.hireDate"
      required
    />

    <BaseTextarea
      v-model="form.notes"
      label="Notes"
      placeholder="Enter notes"
      :rows="3"
      class="md:col-span-2"
    />

    <BaseCheckbox
      v-model="form.active"
      label="Active Employee"
      class="md:col-span-2"
    />
  </BaseForm>
</template>
```

### **Login Form Example**

```vue
<template>
  <BaseForm
    :loading="loading"
    submit-text="Sign In"
    :show-cancel="false"
    layout="vertical"
    @submit="handleLogin"
  >
    <BaseInput
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="Enter your email"
      icon="pi pi-envelope"
      :error="errors.email"
      required
    />

    <BasePassword
      v-model="form.password"
      label="Password"
      placeholder="Enter your password"
      icon="pi pi-lock"
      :error="errors.password"
      required
    />

    <BaseCheckbox v-model="form.rememberMe" label="Remember me" />
  </BaseForm>
</template>
```

## 🎨 **Styling Features**

### **Consistent Design System**

- **Colors**: Blue primary theme with semantic colors
- **Spacing**: Consistent padding and margins
- **Typography**: Clear hierarchy with proper font weights
- **Borders**: Subtle borders with focus states
- **Shadows**: Light shadows for depth
- **Transitions**: Smooth animations for interactions

### **Responsive Design**

- **Mobile-first**: Optimized for mobile devices
- **Grid layouts**: Flexible grid system
- **Adaptive sizing**: Components scale appropriately
- **Touch-friendly**: Proper touch targets

### **Accessibility**

- **ARIA labels**: Proper accessibility attributes
- **Keyboard navigation**: Full keyboard support
- **Focus management**: Clear focus indicators
- **Screen reader**: Compatible with screen readers

### **Validation States**

- **Error styling**: Clear error indicators
- **Success states**: Positive feedback
- **Loading states**: Loading indicators
- **Disabled states**: Clear disabled styling

## 🚀 **Benefits**

1. **Consistency**: Uniform look and feel across the application
2. **Reusability**: Components can be used anywhere in the app
3. **Maintainability**: Centralized styling and behavior
4. **Developer Experience**: Simple API with sensible defaults
5. **Performance**: Optimized components with minimal overhead
6. **Accessibility**: Built-in accessibility features
7. **Responsive**: Mobile-friendly design out of the box

## 📦 **Installation**

The components are automatically available when you import from the UI index:

```typescript
import {
  BaseForm,
  BaseInput,
  BaseTextarea,
  BaseDropdown,
  BasePassword,
  BaseCalendar,
  BaseCheckbox,
  BaseButton,
} from "@/components/ui";
```

## 🔧 **Customization**

You can customize the components by:

1. Modifying the component styles in their respective `.vue` files
2. Overriding CSS classes using Tailwind utilities
3. Extending components with additional props and functionality
4. Creating theme variations by modifying the CSS custom properties
