import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Users, CreditCard, AlertCircle } from 'lucide-react-native';

// Fallback if chart kit not available: Simple Bars
const SimpleChart = () => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 8, paddingHorizontal: 10 }}>
    {[40, 60, 45, 80, 55, 70, 90].map((h, i) => (
      <View 
        key={i} 
        style={{ 
          flex: 1, 
          backgroundColor: '#2563EB', 
          height: `${h}%`, 
          borderRadius: 4,
          opacity: 0.7 + (i * 0.05) 
        }} 
      />
    ))}
  </View>
);

const adminColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  primary: '#2563EB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
};

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Admin Overview</Text>
        
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Users" 
            value="12,345" 
            change="+12%" 
            icon={<Users color={adminColors.primary} size={24} />} 
          />
          <StatCard 
            title="Active Loans" 
            value="$4.2M" 
            change="+5.4%" 
            icon={<TrendingUp color={adminColors.success} size={24} />} 
          />
          <StatCard 
            title="Revenue" 
            value="$45.2K" 
            change="+2.1%" 
            icon={<CreditCard color={adminColors.warning} size={24} />} 
          />
          <StatCard 
            title="Pending Actions" 
            value="23" 
            change="Urgent" 
            icon={<AlertCircle color="#EF4444" size={24} />} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Growth</Text>
          <View style={styles.chartContainer}>
            <SimpleChart />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View>
                <Text style={styles.activityText}>User John Doe applied for a loan</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, change, icon }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {icon}
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={[styles.cardChange, change.includes('+') ? styles.textSuccess : styles.textNeutral]}>
        {change}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: adminColors.background,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: adminColors.text,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: adminColors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: adminColors.border,
    width: '48%',
    minWidth: 150,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: adminColors.textSecondary,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: adminColors.text,
    marginBottom: 4,
  },
  cardChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  textSuccess: {
    color: adminColors.success,
  },
  textNeutral: {
    color: adminColors.textSecondary,
  },
  section: {
    backgroundColor: adminColors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminColors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: adminColors.text,
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: adminColors.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: adminColors.primary,
    marginRight: 12,
  },
  activityText: {
    fontSize: 14,
    color: adminColors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: adminColors.textSecondary,
  },
});
