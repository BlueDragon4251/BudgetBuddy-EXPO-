import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget, Transaction } from '@/types/budget';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

interface BudgetStore {
  budget: Budget;
  isLoading: boolean;
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

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  budget: initialBudget,
  isLoading: true,

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
          input.onchange = (e) => resolve(e.target.files[0]);
        });
        
        input.click();
        const file = await promise;
        
        if (file) {
          const text = await file.text();
          const importedBudget = JSON.parse(text);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(importedBudget));
          set({ budget: importedBudget });
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
        });
        
        if (result.type === 'success') {
          const content = await FileSystem.readAsStringAsync(result.uri);
          const importedBudget = JSON.parse(content);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(importedBudget));
          set({ budget: importedBudget });
        }
      }
    } catch (error) {
      console.error('Error importing budget:', error);
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