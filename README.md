# TripSplit

A modern group expense tracking and bill splitting application built with React, TypeScript, and Tailwind CSS.

## Overview

TripSplit helps groups manage shared expenses during trips, events, or everyday situations. Users can create trips, add members, track expenses, and settle up with optimized payment suggestions.

## Features

### Trip Management

- Create and manage group trips
- Add/remove members from trips
- Edit trip details (name, description)
- Delete trips (creator only)

### Expense Tracking

- Add expenses with description, amount, and category
- Select who paid and who benefits from each expense
- Edit and delete expenses
- View expense history per trip

### Settlement & Balances

- Real-time balance calculation per member
- Optimized settlement suggestions (minimize number of transactions)
- View who owes whom and how much
- Settle Up dialog with clear payment instructions

### User Experience

- Responsive design for mobile and desktop
- Dashboard with expense overview and recent activity
- Member avatars and intuitive UI
- Custom confirmation dialogs

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **Backend**: Node.js, Express, MongoDB

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see backend repository)

### Installation

1. Clone the repository

```bash
git clone https://github.com/TracyHT/tripsplit-frontend.git
cd tripsplit-frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── trips/          # Trip-related components
│   │   ├── AddExpenseDialog.tsx
│   │   ├── EditExpenseDialog.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── MemberList.tsx
│   │   ├── SettleUpDialog.tsx
│   │   └── ...
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom hooks (useApi)
├── lib/
│   └── api/            # API client and endpoints
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── TripDetails.tsx
│   ├── Trips.tsx
│   └── ...
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## Application Routes

| Route        | Description                                        |
| ------------ | -------------------------------------------------- |
| `/`          | Landing page                                       |
| `/login`     | User login                                         |
| `/signup`    | User registration                                  |
| `/dashboard` | User dashboard with stats and recent activity      |
| `/trips`     | List of all user trips                             |
| `/trips/:id` | Trip details with members, expenses, and settle up |

## API Integration

All API calls are managed through React Query hooks in `src/hooks/useApi.ts`:

```typescript
// Examples
const { data: trips } = useGroups();
const { data: balances } = useBalances(groupId);
const createExpense = useCreateExpense();
const settleUp = useSettleUp();
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## Backend Repository:

[github.com/vinhvrs/TripSplit](https://github.com/vinhvrs/TripSplit)

## License

This project is licensed under the MIT License.
