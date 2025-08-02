<template>
  <div class="table-cell">
    <!-- Text Cell -->
    <div v-if="type === 'text'" class="text-cell">
      <span class="text-sm text-gray-900">{{ value }}</span>
    </div>

    <!-- Number Cell -->
    <div v-else-if="type === 'number'" class="number-cell">
      <span class="text-sm font-medium text-gray-900">{{
        formatNumber(value)
      }}</span>
    </div>

    <!-- Date Cell -->
    <div v-else-if="type === 'date'" class="date-cell">
      <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
    </div>

    <!-- Status Cell -->
    <div v-else-if="type === 'status'" class="status-cell">
      <Tag
        :value="value"
        :severity="getStatusSeverity(value)"
        class="font-medium"
      />
    </div>

    <!-- Avatar Cell -->
    <div v-else-if="type === 'avatar'" class="avatar-cell">
      <div class="flex items-center">
        <Avatar
          v-bind="getAvatarProps(data.name || data.title, undefined, data.avatar || data.image)"
          size="small"
          shape="circle"
          class="mr-3"
        />
        <div>
          <div class="text-sm font-medium text-gray-900">
            {{ data.name || data.title }}
          </div>
          <div v-if="data.subtitle" class="text-xs text-gray-500">
            {{ data.subtitle }}
          </div>
        </div>
      </div>
    </div>

    <!-- Badge Cell -->
    <div v-else-if="type === 'badge'" class="badge-cell">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getBadgeClasses(value)"
      >
        {{ value }}
      </span>
    </div>

    <!-- Progress Cell -->
    <div v-else-if="type === 'progress'" class="progress-cell">
      <div class="flex items-center">
        <div class="flex-1 mr-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="getProgressClasses(value)"
              :style="{ width: `${value}%` }"
            ></div>
          </div>
        </div>
        <span class="text-sm font-medium text-gray-900">{{ value }}%</span>
      </div>
    </div>

    <!-- Currency Cell -->
    <div v-else-if="type === 'currency'" class="currency-cell">
      <span class="text-sm font-medium text-gray-900">{{
        formatCurrency(value)
      }}</span>
    </div>

    <!-- Default Cell -->
    <div v-else class="default-cell">
      <span class="text-sm text-gray-900">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Avatar from "primevue/avatar";
import Tag from "primevue/tag";
import { getAvatarProps } from "@/utils/avatar";

interface Props {
  value: any;
  type?:
    | "text"
    | "number"
    | "date"
    | "status"
    | "avatar"
    | "badge"
    | "progress"
    | "currency";
  data?: any;
  column?: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

// Methods
const formatNumber = (value: number) => {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat().format(value);
};

const formatDate = (value: string | Date) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value: number) => {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const getStatusSeverity = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "success",
    inactive: "danger",
    pending: "warning",
    completed: "success",
    cancelled: "danger",
    draft: "info",
    published: "success",
    archived: "secondary",
  };
  return statusMap[status.toLowerCase()] || "info";
};

const getBadgeClasses = (value: string) => {
  const badgeMap: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    manager: "bg-blue-100 text-blue-800",
    employee: "bg-green-100 text-green-800",
    intern: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
    urgent: "bg-red-100 text-red-800",
    normal: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800",
  };
  return badgeMap[value.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const getProgressClasses = (value: number) => {
  if (value >= 80) return "bg-green-500";
  if (value >= 60) return "bg-blue-500";
  if (value >= 40) return "bg-yellow-500";
  return "bg-red-500";
};
</script>

<style scoped>
.table-cell {
  display: flex;
  align-items: center;
}

.text-cell {
  color: rgb(55 65 81);
}

.number-cell {
  font-weight: 500;
  color: rgb(17 24 39);
}

.date-cell {
  color: rgb(107 114 128);
}

.status-cell {
  display: flex;
  align-items: center;
}

.avatar-cell {
  display: flex;
  align-items: center;
}

.badge-cell {
  display: flex;
  align-items: center;
}

.progress-cell {
  width: 100%;
}

.currency-cell {
  font-weight: 500;
  color: rgb(17 24 39);
}

.default-cell {
  color: rgb(55 65 81);
}

/* Enhanced Tag styling */
.status-cell :deep(.p-tag) {
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border: none;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.status-cell :deep(.p-tag.p-tag-success) {
  background: linear-gradient(135deg, rgb(34 197 94) 0%, rgb(22 163 74) 100%);
  color: rgb(255 255 255);
}

.status-cell :deep(.p-tag.p-tag-danger) {
  background: linear-gradient(135deg, rgb(239 68 68) 0%, rgb(220 38 38) 100%);
  color: rgb(255 255 255);
}

.status-cell :deep(.p-tag.p-tag-warning) {
  background: linear-gradient(135deg, rgb(234 179 8) 0%, rgb(202 138 4) 100%);
  color: rgb(255 255 255);
}

.status-cell :deep(.p-tag.p-tag-info) {
  background: linear-gradient(135deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%);
  color: rgb(255 255 255);
}

.status-cell :deep(.p-tag.p-tag-secondary) {
  background: linear-gradient(135deg, rgb(107 114 128) 0%, rgb(75 85 99) 100%);
  color: rgb(255 255 255);
}

/* Enhanced Avatar styling */
.avatar-cell :deep(.p-avatar) {
  border: 2px solid rgb(229 231 235);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
  transition: all 0.2s;
}

.avatar-cell :deep(.p-avatar:hover) {
  border-color: rgb(59 130 246);
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Progress bar animation */
.progress-cell .h-2 > div {
  transition: width 0.5s ease-out;
}

/* Badge hover effects */
.badge-cell span {
  transition: all 0.2s;
}

.badge-cell span:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
}
</style>
