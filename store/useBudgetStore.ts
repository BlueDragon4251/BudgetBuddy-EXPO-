import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, Transaction } from '@/types/budget';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DocumentPicker from 'react-native-document-picker';

interface BudgetStore {
  budget: Budget;
  isLoading: boolean;
  resetConfig: {
    carryOverRemaining: boolean;
    resetDay: number;
  };
  setResetConfig: (config: { carryOverRemaining: boolean; resetDay: number }) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  loadBudget: () => Promise<void>;
  exportBudget: () => Promise<void>;
  importBudget: () => Promise<void>;
  createBackup: () => Promise<void>;
}

const STORAGE_KEY = '@budget_data';
const BACKUP_FILENAME = 'backup.json';

const initialBudget: Budget = {
  transactions: [],
  categories: {
    income: ['Gehalt', 'Bonus', 'Sonstiges'],
    expense: ['Miete', 'Lebensmittel', 'Transport', 'Unterhaltung', 'Sonstiges'],
  },
};

const initialResetConfig = {
  carryOverRemaining: true,
  resetDay: 1, // Default reset day of the month
};

const resetBudgetIfNeeded = async (resetConfig: { carryOverRemaining: boolean; resetDay: number }, set: (state: Partial<BudgetStore>) => void, get: () => BudgetStore) => {
  const today = new Date();
  const resetDate = new Date(today.getFullYear(), today.getMonth(), resetConfig.resetDay);

  if (today >= resetDate) {
    const budget = get().budget;
const newIncome = budget.transactions
  .filter((t: Transaction) => t.type === 'income' && new Date(t.date) >= resetDate)
  .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

const oldBudget = budget.transactions
  .filter((t: Transaction) => t.type === 'expense' && new Date(t.date) < resetDate)
  .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

const updatedBudget = {
  ...budget,
  transactions: budget.transactions.filter((t: Transaction) => new Date(t.date) >= resetDate),
};

if (resetConfig.carryOverRemaining) {
  updatedBudget.transactions.push({
    id: Date.now().toString(),
    type: 'income',
    category: 'Sonstiges',
    amount: oldBudget,
    date: resetDate.toISOString(),
    description: 'Carried over from previous budget',
  } as Transaction);
}

await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBudget));
set({ budget: updatedBudget });
await get().createBackup();
  }
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budget: initialBudget,
  isLoading: true,
  resetConfig: initialResetConfig,

  setResetConfig: (config) => {
    set({ resetConfig: config });
  },

  addTransaction: async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    const budget = get().budget;
    const updatedBudget = {
      ...budget,
      transactions: [...budget.transactions, newTransaction],
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBudget));
    set({ budget: updatedBudget });
    await get().createBackup();
  },

  removeTransaction: async (id) => {
    const budget = get().budget;
    const updatedBudget = {
      ...budget,
      transactions: budget.transactions.filter(t => t.id !== id),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBudget));
    set({ budget: updatedBudget });
    await get().createBackup();
  },

loadBudget: async () => {
  const resetConfig = { ...get().resetConfig, resetDay: 1 }; // Ensure resetDay is included
  await resetBudgetIfNeeded(resetConfig, set, get);

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        set({ budget: JSON.parse(storedData) });
      } else {
        set({ budget: initialBudget });
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  exportBudget: async () => {
    if (Platform.OS === 'web') {
      const jsonString = JSON.stringify(get().budget, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'budget_export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const path = `${FileSystem.documentDirectory}budget_export.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(get().budget, null, 2));
      await Sharing.shareAsync(path);
    }
  },

  importBudget: async () => {
    try {
      if (Platform.OS === 'web') {
        // Web implementation using file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
  
        const promise = new Promise((resolve) => {
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            resolve(target.files ? target.files[0] : null);
          };
        });
  
        input.click();
        const file = await promise;
  
        if (file) {
          const text = await (file as File).text();
          const importedBudget = JSON.parse(text);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(importedBudget));
          set({ budget: importedBudget });
        }
      } else {
        // React Native Document Picker
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
  
        // Zugriff auf das erste Element im Array
        const result = results[0];
  
        // Stelle sicher, dass `uri` existiert
        if (result.uri) {
          const content = await FileSystem.readAsStringAsync(result.uri);
          const importedBudget = JSON.parse(content);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(importedBudget));
          set({ budget: importedBudget });
        } else {
          console.error('No URI found in the selected file.');
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log("Document picker was cancelled");
      } else {
        console.error('Error importing budget:', error);
      }
    }
  },
  

  createBackup: async () => {
    if (Platform.OS === 'web') {
      return; // No backup needed for web
    }

    try {
      const backupPath = `${FileSystem.documentDirectory}${BACKUP_FILENAME}`;
      await FileSystem.writeAsStringAsync(
        backupPath,
        JSON.stringify(get().budget, null, 2)
      );
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  },
}));
