import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: () => import("@/views/auth/ForgotPasswordView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/reset-password",
      name: "ResetPassword",
      component: () => import("@/views/auth/ResetPasswordView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/",
      component: () => import("@/layouts/AppLayout.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/DashboardView.vue"),
        },
        {
          path: "companies",
          name: "Companies",
          component: () => import("@/views/companies/CompaniesView.vue"),
        },
        {
          path: "companies/create",
          name: "CreateCompany",
          component: () => import("@/views/companies/CreateCompanyView.vue"),
        },
        {
          path: "companies/:id",
          name: "CompanyDetail",
          component: () => import("@/views/companies/CompanyDetailView.vue"),
        },
        {
          path: "companies/:id/edit",
          name: "EditCompany",
          component: () => import("@/views/companies/EditCompanyView.vue"),
        },
        {
          path: "departments",
          name: "Departments",
          component: () => import("@/views/departments/DepartmentsView.vue"),
        },
        {
          path: "departments/create",
          name: "CreateDepartment",
          component: () =>
            import("@/views/departments/CreateDepartmentView.vue"),
        },
        {
          path: "departments/:id",
          name: "DepartmentDetail",
          component: () =>
            import("@/views/departments/DepartmentDetailView.vue"),
        },
        {
          path: "departments/:id/edit",
          name: "EditDepartment",
          component: () => import("@/views/departments/EditDepartmentView.vue"),
        },
        {
          path: "employees",
          name: "Employees",
          component: () => import("@/views/employees/EmployeesView.vue"),
        },
        {
          path: "employees/create",
          name: "CreateEmployee",
          component: () => import("@/views/employees/CreateEmployeeView.vue"),
        },
        {
          path: "employees/:id",
          name: "EmployeeDetail",
          component: () => import("@/views/employees/EmployeeDetailView.vue"),
        },
        {
          path: "employees/:id/edit",
          name: "EditEmployee",
          component: () => import("@/views/employees/EditEmployeeView.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/ProfileView.vue"),
        },
        {
          path: "settings",
          name: "Settings",
          component: () => import("@/views/SettingsView.vue"),
        },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
