import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { usersData, type User } from "@/data";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Omit<User, 'password'> | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || "employee");

  // Mock API calls - replace with actual API endpoints
  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in JSON data
      const foundUser = usersData.users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!foundUser) {
        throw new Error("Invalid credentials");
      }

      // Create user object without password for security
      const userWithoutPassword: Omit<User, 'password'> = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        avatar: foundUser.avatar,
        companyId: foundUser.companyId,
        departmentId: foundUser.departmentId,
        lastLogin: foundUser.lastLogin,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        status: foundUser.status,
        permissions: foundUser.permissions,
      };

      const mockToken = "mock-jwt-token-" + Date.now();

      user.value = userWithoutPassword;
      token.value = mockToken;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (err) {
      error.value = "Invalid credentials";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const clearError = () => {
    error.value = null;
  };

  const forgotPassword = async (email: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success response
      return { message: "Password reset email sent successfully" };
    } catch (err) {
      error.value = "Failed to send reset email";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success response
      return { message: "Password reset successfully" };
    } catch (err) {
      error.value = "Failed to reset password";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user.value) {
        user.value = { ...user.value, ...profileData };
        localStorage.setItem("user", JSON.stringify(user.value));
      }

      return user.value;
    } catch (err) {
      error.value = "Failed to update profile";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Initialize user from localStorage on app start
  const initializeAuth = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser);
      } catch {
        logout();
      }
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout,
    clearError,
    forgotPassword,
    resetPassword,
    updateProfile,
    initializeAuth,
  };
});
