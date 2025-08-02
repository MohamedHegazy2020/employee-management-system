import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { departmentsData, type Department } from "@/data";

export interface CreateDepartmentData {
  name: string;
  code: string;
  description: string;
  companyId: string;
  managerId?: string;
  budget: number;
  location: string;
  skills: string[];
}

export const useDepartmentsStore = defineStore("departments", () => {
  const departments = ref<Department[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const filters = ref({
    companyId: "",
    status: "",
  });

  const filteredDepartments = computed(() => {
    let filtered = departments.value;

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (department) =>
          department.name.toLowerCase().includes(query) ||
          department.code.toLowerCase().includes(query) ||
          department.description.toLowerCase().includes(query)
      );
    }

    // Company filter
    if (filters.value.companyId) {
      filtered = filtered.filter(
        (department) => department.companyId === filters.value.companyId
      );
    }

    // Status filter
    if (filters.value.status) {
      filtered = filtered.filter(
        (department) => department.status === filters.value.status
      );
    }

    // Add company name to each department
    return filtered.map(department => ({
      ...department,
      company: getCompanyName(department.companyId),
    }));
  });

  const paginatedDepartments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredDepartments.value.slice(start, end);
  });

  const totalPages = computed(() =>
    Math.ceil(filteredDepartments.value.length / itemsPerPage.value)
  );

  const totalDepartments = computed(() => filteredDepartments.value.length);

  const departmentsByCompany = computed(() => {
    const grouped: Record<string, Department[]> = {};
    departments.value.forEach((department) => {
      if (!grouped[department.companyId]) {
        grouped[department.companyId] = [];
      }
      grouped[department.companyId].push(department);
    });
    return grouped;
  });

  const totalBudget = computed(() => {
    return departments.value.reduce((sum, dept) => sum + dept.budget, 0);
  });

  const averageBudget = computed(() => {
    if (departments.value.length === 0) return 0;
    return totalBudget.value / departments.value.length;
  });

  const fetchDepartments = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Load data from JSON file
      departments.value = departmentsData.departments;
    } catch (err) {
      error.value = "Failed to fetch departments";
      console.error("Error fetching departments:", err);
    } finally {
      loading.value = false;
    }
  };

  const createDepartment = async (departmentData: CreateDepartmentData) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newDepartment: Department = {
        id: Date.now().toString(),
        ...departmentData,
        employeeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      };

      departments.value.push(newDepartment);
      return newDepartment;
    } catch (err) {
      error.value = "Failed to create department";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDepartment = async (
    id: string,
    departmentData: Partial<CreateDepartmentData>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const index = departments.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        departments.value[index] = {
          ...departments.value[index],
          ...departmentData,
          updatedAt: new Date().toISOString(),
        };
        return departments.value[index];
      }
      throw new Error("Department not found");
    } catch (err) {
      error.value = "Failed to update department";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteDepartment = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = departments.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        departments.value.splice(index, 1);
      }
    } catch (err) {
      error.value = "Failed to delete department";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getDepartmentById = (id: string) => {
    return departments.value.find((d) => d.id === id);
  };

  const getDepartmentsByCompany = (companyId: string) => {
    return departments.value.filter((d) => d.companyId === companyId);
  };

  const getDepartmentByCode = (code: string) => {
    return departments.value.find((d) => d.code === code);
  };

  const getCompanyName = (companyId: string) => {
    // This would typically come from a companies store
    // For now, we'll use a simple mapping
    const companyMap: Record<string, string> = {
      "1": "TechCorp",
      "2": "Global Industries",
      "3": "Innovation Labs",
      "4": "Future Systems",
      "5": "Digital Solutions",
    };
    return companyMap[companyId] || "Unknown Company";
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
      status: "",
    };
    currentPage.value = 1;
  };

  return {
    departments,
    loading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filters,
    filteredDepartments,
    paginatedDepartments,
    totalPages,
    totalDepartments,
    departmentsByCompany,
    totalBudget,
    averageBudget,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    getDepartmentsByCompany,
    getDepartmentByCode,
    setSearchQuery,
    setPage,
    setFilters,
    clearFilters,
  };
});
