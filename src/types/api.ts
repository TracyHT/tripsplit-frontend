// ============ User Types ============
export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Group Types ============
export interface Group {
  _id: string;
  name: string;
  description?: string;
  user_ids: User[] | string[];
  admin_id: User | string;
  expenses_ids?: string[];
  url_invite?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Expense Types ============
export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category?: string;
  paidBy: User | string;
  group: Group | string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Split Types ============
export interface Split {
  _id: string;
  expense: Expense | string;
  user: User | string;
  amount: number;
  settled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ Balance Types ============
export interface Balance {
  userId: string;
  userName: string;
  balance: number;
  owes: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
  owed: Array<{
    userId: string;
    userName: string;
    amount: number;
  }>;
}

// ============ Auth Types ============
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
