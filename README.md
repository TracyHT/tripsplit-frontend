# TripSplit Frontend

React + TypeScript frontend for TripSplit - a group expense tracking and bill splitting application.

---

## 🚀 Quick Start

### 1. Start the frontend
```bash
npm install
npm run dev
```

### 2. Test the API
Visit the comprehensive test dashboard:
**[http://localhost:5173/test](http://localhost:5173/test)** ⭐

### 3. Set up the backend
Follow [QUICK_START.md](./QUICK_START.md) for complete MongoDB and backend setup.

---

## 🎯 Key Features

- ✅ **Complete API Integration** - All backend endpoints connected
- ✅ **TypeScript Support** - Full type safety
- ✅ **React Query Hooks** - Optimized data fetching and caching
- ✅ **Test Dashboard** - Visual interface to test all APIs
- ✅ **MongoDB Integration** - Ready for MongoDB Compass
- ✅ **Authentication** - JWT + Session + OAuth (Google/Facebook)
- ✅ **Group Trip Management** - Create, edit, and manage group trips
- ✅ **Member Management** - Add/remove members from trips
- ✅ **Expense Tracking** - Add and track expenses for trips
- ✅ **Modern UI Components** - Built with shadcn/ui and Tailwind CSS

---

## 🧪 Test Dashboard

The **API Test Dashboard** provides a visual interface to test all backend endpoints:

**URL**: [http://localhost:5173/test](http://localhost:5173/test)

Features:
- ✅ Color-coded status indicators
- ✅ Real-time response viewer
- ✅ Organized by API category (Auth, Users, Groups, Expenses, Splits)
- ✅ Pre-filled test data
- ✅ Shows current logged-in user

See [TEST_DASHBOARD_GUIDE.md](./TEST_DASHBOARD_GUIDE.md) for detailed usage.

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [QUICK_START.md](./QUICK_START.md) | **Start here!** Complete setup guide |
| [TEST_DASHBOARD_GUIDE.md](./TEST_DASHBOARD_GUIDE.md) | How to use the test dashboard |
| [API_ENDPOINTS_SUMMARY.md](./API_ENDPOINTS_SUMMARY.md) | All API endpoints reference |
| [MONGODB_SETUP.md](./MONGODB_SETUP.md) | MongoDB Compass setup |
| [BACKEND_ENV_TEMPLATE.md](./BACKEND_ENV_TEMPLATE.md) | Backend env variables |

---

## 💻 Usage Example

```typescript
import { useLogin, useGroups, useCreateExpense } from '@/hooks/useApi';

function MyComponent() {
  const login = useLogin();
  const { data: groups } = useGroups();
  const createExpense = useCreateExpense();

  const handleLogin = () => {
    login.mutate({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <div>
      {groups?.map(group => (
        <div key={group._id}>{group.name}</div>
      ))}
    </div>
  );
}
```

---

## 🗺️ Application Routes

- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - User dashboard with overview
- `/trips` - List of all user trips
- `/trips/:id` - Trip details with members and expenses
- `/test` - API test dashboard

---

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS
- React Query + Axios
- Shadcn/ui components

---

## 🌟 Next Steps

1. Follow [QUICK_START.md](./QUICK_START.md) to set up MongoDB and backend
2. Use [http://localhost:5173/test](http://localhost:5173/test) to test all endpoints
3. Check MongoDB Compass to view data
4. Start building your features!

---

**Backend Repository**: [github.com/vinhvrs/TripSplit](https://github.com/vinhvrs/TripSplit)
