# Employee Management System

A modern, comprehensive employee management system built with Vue 3, TypeScript, and PrimeVue. This application provides a complete solution for managing companies, departments, and employees with a beautiful, responsive interface.

## 🚀 Features

### Core Functionality

- **Company Management**: Create, edit, view, and delete companies with hierarchical relationships
- **Department Management**: Organize departments within companies with budget tracking
- **Employee Management**: Complete employee profiles with skills, certifications, and performance tracking
- **User Authentication**: Secure login/logout with role-based access control

### Advanced Features

- **Grid & Table Views**: Toggle between grid and table views for better data visualization
- **Advanced Filtering**: Filter data by company, department, status, and other criteria
- **Search Functionality**: Global search across all entities
- **Pagination**: Efficient data pagination with customizable page sizes
- **Export Capabilities**: Export data in various formats
- **Responsive Design**: Mobile-friendly interface that works on all devices

### UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Dark/Light Themes**: Customizable theme support
- **Interactive Components**: Rich form components with validation
- **Real-time Updates**: Live data updates and notifications
- **Accessibility**: WCAG compliant components

## 🛠️ Technology Stack

### Frontend

- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Type-safe JavaScript development
- **PrimeVue**: Rich UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### State Management

- **Pinia**: Modern state management for Vue 3
- **Vue Router**: Official router for Vue.js

### Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing

## 📁 Project Structure

```
employee-management-system/
├── src/
│   ├── components/
│   │   └── ui/                    # Reusable UI components
│   │       ├── BaseInput.vue      # Form input component
│   │       ├── BaseButton.vue     # Button component
│   │       ├── BaseTable.vue      # Data table component
│   │       ├── BaseGridView.vue   # Grid view component
│   │       ├── dropdown/          # Dropdown components
│   │       ├── table/             # Table components
│   │       └── grid/              # Grid components
│   ├── views/
│   │   ├── auth/                  # Authentication views
│   │   ├── companies/             # Company management views
│   │   ├── departments/           # Department management views
│   │   └── employees/             # Employee management views
│   ├── stores/                    # Pinia stores
│   ├── data/                      # JSON data files
│   ├── router/                    # Vue Router configuration
│   └── layouts/                   # Application layouts
├── public/                        # Static assets
└── docs/                          # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd employee-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### Authentication

- **Default Credentials**:
  - Email: `admin@example.com`
  - Password: `admin123`

### Company Management

1. Navigate to Companies section
2. View all companies in table or grid format
3. Create new companies with complete information
4. Edit existing companies
5. View detailed company information
6. Delete companies (with confirmation)

### Department Management

1. Navigate to Departments section
2. Create departments within companies
3. Assign managers and budgets
4. Track employee counts
5. Manage department settings

### Employee Management

1. Navigate to Employees section
2. Create employee profiles with complete information
3. Assign employees to companies and departments
4. Track skills and certifications
5. Monitor performance metrics
6. Manage employee status and information

## 🎨 UI Components

### Base Components

- **BaseInput**: Enhanced input field with validation and styling
- **BaseButton**: Customizable button with multiple variants
- **BaseDropdown**: Advanced dropdown with filtering
- **BaseTable**: Feature-rich data table with pagination
- **BaseGridView**: Responsive grid view for data display
- **BaseForm**: Form wrapper with validation and actions

### Features

- **Float Labels**: Modern input styling with animated labels
- **Validation**: Real-time form validation with error messages
- **Responsive Design**: Mobile-first responsive layouts
- **Accessibility**: WCAG compliant components
- **Customization**: Extensive customization options

## 📊 Data Management

### JSON Data Structure

- **companies.json**: Company data with hierarchical relationships
- **departments.json**: Department data with budget and location info
- **employees.json**: Employee data with skills and performance metrics
- **users.json**: User authentication data

### Store Management

- **authStore**: User authentication and session management
- **companiesStore**: Company data management
- **departmentsStore**: Department data management
- **employeesStore**: Employee data management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Employee Management System
VITE_APP_API_URL=http://localhost:3000/api
```

### Customization

- **Themes**: Customize colors and styling in `src/style.css`
- **Components**: Modify component behavior in `src/components/ui/`
- **Routing**: Update routes in `src/router/index.ts`

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in `/docs`
- Review the component examples

## 🗺️ Roadmap

### Planned Features

- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] File upload and management
- [ ] Advanced search and filtering
- [ ] Mobile application
- [ ] API integration
- [ ] Multi-language support
- [ ] Advanced permissions system

### Performance Improvements

- [ ] Lazy loading for large datasets
- [ ] Virtual scrolling for tables
- [ ] Caching strategies
- [ ] Bundle optimization

## 🙏 Acknowledgments

- **Vue.js Team** for the amazing framework
- **PrimeVue Team** for the excellent UI components
- **Tailwind CSS Team** for the utility-first CSS framework
- **Vite Team** for the fast build tool

---

**Built with ❤️ using Vue 3, TypeScript, and PrimeVue**
