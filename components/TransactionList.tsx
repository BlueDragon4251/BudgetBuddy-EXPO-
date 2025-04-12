import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Transaction } from '@/types/budget';
import { useColorScheme } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderItem = ({ item }: { item: Transaction }) => (
    <View
      style={[
        styles.transactionItem,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
      ]}>
      <View style={styles.transactionInfo}>
        <Text
          style={[styles.description, { color: isDark ? '#ffffff' : '#000000' }]}>
          {item.description}
        </Text>
        <Text
          style={[styles.category, { color: isDark ? '#888888' : '#666666' }]}>
          {item.category}
        </Text>
        <Text
          style={[styles.date, { color: isDark ? '#888888' : '#666666' }]}>
          {format(new Date(item.date), 'dd. MMMM yyyy', { locale: de })}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            { color: item.type === 'income' ? '#4CAF50' : '#F44336' },
          ]}>
          {item.type === 'income' ? '+' : '-'} €{item.amount.toFixed(2)}
        </Text>
        {item.isRecurring && (
          <Text style={[styles.recurring, { color: isDark ? '#888888' : '#666666' }]}>
            Monatlich wiederkehrend
          </Text>
        )}
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.deleteButton}>
          <Trash2 size={20} color={isDark ? '#888888' : '#666666'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
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
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  recurring: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    marginTop: 8,
  },
});