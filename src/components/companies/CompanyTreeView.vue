<template>
  <div class="space-y-2">
    <div
      v-for="company in companies"
      :key="company.id"
      class="company-tree-item"
    >
      <div
        class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <button
          v-if="company.children && company.children.length > 0"
          @click="toggleExpanded(company.id)"
          class="mr-2 p-1 hover:bg-gray-200 rounded"
        >
          <ChevronRightIcon
            v-if="!expandedItems.includes(company.id)"
            class="w-4 h-4 text-gray-500"
          />
          <ChevronDownIcon v-else class="w-4 h-4 text-gray-500" />
        </button>
        <div v-else class="w-6 mr-2"></div>

        <div class="flex-shrink-0 h-8 w-8">
          <div
            class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <BuildingOfficeIcon class="w-4 h-4 text-primary-600" />
          </div>
        </div>

        <div class="ml-3 flex-1">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900">
                {{ company.name }}
              </h4>
              <p class="text-xs text-gray-500">{{ company.code }}</p>
            </div>
            <div class="flex items-center space-x-4 text-xs text-gray-500">
              <span>{{ company.employeeCount }} employees</span>
              <span>{{ company.departmentCount }} departments</span>
              <div class="flex items-center space-x-1">
                <router-link
                  :to="`/companies/${company.id}`"
                  class="text-primary-600 hover:text-primary-500"
                >
                  View
                </router-link>
                <span>•</span>
                <router-link
                  :to="`/companies/${company.id}/edit`"
                  class="text-gray-600 hover:text-gray-900"
                >
                  Edit
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Children -->
      <div
        v-if="expandedItems.includes(company.id) && company.children && company.children.length > 0"
        class="ml-6 mt-2 space-y-2"
      >
        <CompanyTreeView :companies="company.children" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BuildingOfficeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

defineOptions({ name: 'CompanyTreeView' });

interface Company {
  id: string;
  name: string;
  code: string;
  employeeCount: number;
  departmentCount: number;
  children?: Company[];
}

const props = defineProps<{ companies: Company[] }>();
const expandedItems = ref<string[]>([]);

const toggleExpanded = (companyId: string) => {
  const index = expandedItems.value.indexOf(companyId);
  if (index > -1) {
    expandedItems.value.splice(index, 1);
  } else {
    expandedItems.value.push(companyId);
  }
};
</script>

<style scoped>
.company-tree-item {
  position: relative;
}

.company-tree-item::before {
  content: "";
  position: absolute;
  left: 1.5rem;
  top: 2.5rem;
  bottom: -0.5rem;
  width: 1px;
  background-color: #e5e7eb;
}
</style>
