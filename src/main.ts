import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./style.css";

// PrimeVue
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";

// PrimeVue Components
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, { 
  ripple: true,
  unstyled: false,
  pt: {}
});
app.use(ConfirmationService);

// Global components
app.component("ConfirmDialog", ConfirmDialog);

// Initialize auth store
import { useAuthStore } from "./stores/auth";
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount("#app");
