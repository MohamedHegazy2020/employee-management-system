<template>
  <div class="p-6 space-y-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900">Dropdown Test Component</h2>
    
    <!-- Basic Dropdown Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Dropdown</h3>
      <BaseDropdown
        v-model="selectedValue"
        :options="options"
        label="Select an option"
        placeholder="Choose an option..."
        @change="handleChange"
      />
      <p class="text-sm text-gray-600">Selected: {{ selectedValue }}</p>
    </div>

    <!-- Filter Dropdown Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Filter Dropdown</h3>
      <BaseDropdown
        v-model="selectedFilterValue"
        :options="filterOptions"
        label="Filter options"
        placeholder="Search and select..."
        :filter="true"
        filter-placeholder="Search options..."
        :show-clear="true"
        @change="handleFilterChange"
      />
      <p class="text-sm text-gray-600">Selected: {{ selectedFilterValue }}</p>
    </div>

    <!-- Error State Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Error State</h3>
      <BaseDropdown
        v-model="errorValue"
        :options="options"
        label="Error dropdown"
        placeholder="This has an error"
        error="This field is required"
        @change="handleErrorChange"
      />
    </div>

    <!-- Disabled State Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Disabled State</h3>
      <BaseDropdown
        v-model="disabledValue"
        :options="options"
        label="Disabled dropdown"
        placeholder="This is disabled"
        :disabled="true"
      />
    </div>

    <!-- Size Variants Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Size Variants</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseDropdown
          v-model="smallValue"
          :options="options"
          label="Small"
          placeholder="Small dropdown"
          size="small"
        />
        <BaseDropdown
          v-model="mediumValue"
          :options="options"
          label="Medium"
          placeholder="Medium dropdown"
          size="medium"
        />
        <BaseDropdown
          v-model="largeValue"
          :options="options"
          label="Large"
          placeholder="Large dropdown"
          size="large"
        />
      </div>
    </div>

    <!-- Complex Options Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Complex Options (with option-label/value)</h3>
      <BaseDropdown
        v-model="complexValue"
        :options="complexOptions"
        label="Complex Options"
        placeholder="Select a user..."
        option-label="name"
        option-value="id"
        :filter="true"
        filter-placeholder="Search users..."
        :show-clear="true"
        @change="handleComplexChange"
      />
      <p class="text-sm text-gray-600">Selected: {{ complexValue }}</p>
    </div>

    <!-- Loading State Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Loading State</h3>
      <BaseDropdown
        v-model="loadingValue"
        :options="loadingOptions"
        label="Loading dropdown"
        placeholder="Loading options..."
        :loading="true"
      />
    </div>

    <!-- Required Field Test -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Required Field</h3>
      <BaseDropdown
        v-model="requiredValue"
        :options="options"
        label="Required dropdown"
        placeholder="This field is required"
        :required="true"
        @change="handleRequiredChange"
      />
    </div>

    <!-- Test Results -->
    <div class="space-y-4 mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold">Test Results</h3>
      <div class="space-y-2 text-sm">
        <p><strong>Basic:</strong> {{ selectedValue || 'None' }}</p>
        <p><strong>Filter:</strong> {{ selectedFilterValue || 'None' }}</p>
        <p><strong>Complex:</strong> {{ complexValue || 'None' }}</p>
        <p><strong>Required:</strong> {{ requiredValue || 'None' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BaseDropdown } from './index';

// Test data
const options = ref([
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
]);

const filterOptions = ref([
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
]);

const complexOptions = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin' },
]);

const loadingOptions = ref([]);

// Reactive values
const selectedValue = ref(null);
const selectedFilterValue = ref(null);
const errorValue = ref(null);
const disabledValue = ref(null);
const smallValue = ref(null);
const mediumValue = ref(null);
const largeValue = ref(null);
const complexValue = ref(null);
const loadingValue = ref(null);
const requiredValue = ref(null);

// Event handlers
const handleChange = (event: any) => {
  console.log('Basic dropdown changed:', event);
};

const handleFilterChange = (event: any) => {
  console.log('Filter dropdown changed:', event);
};

const handleErrorChange = (event: any) => {
  console.log('Error dropdown changed:', event);
};

const handleComplexChange = (event: any) => {
  console.log('Complex dropdown changed:', event);
};

const handleRequiredChange = (event: any) => {
  console.log('Required dropdown changed:', event);
};
</script> 