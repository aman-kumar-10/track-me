import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { ExpenseItem } from '../../types';
import { AppCard } from '../common/AppCard';

interface ExpensesSectionProps {
  expenses: ExpenseItem[];
  onAddExpense: (amount: number, description: string) => void;
  onRemoveExpense: (id: string) => void;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  expenses,
  onAddExpense,
  onRemoveExpense,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [description, setDescription] = useState('');

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = () => {
    const parsed = parseFloat(amountStr);
    if (isNaN(parsed) || parsed <= 0 || !description.trim()) {
      return;
    }
    onAddExpense(parsed, description.trim());
    setAmountStr('');
    setDescription('');
  };

  return (
    <AppCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${Colors.success}1A` }]}>
            <MaterialCommunityIcons name="currency-inr" size={18} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.sectionTag}>SECTION F</Text>
            <Text style={styles.sectionTitle}>Daily Expenses</Text>
          </View>
        </View>

        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>₹{totalSpent.toFixed(2)}</Text>
        </View>
      </View>

      {/* Input Row: Amount & Description */}
      <View style={styles.inputContainer}>
        <View style={styles.inputsRow}>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
              value={amountStr}
              onChangeText={setAmountStr}
            />
          </View>

          <TextInput
            style={styles.descInput}
            placeholder="Expense description (e.g. High-protein lunch)"
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.addBtn,
            (!amountStr || !description.trim()) && styles.addBtnDisabled,
          ]}
          onPress={handleAdd}
          disabled={!amountStr || !description.trim()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#0F1117" />
          <Text style={styles.addBtnText}>ADD RECORD</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Expenses List */}
      {expenses.length > 0 && (
        <View style={styles.expensesList}>
          <Text style={styles.listHeader}>LOGGED TRANSACTIONS ({expenses.length})</Text>
          {expenses.map((item) => (
            <View key={item.id} style={styles.expenseRow}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDesc}>{item.description}</Text>
                <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveExpense(item.id)}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="close" size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalBadge: {
    alignItems: 'flex-end',
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Layout.radius.sm,
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  inputContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Layout.spacing.md,
    gap: 10,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 10,
    width: 95,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingVertical: 8,
  },
  descInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 8,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Layout.radius.sm,
    gap: 6,
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 0.8,
  },
  expensesList: {
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  listHeader: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  expenseDesc: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  expenseAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  deleteBtn: {
    padding: 4,
  },
});
