# 🏢 Employee Management System

A modern, responsive Employee Management System built with Vue 3, TypeScript, and PrimeVue. This application provides comprehensive tools for managing companies, departments, employees, and organizational hierarchies.

## ✨ Features

### 🔐 Authentication & User Management

- **Secure Login/Logout** with session management
- **Forgot Password** functionality
- **Role-based Access Control** (Admin, Manager, Employee)
- **User Profile Management**
- **Token-based Authentication** with localStorage persistence

### 🏢 Company Management

- **Complete CRUD Operations** for companies
- **Hierarchical Company Structure** with parent-child relationships
- **Advanced Search & Filtering** by name, code, or email
- **Tree View** for visualizing company hierarchy
- **Bulk Export** to CSV format
- **Pagination** for large datasets

### 📊 Dashboard & Analytics

- **Real-time Statistics** (companies, departments, employees, projects)
- **Recent Activity Feed**
- **Quick Action Buttons**
- **Company Overview Table**
- **Responsive Design** for all devices

### 🎨 Modern UI/UX

- **PrimeVue Components** for professional look and feel
- **Tailwind CSS** for custom styling
- **Responsive Design** - mobile-first approach
- **Dark/Light Theme Ready**
- **Loading States** and error handling
- **Form Validation** with Vuelidate

## 🛠️ Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management for Vue

### UI & Styling

- **PrimeVue 4** - Rich UI component library
- **Tailwind CSS 3** - Utility-first CSS framework
- **PrimeIcons** - Icon library
- **Vuelidate** - Form validation

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite** - Build tool and development server

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

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Login Credentials

Use these demo credentials to access the system:

- **Email:** `admin@example.com`
- **Password:** `password`

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   └── companies/      # Company-specific components
├── layouts/            # Layout components
├── router/             # Vue Router configuration
├── stores/             # Pinia state management
│   ├── auth.ts        # Authentication store
│   └── companies.ts   # Companies data store
├── views/              # Page components
│   ├── auth/          # Authentication pages
│   ├── companies/     # Company management pages
│   ├── departments/   # Department management pages
│   └── employees/     # Employee management pages
├── style.css          # Global styles and Tailwind
├── main.ts            # Application entry point
└── App.vue            # Root component
```

## 🎯 Key Features Explained

### Company Hierarchy Management

- **Tree View**: Visual representation of parent-child company relationships
- **Drag & Drop**: Reorganize company structure (planned)
- **Bulk Operations**: Export, delete, or modify multiple companies

### Advanced Search & Filtering

- **Real-time Search**: Instant results as you type
- **Multi-field Search**: Search by name, code, email, or phone
- **Pagination**: Handle large datasets efficiently

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablets
- **Desktop Experience**: Full-featured desktop interface

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Style

- **ESLint** configuration for consistent code style
- **TypeScript** for type safety
- **Vue 3 Composition API** for modern Vue development

## 🎨 Customization

### Styling

The project uses Tailwind CSS for styling. You can customize:

- **Colors**: Modify the color palette in `tailwind.config.js`
- **Components**: Use PrimeVue theming or create custom components
- **Layout**: Adjust the responsive breakpoints and grid system

### Adding New Features

1. **Create new stores** in `src/stores/` for state management
2. **Add new routes** in `src/router/index.ts`
3. **Create new views** in `src/views/`
4. **Build reusable components** in `src/components/`

## 🔒 Security Features

- **JWT Token Management** with automatic refresh
- **Route Guards** for protected pages
- **Role-based Navigation** showing only relevant menu items
- **Form Validation** preventing invalid data submission

## 📱 Browser Support

- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=Employee Management System
```

## 📈 Future Enhancements

- [ ] **Employee Management** - Complete CRUD operations
- [ ] **Department Management** - Organizational structure
- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Advanced Reporting** - Charts and analytics
- [ ] **File Upload** - Profile pictures and documents
- [ ] **Multi-language Support** - Internationalization
- [ ] **Dark Mode** - Theme switching
- [ ] **Offline Support** - Service worker implementation

---

**Built with ❤️ using Vue 3, TypeScript, and PrimeVue**
