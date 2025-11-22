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
  expenses_ids?: Expense[] | string[];
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
  paid_by: (User | string)[];
  paid_for: (User | string)[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============ Split Types ============
export interface PaymentEntry {
  user_id: User | string;
  amount: number;
}

export interface Split {
  _id: string;
  group_id: Group | string;
  user_id: User | string;
  pay_to: PaymentEntry[];
  get_pay_by: PaymentEntry[];
  createdAt: string;
  updatedAt: string;
}

// ============ Balance Types ============
export interface UserBalance {
  user_id: string;
  name: string;
  email?: string;
  balance: number;
}

export interface SettlementTransaction {
  from: {
    id: string;
    name: string;
    email?: string;
  };
  to: {
    id: string;
    name: string;
    email?: string;
  };
  amount: number;
}

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
