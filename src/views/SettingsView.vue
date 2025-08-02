<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="mt-1 text-sm text-gray-600">
        Configure system settings and preferences.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Appearance Settings -->
      <Card class="p-6">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-palette text-blue-600 mr-2"></i>
            Appearance
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <BaseDropdown
                v-model="settings.theme"
                :options="themeOptions"
                placeholder="Select theme"
                @change="handleThemeChange"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <BaseDropdown
                v-model="settings.colorScheme"
                :options="colorSchemeOptions"
                placeholder="Select color scheme"
                @change="handleColorSchemeChange"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <BaseDropdown
                v-model="settings.fontSize"
                :options="fontSizeOptions"
                placeholder="Select font size"
                @change="handleFontSizeChange"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Notification Settings -->
      <Card class="p-6">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-bell text-green-600 mr-2"></i>
            Notifications
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p class="text-xs text-gray-500">
                  Receive email notifications for important updates
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.emailNotifications"
                @change="handleEmailNotificationsChange"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Browser Notifications
                </label>
                <p class="text-xs text-gray-500">
                  Show browser notifications for real-time updates
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.browserNotifications"
                @change="handleBrowserNotificationsChange"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Sound Alerts
                </label>
                <p class="text-xs text-gray-500">
                  Play sound for notifications
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.soundAlerts"
                @change="handleSoundAlertsChange"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Data Settings -->
      <Card class="p-6">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-database text-purple-600 mr-2"></i>
            Data & Privacy
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Items Per Page
              </label>
              <BaseDropdown
                v-model="settings.itemsPerPage"
                :options="itemsPerPageOptions"
                placeholder="Select items per page"
                @change="handleItemsPerPageChange"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Auto Save
                </label>
                <p class="text-xs text-gray-500">
                  Automatically save form data
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.autoSave"
                @change="handleAutoSaveChange"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Data Export
                </label>
                <p class="text-xs text-gray-500">
                  Allow data export functionality
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.dataExport"
                @change="handleDataExportChange"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Security Settings -->
      <Card class="p-6">
        <template #title>
          <div class="flex items-center">
            <i class="pi pi-shield text-red-600 mr-2"></i>
            Security
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
                <p class="text-xs text-gray-500">
                  Enable 2FA for enhanced security
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.twoFactorAuth"
                @change="handleTwoFactorAuthChange"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Session Timeout
                </label>
                <p class="text-xs text-gray-500">
                  Auto-logout after inactivity
                </p>
              </div>
              <BaseCheckbox
                v-model="settings.sessionTimeout"
                @change="handleSessionTimeoutChange"
              />
            </div>

            <div>
              <BaseButton
                label="Change Password"
                icon="pi pi-key"
                variant="secondary"
                size="medium"
                @click="handleChangePassword"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Save Settings -->
    <div class="flex justify-end space-x-3">
      <BaseButton
        label="Reset to Defaults"
        icon="pi pi-refresh"
        variant="secondary"
        size="medium"
        @click="resetSettings"
      />
      <BaseButton
        label="Save Settings"
        icon="pi pi-check"
        variant="primary"
        size="medium"
        :loading="saving"
        @click="saveSettings"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import { BaseButton, BaseDropdown, BaseCheckbox } from "@/components/ui";

const confirm = useConfirm();
const toast = useToast();

// Settings state
const settings = reactive({
  theme: "light",
  colorScheme: "blue",
  fontSize: "medium",
  emailNotifications: true,
  browserNotifications: false,
  soundAlerts: true,
  itemsPerPage: 10,
  autoSave: true,
  dataExport: true,
  twoFactorAuth: false,
  sessionTimeout: true,
});

const saving = ref(false);

// Options
const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Auto", value: "auto" },
];

const colorSchemeOptions = [
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Purple", value: "purple" },
  { label: "Orange", value: "orange" },
];

const fontSizeOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const itemsPerPageOptions = [
  { label: "10 items", value: 10 },
  { label: "25 items", value: 25 },
  { label: "50 items", value: 50 },
  { label: "100 items", value: 100 },
];

// Methods
const handleThemeChange = (value: string) => {
  console.log("Theme changed to:", value);
  // Implement theme switching logic
};

const handleColorSchemeChange = (value: string) => {
  console.log("Color scheme changed to:", value);
  // Implement color scheme switching logic
};

const handleFontSizeChange = (value: string) => {
  console.log("Font size changed to:", value);
  // Implement font size switching logic
};

const handleEmailNotificationsChange = (value: boolean) => {
  console.log("Email notifications:", value);
};

const handleBrowserNotificationsChange = (value: boolean) => {
  console.log("Browser notifications:", value);
};

const handleSoundAlertsChange = (value: boolean) => {
  console.log("Sound alerts:", value);
};

const handleItemsPerPageChange = (value: number) => {
  console.log("Items per page:", value);
};

const handleAutoSaveChange = (value: boolean) => {
  console.log("Auto save:", value);
};

const handleDataExportChange = (value: boolean) => {
  console.log("Data export:", value);
};

const handleTwoFactorAuthChange = (value: boolean) => {
  console.log("Two-factor auth:", value);
};

const handleSessionTimeoutChange = (value: boolean) => {
  console.log("Session timeout:", value);
};

const handleChangePassword = () => {
  confirm.require({
    message: "Are you sure you want to change your password?",
    header: "Change Password",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      // Implement password change logic
      toast.add({
        severity: "info",
        summary: "Password Change",
        detail: "Password change functionality will be implemented here.",
        life: 3000,
      });
    },
  });
};

const resetSettings = () => {
  confirm.require({
    message: "Are you sure you want to reset all settings to defaults?",
    header: "Reset Settings",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      // Reset to defaults
      Object.assign(settings, {
        theme: "light",
        colorScheme: "blue",
        fontSize: "medium",
        emailNotifications: true,
        browserNotifications: false,
        soundAlerts: true,
        itemsPerPage: 10,
        autoSave: true,
        dataExport: true,
        twoFactorAuth: false,
        sessionTimeout: true,
      });
      
      toast.add({
        severity: "success",
        summary: "Settings Reset",
        detail: "All settings have been reset to defaults.",
        life: 3000,
      });
    },
  });
};

const saveSettings = async () => {
  saving.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save settings to localStorage or API
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    toast.add({
      severity: "success",
      summary: "Settings Saved",
      detail: "Your settings have been saved successfully.",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to save settings. Please try again.",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

// Load settings on component mount
const loadSettings = () => {
  const savedSettings = localStorage.getItem("userSettings");
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      Object.assign(settings, parsedSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }
};

// Load settings when component mounts
loadSettings();
</script> 