import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { companiesData, type Company } from "@/data";

export interface CreateCompanyData {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  parentId?: string;
}

export const useCompaniesStore = defineStore("companies", () => {
  const companies = ref<Company[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const filteredCompanies = computed(() => {
    if (!searchQuery.value) return companies.value;

    const query = searchQuery.value.toLowerCase();
    return companies.value.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.code.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query)
    );
  });

  const paginatedCompanies = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCompanies.value.slice(start, end);
  });

  const totalPages = computed(() =>
    Math.ceil(filteredCompanies.value.length / itemsPerPage.value)
  );

  const companyTree = computed(() => {
    const companyMap = new Map<string, Company & { children: Company[] }>();

    // Initialize all companies with empty children array
    companies.value.forEach((company) => {
      companyMap.set(company.id, { ...company, children: [] });
    });

    // Build tree structure
    const rootCompanies: (Company & { children: Company[] })[] = [];

    companies.value.forEach((company) => {
      const companyWithChildren = companyMap.get(company.id)!;

      if (company.parentId && companyMap.has(company.parentId)) {
        const parent = companyMap.get(company.parentId)!;
        parent.children.push(companyWithChildren);
      } else {
        rootCompanies.push(companyWithChildren);
      }
    });

    return rootCompanies;
  });

  const fetchCompanies = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      companies.value = companiesData.companies;
    } catch (err) {
      error.value = "Failed to fetch companies";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createCompany = async (companyData: CreateCompanyData) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCompany: Company = {
        id: Date.now().toString(),
        ...companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employeeCount: 0,
        departmentCount: 0,
      };

      companies.value.push(newCompany);
      return newCompany;
    } catch (err) {
      error.value = "Failed to create company";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCompany = async (
    id: string,
    companyData: Partial<CreateCompanyData>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const index = companies.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        companies.value[index] = {
          ...companies.value[index],
          ...companyData,
          updatedAt: new Date().toISOString(),
        };
        return companies.value[index];
      }
      throw new Error("Company not found");
    } catch (err) {
      error.value = "Failed to update company";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCompany = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const index = companies.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        companies.value.splice(index, 1);
      }
    } catch (err) {
      error.value = "Failed to delete company";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getCompanyById = (id: string) => {
    return companies.value.find((c) => c.id === id);
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const setPage = (page: number) => {
    currentPage.value = page;
  };

  return {
    companies,
    loading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredCompanies,
    paginatedCompanies,
    totalPages,
    companyTree,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    setSearchQuery,
    setPage,
  };
});
