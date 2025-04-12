import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Download, Upload, RefreshCw } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { exportBudget, importBudget, createBackup } = useBudgetStore();

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f0f0f0' },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Einstellungen
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Datensicherung
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={exportBudget}>
          <Download size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Daten exportieren</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={importBudget}>
          <Upload size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Daten importieren</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={createBackup}>
          <RefreshCw size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Backup erstellen</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}>
          Über BudgetBuddy
        </Text>
        <Text
          style={[
            styles.description,
            { color: isDark ? '#888888' : '#666666' },
          ]}>
          BudgetBuddy ist Ihre persönliche Finanz-App für die einfache und
          sichere Verwaltung Ihrer Einnahmen und Ausgaben. Alle Daten werden
          ausschließlich lokal auf Ihrem Gerät gespeichert.
        </Text>
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
  section: {
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});