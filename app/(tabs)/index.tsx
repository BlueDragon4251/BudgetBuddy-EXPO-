import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { UpdateModal } from '@/components/UpdateModal';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useVersionCheck } from '@/hooks/useVersionCheck';
import { Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { budget, addTransaction, removeTransaction, loadBudget } = useBudgetStore();
  const { versionInfo, currentVersion, handleUpdate } = useVersionCheck();

  useEffect(() => {
    loadBudget();
  }, []);

  useEffect(() => {
    if (versionInfo && versionInfo.latestVersion > currentVersion) {
      setIsUpdateModalVisible(true);
    }
  }, [versionInfo, currentVersion]);

  const calculateBalance = () => {
    return budget.transactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f0f0f0' },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          BudgetBuddy
        </Text>
      </View>

      <View
        style={[
          styles.balanceCard,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[
            styles.balanceTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Aktueller Kontostand
        </Text>
        <Text
          style={[
            styles.balanceAmount,
            { color: calculateBalance() >= 0 ? '#4CAF50' : '#F44336' },
          ]}>
          €{calculateBalance().toFixed(2)}
        </Text>
      </View>

      <View style={styles.transactionsHeader}>
        <Text
          style={[
            styles.transactionsTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Transaktionen
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}>
          <Plus size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
      </View>

      <TransactionList
        transactions={budget.transactions}
        onDelete={removeTransaction}
      />

      <AddTransactionModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={addTransaction}
        categories={budget.categories}
      />

      {isUpdateModalVisible && versionInfo && (
        <UpdateModal
          versionInfo={versionInfo}
          currentVersion={currentVersion}
          onUpdate={handleUpdate}
          onClose={() => setIsUpdateModalVisible(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  transactionsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});