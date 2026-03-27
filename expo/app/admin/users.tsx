import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Search, Filter, MoreVertical } from 'lucide-react-native';

const adminColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB',
};

// Mock Users
const USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', date: '2023-10-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active', date: '2023-10-02' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Suspended', date: '2023-10-05' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'Pending', date: '2023-10-06' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Active', date: '2023-10-07' },
];

export default function AdminUsers() {
  const renderItem = ({ item }: { item: typeof USERS[0] }) => (
    <View style={styles.row}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge, 
          item.status === 'Active' ? styles.statusActive : 
          item.status === 'Suspended' ? styles.statusSuspended : styles.statusPending
        ]}>
          <Text style={[
            styles.statusText,
             item.status === 'Active' ? styles.textActive : 
             item.status === 'Suspended' ? styles.textSuspended : styles.textPending
          ]}>{item.status}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <MoreVertical size={20} color={adminColors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Search size={20} color={adminColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Filter size={20} color={adminColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={USERS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: adminColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: adminColors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: adminColors.background,
    borderRadius: 8,
  },
  listContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: adminColors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: adminColors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: adminColors.text,
  },
  userEmail: {
    fontSize: 14,
    color: adminColors.textSecondary,
  },
  statusContainer: {
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: { backgroundColor: '#D1FAE5' },
  statusSuspended: { backgroundColor: '#FEE2E2' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '500' },
  textActive: { color: '#059669' },
  textSuspended: { color: '#DC2626' },
  textPending: { color: '#D97706' },
});
