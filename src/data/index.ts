// Data exports
export { default as companiesData } from "./companies.json";
export { default as employeesData } from "./employees.json";
export { default as departmentsData } from "./departments.json";
export { default as usersData } from "./users.json";

// Data types
export interface Company {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  employeeCount: number;
  departmentCount: number;
  industry: string;
  size: string;
  status: string;
  description: string;
}

export interface Employee {
  id: string;
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
  status: string;
  avatar: string;
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
  performanceRating: number;
  lastReviewDate: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  companyId: string;
  managerId?: string;
  budget: number;
  employeeCount: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  skills: string[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  companyId: string;
  departmentId: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  permissions: string[];
}
