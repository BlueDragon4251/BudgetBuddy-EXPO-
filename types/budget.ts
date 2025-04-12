export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringInterval?: 'monthly';
}

export interface Budget {
  transactions: Transaction[];
  categories: {
    income: string[];
    expense: string[];
  };
}

export interface VersionInfo {
  latestVersion: string;
  minVersion: string;
  currentVersion: string;
  forceUpdate: boolean;
  message: string;
  changelog: string[];
  downloadUrl: string;
}