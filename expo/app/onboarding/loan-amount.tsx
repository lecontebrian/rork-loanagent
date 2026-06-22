import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Car, Home, Info } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LoanType } from '@/types';
import { loanCategories } from '@/mocks/loanData';

const formatAmount = (value: string) => {
  const num = value.replace(/[^0-9]/g, '');
  if (!num) return '';
  return Number(num).toLocaleString();
};

const RATE_MAP: Record<string, { min: number; max: number; avg: number }> = {
  auto: { min: 5.0, max: 9.0, avg: 6.5 },
  home: { min: 6.5, max: 7.5, avg: 7.0 },
  personal: { min: 8.0, max: 15.0, avg: 10.5 },
  default: { min: 5.0, max: 12.0, avg: 8.0 },
};

export default function LoanAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const loanType = params.type as LoanType;

  const category = loanCategories.find(c => c.id === loanType);
  const defaultAmount = category ? Math.floor((category.minAmount + category.maxAmount) / 2) : 25000;

  const [amount, setAmount] = useState<string>(defaultAmount.toString());
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number>(60);
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyState, setPropertyState] = useState('');
  const [customRate] = useState('');

  const presetAmounts = category
    ? [category.minAmount, Math.floor(category.minAmount * 2), Math.floor((category.minAmount + category.maxAmount) / 2), Math.floor(category.maxAmount * 0.75), category.maxAmount]
    : [5000, 10000, 25000, 50000, 100000];

  const termOptions = loanType === 'home' ? [180, 240, 300, 360] : [36, 48, 60, 72, 84];
  const averageRates = RATE_MAP[loanType] || RATE_MAP.default;

  useEffect(() => {
    if (loanType === 'auto' && vehiclePrice) setAmount(vehiclePrice);
  }, [vehiclePrice, loanType]);

  useEffect(() => {
    if (loanType === 'home' && propertyPrice) setAmount(propertyPrice);
  }, [propertyPrice, loanType]);

  const numAmount = Number(amount.replace(/,/g, ''));
  const isValid = category ? numAmount >= category.minAmount && numAmount <= category.maxAmount : numAmount > 0;

  const calculateMonthlyPayment = (principal: number, termMonths: number) => {
    const rateToUse = customRate ? parseFloat(customRate) : averageRates.avg;
    const monthlyRate = rateToUse / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    return Math.floor(payment);
  };

  const handleContinue = () => {
    const numAmt = Number(amount.replace(/,/g, ''));
    router.push(`/loan-offers?type=${loanType}&amount=${numAmt}` as any);
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatAmount(text));
    setSelectedPreset(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.container}>
        <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Loan Amount</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={s.flex} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={s.content}>
              <Text style={s.title}>How much do you need?</Text>
              <Text style={s.desc}>
                {category?.name || 'Loan'} amount
                {category && ` (${formatAmount(category.minAmount.toString())} - ${formatAmount(category.maxAmount.toString())})`}
              </Text>

              {loanType === 'auto' && (
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Car color={colors.primary} size={24} />
                    <Text style={s.cardTitle}>Vehicle Details</Text>
                  </View>
                  <View style={s.row}>
                    <View style={[s.field, { flex: 1 }]}>
                      <Text style={s.label}>Year</Text>
                      <TextInput style={s.input} value={vehicleYear} onChangeText={setVehicleYear} placeholder="2024" placeholderTextColor={colors.textTertiary} keyboardType="numeric" />
                    </View>
                    <View style={[s.field, { flex: 2, marginLeft: 12 }]}>
                      <Text style={s.label}>Make</Text>
                      <TextInput style={s.input} value={vehicleMake} onChangeText={setVehicleMake} placeholder="Toyota" placeholderTextColor={colors.textTertiary} />
                    </View>
                  </View>
                  <View style={s.field}>
                    <Text style={s.label}>Model</Text>
                    <TextInput style={s.input} value={vehicleModel} onChangeText={setVehicleModel} placeholder="Camry XSE" placeholderTextColor={colors.textTertiary} />
                  </View>
                  <View style={s.field}>
                    <Text style={s.label}>Vehicle Price</Text>
                    <View style={s.priceWrap}>
                      <DollarSign color={colors.primary} size={20} />
                      <TextInput style={s.priceInput} value={vehiclePrice} onChangeText={(t) => setVehiclePrice(formatAmount(t))} placeholder="35,000" placeholderTextColor={colors.textTertiary} keyboardType="numeric" />
                    </View>
                  </View>
                </View>
              )}

              {loanType === 'home' && (
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Home color={colors.primary} size={24} />
                    <Text style={s.cardTitle}>Property Details</Text>
                  </View>
                  <View style={s.field}>
                    <Text style={s.label}>Property Type</Text>
                    <View style={s.chipRow}>
                      {['Single Family', 'Condo', 'Townhouse', 'Multi-Family'].map((type) => (
                        <TouchableOpacity key={type} style={[s.chip, propertyType === type && s.chipActive]} onPress={() => setPropertyType(type)}>
                          <Text style={[s.chipText, propertyType === type && s.chipTextActive]}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={s.row}>
                    <View style={[s.field, { flex: 2 }]}>
                      <Text style={s.label}>City</Text>
                      <TextInput style={s.input} value={propertyLocation} onChangeText={setPropertyLocation} placeholder="Los Angeles" placeholderTextColor={colors.textTertiary} />
                    </View>
                    <View style={[s.field, { flex: 1, marginLeft: 12 }]}>
                      <Text style={s.label}>State</Text>
                      <TextInput style={s.input} value={propertyState} onChangeText={setPropertyState} placeholder="CA" placeholderTextColor={colors.textTertiary} maxLength={2} autoCapitalize="characters" />
                    </View>
                  </View>
                  <View style={s.field}>
                    <Text style={s.label}>Home Price</Text>
                    <View style={s.priceWrap}>
                      <DollarSign color={colors.primary} size={20} />
                      <TextInput style={s.priceInput} value={propertyPrice} onChangeText={(t) => setPropertyPrice(formatAmount(t))} placeholder="450,000" placeholderTextColor={colors.textTertiary} keyboardType="numeric" />
                    </View>
                  </View>
                </View>
              )}

              <View style={s.amountContainer}>
                <View style={s.amountWrap}>
                  <DollarSign color={colors.primary} size={32} strokeWidth={2.5} />
                  <TextInput style={s.amountInput} value={amount} onChangeText={handleAmountChange} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textTertiary} />
                </View>
                {category && !isValid && numAmount > 0 && (
                  <Text style={s.errorText}>Amount must be between ${category.minAmount.toLocaleString()} and ${category.maxAmount.toLocaleString()}</Text>
                )}
              </View>

              <View style={{ marginBottom: 32 }}>
                <Text style={s.sectionLabel}>Quick Select</Text>
                <View style={s.chipRow}>
                  {presetAmounts.map((preset) => (
                    <TouchableOpacity key={preset} style={[s.chip, selectedPreset === preset && s.chipActive]} onPress={() => { setAmount(preset.toLocaleString()); setSelectedPreset(preset); }} activeOpacity={0.7}>
                      <Text style={[s.chipText, selectedPreset === preset && s.chipTextActive]}>${(preset / 1000).toFixed(0)}K</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {numAmount > 0 && isValid && (
                <>
                  <View style={{ marginBottom: 24 }}>
                    <Text style={s.sectionLabel}>Select Loan Term</Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 16 }}>Choose your preferred payment period</Text>
                    <View style={s.termsGrid}>
                      {termOptions.map((term) => {
                        const monthly = calculateMonthlyPayment(numAmount, term);
                        const total = monthly * term;
                        const selected = selectedTerm === term;
                        return (
                          <View key={term} style={{ width: '48%' }}>
                            <TouchableOpacity style={[s.termCard, selected && s.termCardActive]} onPress={() => setSelectedTerm(term)} activeOpacity={0.7}>
                              <Text style={[s.termMonths, selected && { color: colors.white }]}>{term} mo</Text>
                              <Text style={[s.termPayment, selected && { color: colors.white }]}>${monthly.toLocaleString()}</Text>
                              <Text style={[s.termSub, selected && { color: 'rgba(255,255,255,0.8)' }]}>per month</Text>
                              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 6 }} />
                              <Text style={[s.termSub, selected && { color: 'rgba(255,255,255,0.9)' }]}>${total.toLocaleString()} total</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <View style={s.disclaimerCard}>
                    <Info color={colors.primary} size={20} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700' as const, color: colors.text, marginBottom: 4 }}>This is an Estimate</Text>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                        These calculations are estimates based on {customRate ? `your custom ${customRate}%` : `an average ${averageRates.avg}%`} APR. Actual rates and terms will be determined by the lender.
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={s.footer}>
            <TouchableOpacity style={[s.continueBtn, !isValid && s.continueBtnDisabled]} onPress={handleContinue} disabled={!isValid} activeOpacity={0.8}>
              <Text style={s.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.white },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.text, marginBottom: 8 },
  desc: { fontSize: 16, color: colors.textSecondary, lineHeight: 24, marginBottom: 32 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700' as const, color: colors.text, marginLeft: 12 },
  row: { flexDirection: 'row', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  priceWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border },
  priceInput: { flex: 1, padding: 14, fontSize: 16, color: colors.text, marginLeft: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
  chipTextActive: { color: colors.white },
  amountContainer: { marginBottom: 32 },
  amountWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, borderWidth: 2, borderColor: colors.primary, paddingHorizontal: 24, paddingVertical: 8 },
  amountInput: { flex: 1, fontSize: 48, fontWeight: '700' as const, color: colors.text, marginLeft: 8 },
  errorText: { fontSize: 14, color: colors.error, marginTop: 8, marginLeft: 4 },
  sectionLabel: { fontSize: 16, fontWeight: '600' as const, color: colors.text, marginBottom: 12 },
  termsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  termCard: { backgroundColor: colors.white, borderRadius: 14, borderWidth: 2, borderColor: colors.border, padding: 14 },
  termCardActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  termMonths: { fontSize: 16, fontWeight: '700' as const, color: colors.text, marginBottom: 12, textTransform: 'uppercase' },
  termPayment: { fontSize: 24, fontWeight: '800' as const, color: colors.primary, marginBottom: 2 },
  termSub: { fontSize: 11, fontWeight: '500' as const, color: colors.textSecondary },
  disclaimerCard: { flexDirection: 'row', backgroundColor: '#FFF9E6', padding: 16, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: '#FFE69C' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  continueBtn: { backgroundColor: colors.primary, paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  continueBtnDisabled: { backgroundColor: colors.textTertiary },
  continueBtnText: { fontSize: 17, fontWeight: '600' as const, color: colors.white },
});
