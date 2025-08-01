# Data Structure Documentation

This directory contains all the JSON data files used by the Employee Management System. The data is organized into separate files for better maintainability and scalability.

## 📁 File Structure

```
src/data/
├── companies.json      # Company data
├── employees.json      # Employee data
├── departments.json    # Department data
├── users.json         # User authentication data
├── index.ts           # Data exports and types
└── README.md          # This documentation
```

## 🏢 Companies Data (`companies.json`)

### Structure

```json
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "address": "string",
      "phone": "string",
      "email": "string",
      "website": "string (optional)",
      "parentId": "string (optional)",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "employeeCount": "number",
      "departmentCount": "number",
      "industry": "string",
      "size": "string",
      "status": "string",
      "description": "string"
    }
  ]
}
```

### Fields Description

- **id**: Unique identifier for the company
- **name**: Company name
- **code**: Company code/abbreviation
- **address**: Full company address
- **phone**: Contact phone number
- **email**: Contact email address
- **website**: Company website URL (optional)
- **parentId**: ID of parent company for subsidiaries (optional)
- **createdAt**: Company creation date
- **updatedAt**: Last update date
- **employeeCount**: Number of employees
- **departmentCount**: Number of departments
- **industry**: Industry sector
- **size**: Company size (Small, Medium, Large)
- **status**: Company status (active, inactive, etc.)
- **description**: Company description

## 👥 Employees Data (`employees.json`)

### Structure

```json
{
  "employees": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "dateOfBirth": "YYYY-MM-DD",
      "hireDate": "YYYY-MM-DD",
      "position": "string",
      "department": "string",
      "companyId": "string",
      "managerId": "string (optional)",
      "salary": "number",
      "status": "string",
      "avatar": "string",
      "address": {
        "street": "string",
        "city": "string",
        "state": "string",
        "zipCode": "string",
        "country": "string"
      },
      "emergencyContact": {
        "name": "string",
        "relationship": "string",
        "phone": "string"
      },
      "skills": ["string array"],
      "certifications": ["string array"],
      "performanceRating": "number",
      "lastReviewDate": "ISO date string"
    }
  ]
}
```

### Fields Description

- **id**: Unique identifier for the employee
- **firstName**: Employee's first name
- **lastName**: Employee's last name
- **email**: Employee's email address
- **phone**: Employee's phone number
- **dateOfBirth**: Employee's date of birth
- **hireDate**: Employee's hire date
- **position**: Job position/title
- **department**: Department name
- **companyId**: ID of the company the employee works for
- **managerId**: ID of the employee's manager (optional)
- **salary**: Annual salary
- **status**: Employment status (active, inactive, etc.)
- **avatar**: Profile picture URL
- **address**: Complete address object
- **emergencyContact**: Emergency contact information
- **skills**: Array of employee skills
- **certifications**: Array of professional certifications
- **performanceRating**: Performance rating (0-5)
- **lastReviewDate**: Date of last performance review

## 🏢 Departments Data (`departments.json`)

### Structure

```json
{
  "departments": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "companyId": "string",
      "managerId": "string (optional)",
      "budget": "number",
      "employeeCount": "number",
      "location": "string",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "status": "string",
      "skills": ["string array"]
    }
  ]
}
```

### Fields Description

- **id**: Unique identifier for the department
- **name**: Department name
- **code**: Department code/abbreviation
- **description**: Department description
- **companyId**: ID of the company the department belongs to
- **managerId**: ID of the department manager (optional)
- **budget**: Annual department budget
- **employeeCount**: Number of employees in the department
- **location**: Department location
- **createdAt**: Department creation date
- **updatedAt**: Last update date
- **status**: Department status (active, inactive, etc.)
- **skills**: Array of skills required for the department

## 👤 Users Data (`users.json`)

### Structure

```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "password": "string",
      "name": "string",
      "role": "string",
      "avatar": "string",
      "companyId": "string",
      "departmentId": "string",
      "lastLogin": "ISO date string",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "status": "string",
      "permissions": ["string array"]
    }
  ]
}
```

### Fields Description

- **id**: Unique identifier for the user
- **email**: User's email address (used for login)
- **password**: User's password (should be hashed in production)
- **name**: User's full name
- **role**: User role (admin, manager, employee)
- **avatar**: Profile picture URL
- **companyId**: ID of the company the user belongs to
- **departmentId**: ID of the department the user belongs to
- **lastLogin**: Last login date
- **createdAt**: User creation date
- **updatedAt**: Last update date
- **status**: User status (active, inactive, etc.)
- **permissions**: Array of user permissions

## 🔗 Relationships

### Company Hierarchy

- Companies can have parent companies (subsidiaries)
- Parent companies are referenced by `parentId` field
- Root companies have `parentId: null`

### Employee Relationships

- Employees belong to a company (`companyId`)
- Employees can have managers (`managerId`)
- Managers are also employees (self-referencing)

### Department Relationships

- Departments belong to a company (`companyId`)
- Departments can have managers (`managerId`)
- Department managers are employees

### User Relationships

- Users belong to a company (`companyId`)
- Users belong to a department (`departmentId`)
- Users can be employees (linked by email or ID)

## 📊 Data Statistics

### Current Data Counts

- **Companies**: 8 companies across different industries
- **Employees**: 10 employees with diverse roles
- **Departments**: 12 departments across all companies
- **Users**: 5 users with different roles and permissions

### Industry Distribution

- Technology: 3 companies
- Healthcare: 1 company
- Finance: 1 company
- Retail: 1 company
- Education: 1 company
- Energy: 1 company

### Company Sizes

- Small (1-50 employees): 2 companies
- Medium (51-200 employees): 4 companies
- Large (200+ employees): 2 companies

## 🔧 Usage in Stores

### Companies Store

```typescript
import { companiesData, type Company } from "@/data";

// Load data
companies.value = companiesData.companies;
```

### Employees Store

```typescript
import { employeesData, type Employee } from "@/data";

// Load data
employees.value = employeesData.employees;
```

### Departments Store

```typescript
import { departmentsData, type Department } from "@/data";

// Load data
departments.value = departmentsData.departments;
```

### Auth Store

```typescript
import { usersData, type User } from "@/data";

// Find user for authentication
const foundUser = usersData.users.find(
  (u) => u.email === credentials.email && u.password === credentials.password
);
```

## 🔒 Security Considerations

### Production Recommendations

1. **Password Hashing**: Passwords should be hashed using bcrypt or similar
2. **Environment Variables**: Sensitive data should be moved to environment variables
3. **API Integration**: Replace JSON files with actual API calls
4. **Data Validation**: Implement proper data validation
5. **Access Control**: Implement proper role-based access control

### Development Notes

- Current passwords are plain text for development purposes
- All data is stored in JSON files for easy development and testing
- Data can be easily modified for testing different scenarios

## 📝 Data Management

### Adding New Data

1. Add new entries to the appropriate JSON file
2. Ensure all required fields are provided
3. Maintain data consistency across related entities
4. Update this documentation if schema changes

### Data Validation

- All IDs should be unique within their respective collections
- Foreign key references should be valid
- Date formats should be consistent (ISO 8601)
- Required fields should not be null or empty

### Data Migration

When moving to production:

1. Export JSON data to database
2. Implement proper data validation
3. Set up data backup and recovery procedures
4. Implement data versioning if needed

## 🚀 Future Enhancements

### Planned Features

- **Data Versioning**: Track changes to data over time
- **Data Export**: Export data in various formats (CSV, Excel, PDF)
- **Data Import**: Import data from external sources
- **Data Analytics**: Advanced reporting and analytics
- **Real-time Sync**: Real-time data synchronization
- **Data Backup**: Automated backup and recovery

### Scalability Considerations

- **Database Migration**: Move from JSON to proper database
- **Caching**: Implement data caching for better performance
- **Pagination**: Handle large datasets efficiently
- **Search**: Implement advanced search functionality
- **Filtering**: Add more sophisticated filtering options
