import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Save } from 'lucide-react-native';

const adminColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB',
};

export default function AdminSettings() {
  // Mock Configs
  const [fees, setFees] = useState({
    processorFeePercent: '2.5',
    processorFeeFlat: '0.30',
    appFeePercent: '0.5',
    appFeeCap: '5.00',
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Fee Configuration</Text>
          <Text style={styles.sectionDescription}>Adjust the transaction fees applied across the platform.</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Processor Fee (%)</Text>
            <TextInput 
              style={styles.input} 
              value={fees.processorFeePercent} 
              onChangeText={v => setFees({...fees, processorFeePercent: v})}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>App Processing Fee (%)</Text>
            <TextInput 
              style={styles.input} 
              value={fees.appFeePercent} 
              onChangeText={v => setFees({...fees, appFeePercent: v})}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>App Fee Cap ($)</Text>
            <TextInput 
              style={styles.input} 
              value={fees.appFeeCap} 
              onChangeText={v => setFees({...fees, appFeeCap: v})}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Controls</Text>
          
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>Maintenance Mode</Text>
              <Text style={styles.rowSubtitle}>Disable user access for updates</Text>
            </View>
            <Switch 
              value={maintenanceMode} 
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#D1D5DB', true: adminColors.primary }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Save color="#FFF" size={20} />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
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
  section: {
    backgroundColor: adminColors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: adminColors.border,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: adminColors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: adminColors.textSecondary,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: adminColors.text,
  },
  input: {
    backgroundColor: adminColors.background,
    borderWidth: 1,
    borderColor: adminColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: adminColors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: adminColors.text,
  },
  rowSubtitle: {
    fontSize: 14,
    color: adminColors.textSecondary,
  },
  saveButton: {
    backgroundColor: adminColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
