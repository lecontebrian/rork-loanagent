import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const adminColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB',
};

// Mock Loans
const LOANS = [
  { id: '1', user: 'John Doe', amount: '$5,000', type: 'Personal', status: 'Approved' },
  { id: '2', user: 'Jane Smith', amount: '$15,000', type: 'Auto', status: 'Review' },
  { id: '3', user: 'Bob Johnson', amount: '$2,500', type: 'Personal', status: 'Rejected' },
];

export default function AdminLoans() {
  return (
    <View style={styles.container}>
        <FlatList
          data={LOANS}
          contentContainerStyle={{ padding: 16 }}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.loanType}>{item.type} Loan</Text>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
              <Text style={styles.user}>{item.user}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  card: {
    backgroundColor: adminColors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: adminColors.border,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: adminColors.text,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: adminColors.primary,
  },
  user: {
    fontSize: 14,
    color: adminColors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: adminColors.text,
  },
});
