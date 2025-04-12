import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Budget } from '@/types/budget';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (transaction: any) => void;
  categories: Budget['categories'];
}

export function AddTransactionModal({
  visible,
  onClose,
  onAdd,
  categories,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSubmit = () => {
    if (!amount || !description || !category) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
      isRecurring,
      recurringInterval: isRecurring ? 'monthly' : undefined,
    });

    setAmount('');
    setDescription('');
    setCategory('');
    setIsRecurring(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
          ]}>
          <Text
            style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
            Neue Transaktion
          </Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => setType('expense')}>
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}>
                Ausgabe
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => setType('income')}>
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}>
                Einnahme
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text
              style={[styles.label, { color: isDark ? '#ffffff' : '#000000' }]}>
              Betrag (€)
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: isDark ? '#ffffff' : '#000000', borderColor: isDark ? '#333333' : '#e0e0e0' },
              ]}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={isDark ? '#888888' : '#999999'}
            />

            <Text
              style={[styles.label, { color: isDark ? '#ffffff' : '#000000' }]}>
              Beschreibung
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: isDark ? '#ffffff' : '#000000', borderColor: isDark ? '#333333' : '#e0e0e0' },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Beschreibung eingeben"
              placeholderTextColor={isDark ? '#888888' : '#999999'}
            />

            <Text
              style={[styles.label, { color: isDark ? '#ffffff' : '#000000' }]}>
              Kategorie
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}>
              {(type === 'income'
                ? categories.income
                : categories.expense
              ).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}>
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.switchContainer}>
              <Text
                style={[
                  styles.switchLabel,
                  { color: isDark ? '#ffffff' : '#000000' },
                ]}>
                Monatlich wiederkehrend
              </Text>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isRecurring ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>Hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});