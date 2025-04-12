import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { de } from 'date-fns/locale';

export default function StatisticsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { budget } = useBudgetStore();

  const categoryData = useMemo(() => {
    const expensesByCategory = budget.transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      x: category,
      y: amount,
    }));
  }, [budget.transactions]);

  const dailyBalance = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    const dailyTotals = days.map((day) => {
      const dayTotal = budget.transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getDate() <= day.getDate() &&
            transactionDate.getMonth() === day.getMonth()
          );
        })
        .reduce((acc, t) => {
          return t.type === 'income' ? acc + t.amount : acc - t.amount;
        }, 0);

      return {
        x: format(day, 'd.', { locale: de }),
        y: dayTotal,
      };
    });

    return dailyTotals;
  }, [budget.transactions]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f0f0f0' },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Statistiken
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Ausgaben nach Kategorien
        </Text>
        <VictoryPie
          data={categoryData}
          colorScale={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
          width={300}
          height={300}
          padding={50}
          labels={({ datum }) => `${datum.x}\n€${datum.y.toFixed(2)}`}
          style={{
            labels: {
              fill: isDark ? '#ffffff' : '#000000',
              fontSize: 12,
              fontFamily: 'Inter-Regular',
            },
          }}
        />
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Monatlicher Verlauf
        </Text>
        <VictoryChart height={300} padding={{ top: 50, bottom: 50, left: 50, right: 50 }}>
          <VictoryAxis
            style={{
              axis: { stroke: isDark ? '#ffffff' : '#000000' },
              tickLabels: {
                fill: isDark ? '#ffffff' : '#000000',
                fontSize: 10,
                fontFamily: 'Inter-Regular',
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: isDark ? '#ffffff' : '#000000' },
              tickLabels: {
                fill: isDark ? '#ffffff' : '#000000',
                fontSize: 10,
                fontFamily: 'Inter-Regular',
              },
            }}
          />
          <VictoryLine
            data={dailyBalance}
            style={{
              data: { stroke: '#007AFF' },
            }}
          />
        </VictoryChart>
      </View>
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
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
});