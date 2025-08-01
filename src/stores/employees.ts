import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { employeesData, type Employee } from "@/data";

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hireDate: string;
  position: string;
  department: string;
  companyId: string;
  managerId?: string;
  salary: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  certifications: string[];
}

export const useEmployeesStore = defineStore("employees", () => {
  const employees = ref<Employee[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const filters = ref({
    companyId: "",
    department: "",
    status: "",
  });

  const filteredEmployees = computed(() => {
    let filtered = employees.value;

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(query) ||
          employee.lastName.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query)
      );
    }

    // Company filter
    if (filters.value.companyId) {
      filtered = filtered.filter(
        (employee) => employee.companyId === filters.value.companyId
      );
    }

    // Department filter
    if (filters.value.department) {
      filtered = filtered.filter(
        (employee) => employee.department === filters.value.department
      );
    }

    // Status filter
    if (filters.value.status) {
      filtered = filtered.filter(
        (employee) => employee.status === filters.value.status
      );
    }

    return filtered;
  });

  const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredEmployees.value.slice(start, end);
  });

  const totalPages = computed(() =>
    Math.ceil(filteredEmployees.value.length / itemsPerPage.value)
  );

  const totalEmployees = computed(() => filteredEmployees.value.length);

  const employeesByCompany = computed(() => {
    const grouped: Record<string, Employee[]> = {};
    employees.value.forEach((employee) => {
      if (!grouped[employee.companyId]) {
        grouped[employee.companyId] = [];
      }
      grouped[employee.companyId].push(employee);
    });
    return grouped;
  });

  const employeesByDepartment = computed(() => {
    const grouped: Record<string, Employee[]> = {};
    employees.value.forEach((employee) => {
      if (!grouped[employee.department]) {
        grouped[employee.department] = [];
      }
      grouped[employee.department].push(employee);
    });
    return grouped;
  });

  const fetchEmployees = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Load data from JSON file
      employees.value = employeesData.employees;
    } catch (err) {
      error.value = "Failed to fetch employees";
      console.error("Error fetching employees:", err);
    } finally {
      loading.value = false;
    }
  };

  const createEmployee = async (employeeData: CreateEmployeeData) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeData,
        status: "active",
        avatar: `/avatars/${employeeData.firstName.toLowerCase()}-${employeeData.lastName.toLowerCase()}.jpg`,
        performanceRating: 0,
        lastReviewDate: new Date().toISOString(),
      };

      employees.value.push(newEmployee);
      return newEmployee;
    } catch (err) {
      error.value = "Failed to create employee";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEmployee = async (
    id: string,
    employeeData: Partial<CreateEmployeeData>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const index = employees.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        employees.value[index] = {
          ...employees.value[index],
          ...employeeData,
        };
        return employees.value[index];
      }
      throw new Error("Employee not found");
    } catch (err) {
      error.value = "Failed to update employee";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEmployee = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = employees.value.findIndex((e) => e.id === id);
      if (index !== -1) {
        employees.value.splice(index, 1);
      }
    } catch (err) {
      error.value = "Failed to delete employee";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getEmployeeById = (id: string) => {
    return employees.value.find((e) => e.id === id);
  };

  const getEmployeesByCompany = (companyId: string) => {
    return employees.value.filter((e) => e.companyId === companyId);
  };

  const getEmployeesByDepartment = (department: string) => {
    return employees.value.filter((e) => e.department === department);
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const setPage = (page: number) => {
    currentPage.value = page;
  };

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = { ...filters.value, ...newFilters };
    currentPage.value = 1;
  };

  const clearFilters = () => {
    filters.value = {
      companyId: "",
      department: "",
      status: "",
    };
    currentPage.value = 1;
  };

  return {
    employees,
    loading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filters,
    filteredEmployees,
    paginatedEmployees,
    totalPages,
    totalEmployees,
    employeesByCompany,
    employeesByDepartment,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeesByCompany,
    getEmployeesByDepartment,
    setSearchQuery,
    setPage,
    setFilters,
    clearFilters,
  };
}); 