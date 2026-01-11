import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Car, Home, Info, ChevronRight, Pencil } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LoanType } from '@/types';
import { loanCategories } from '@/mocks/loanData';

interface VehicleSelection {
  year: string;
  make: string;
  model: string;
  price: string;
}

interface PropertySelection {
  type: string;
  price: string;
  location: string;
  state: string;
}

interface MortgageDetails {
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanProgram: '30-year-fixed' | '15-year-fixed' | '5-year-arm' | 'custom';
  customRate: string;
  includePMI: boolean;
  pmiRate: string;
  propertyTaxRate: string;
  homeInsurance: string;
  hoaFees: string;
  utilities: {
    water: { include: boolean; amount: string };
    sewage: { include: boolean; amount: string };
    gas: { include: boolean; amount: string };
    internet: { include: boolean; amount: string };
    electric: { include: boolean; amount: string };
  };
}

export default function LoanAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const loanType = params.type as LoanType;
  
  const category = loanCategories.find(c => c.id === loanType);
  const defaultAmount = category ? Math.floor((category.minAmount + category.maxAmount) / 2) : 25000;
  
  const [amount, setAmount] = useState<string>(defaultAmount.toString());
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number>(60);
  
  const [vehicleSelection, setVehicleSelection] = useState<VehicleSelection>({
    year: '',
    make: '',
    model: '',
    price: '',
  });
  
  const [propertySelection, setPropertySelection] = useState<PropertySelection>({
    type: '',
    price: '',
    location: '',
    state: '',
  });

  const [mortgageDetails, setMortgageDetails] = useState<MortgageDetails>({
    downPaymentPercent: 20,
    downPaymentAmount: 0,
    loanProgram: '30-year-fixed',
    customRate: '',
    includePMI: false,
    pmiRate: '0.5',
    propertyTaxRate: '',
    homeInsurance: '',
    hoaFees: '',
    utilities: {
      water: { include: false, amount: '' },
      sewage: { include: false, amount: '' },
      gas: { include: false, amount: '' },
      internet: { include: false, amount: '' },
      electric: { include: false, amount: '' },
    },
  });
  
  const [customRate, setCustomRate] = useState<string>('');
  const [customTax, setCustomTax] = useState<string>('');
  const [customFees, setCustomFees] = useState<string>('');
  const [insuranceCost, setInsuranceCost] = useState<string>('');
  const [propertyTax, setPropertyTax] = useState<string>('');
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);

  const presetAmounts = category ? [
    category.minAmount,
    Math.floor(category.minAmount * 2),
    Math.floor((category.minAmount + category.maxAmount) / 2),
    Math.floor(category.maxAmount * 0.75),
    category.maxAmount,
  ] : [5000, 10000, 25000, 50000, 100000];

  const termOptions = loanType === 'home' 
    ? [180, 240, 300, 360]
    : [36, 48, 60, 72, 84];
  
  const getStatePropertyTaxRate = (state: string): number => {
    const taxRates: Record<string, number> = {
      'AL': 0.41, 'AK': 1.19, 'AZ': 0.62, 'AR': 0.61, 'CA': 0.76,
      'CO': 0.51, 'CT': 2.14, 'DE': 0.57, 'FL': 0.89, 'GA': 0.92,
      'HI': 0.28, 'ID': 0.69, 'IL': 2.27, 'IN': 0.85, 'IA': 1.57,
      'KS': 1.41, 'KY': 0.86, 'LA': 0.55, 'ME': 1.36, 'MD': 1.09,
      'MA': 1.23, 'MI': 1.54, 'MN': 1.12, 'MS': 0.79, 'MO': 0.97,
      'MT': 0.84, 'NE': 1.73, 'NV': 0.60, 'NH': 2.18, 'NJ': 2.49,
      'NM': 0.80, 'NY': 1.72, 'NC': 0.84, 'ND': 0.98, 'OH': 1.56,
      'OK': 0.90, 'OR': 0.97, 'PA': 1.58, 'RI': 1.63, 'SC': 0.57,
      'SD': 1.31, 'TN': 0.71, 'TX': 1.80, 'UT': 0.60, 'VT': 1.90,
      'VA': 0.82, 'WA': 0.98, 'WV': 0.61, 'WI': 1.85, 'WY': 0.61,
    };
    return taxRates[state.toUpperCase()] || 1.0;
  };

  const getLoanProgramRate = (): number => {
    if (mortgageDetails.customRate) return parseFloat(mortgageDetails.customRate);
    
    switch (mortgageDetails.loanProgram) {
      case '30-year-fixed': return 7.0;
      case '15-year-fixed': return 6.5;
      case '5-year-arm': return 6.25;
      default: return 7.0;
    }
  };

  const getAverageRate = () => {
    if (loanType === 'auto') return { min: 5.0, max: 9.0, avg: 6.5 };
    if (loanType === 'home') {
      switch (mortgageDetails.loanProgram) {
        case '30-year-fixed': return { min: 6.5, max: 7.5, avg: 7.0 };
        case '15-year-fixed': return { min: 6.0, max: 7.0, avg: 6.5 };
        case '5-year-arm': return { min: 5.75, max: 6.75, avg: 6.25 };
        default: return { min: 6.5, max: 7.5, avg: 7.0 };
      }
    }
    if (loanType === 'personal') return { min: 8.0, max: 15.0, avg: 10.5 };
    return { min: 5.0, max: 12.0, avg: 8.0 };
  };
  
  const averageRates = getAverageRate();
  
  const getTermInfo = (term: number) => {
    if (loanType === 'home') {
      const termData: Record<number, string> = {
        180: '15 years - Lowest total interest, higher monthly payment',
        240: '20 years - Balanced payment and interest',
        300: '25 years - Lower monthly payment than 15-20yr',
        360: '30 years - Most popular, lowest monthly payment',
      };
      return termData[term] || '';
    }
    
    const termData: Record<number, string> = {
      36: '3 years - Lowest total interest, higher monthly payment',
      48: '4 years - Balanced payment and interest',
      60: '5 years - Most popular, moderate monthly payment',
      72: '6 years - Lower monthly payment, higher total interest',
      84: '7 years - Lowest monthly payment, highest total interest',
    };
    return termData[term] || '';
  };
  
  useEffect(() => {
    if (loanType === 'auto' && vehicleSelection.price) {
      setAmount(vehicleSelection.price);
    }
  }, [vehicleSelection.price, loanType]);
  
  useEffect(() => {
    if (loanType === 'home' && propertySelection.price) {
      setAmount(propertySelection.price);
      const homePrice = Number(propertySelection.price.replace(/,/g, ''));
      setMortgageDetails(prev => {
        const downPayment = Math.floor((homePrice * prev.downPaymentPercent) / 100);
        return {
          ...prev,
          downPaymentAmount: downPayment,
          includePMI: prev.downPaymentPercent < 20,
        };
      });
    }
  }, [propertySelection.price, loanType]);

  useEffect(() => {
    if (loanType === 'home') {
      const homePrice = Number(amount.replace(/,/g, ''));
      if (homePrice > 0) {
        const downPayment = Math.floor((homePrice * mortgageDetails.downPaymentPercent) / 100);
        setMortgageDetails(prev => ({
          ...prev,
          downPaymentAmount: downPayment,
          includePMI: mortgageDetails.downPaymentPercent < 20,
        }));
      }
      
      if (propertySelection.state) {
        const taxRate = getStatePropertyTaxRate(propertySelection.state);
        setMortgageDetails(prev => ({
          ...prev,
          propertyTaxRate: taxRate.toFixed(2),
        }));
      }
    }
  }, [amount, mortgageDetails.downPaymentPercent, propertySelection.state, loanType]);

  const calculateMortgagePayment = (homePrice: number, termMonths: number) => {
    const downPayment = mortgageDetails.downPaymentAmount;
    const loanAmount = homePrice - downPayment;
    
    const annualRate = getLoanProgramRate() / 100;
    const monthlyRate = annualRate / 12;
    
    const principalAndInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                    (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    let pmi = 0;
    if (mortgageDetails.includePMI && mortgageDetails.downPaymentPercent < 20) {
      const pmiRate = parseFloat(mortgageDetails.pmiRate || '0.5') / 100;
      pmi = (loanAmount * pmiRate) / 12;
    }
    
    const taxRate = parseFloat(mortgageDetails.propertyTaxRate || '1.0') / 100;
    const propertyTaxMonthly = (homePrice * taxRate) / 12;
    
    const homeInsuranceMonthly = parseFloat(mortgageDetails.homeInsurance || '0');
    const hoaFeesMonthly = parseFloat(mortgageDetails.hoaFees || '0');
    
    const waterCost = mortgageDetails.utilities.water.include ? parseFloat(mortgageDetails.utilities.water.amount || '0') : 0;
    const sewageCost = mortgageDetails.utilities.sewage.include ? parseFloat(mortgageDetails.utilities.sewage.amount || '0') : 0;
    const gasCost = mortgageDetails.utilities.gas.include ? parseFloat(mortgageDetails.utilities.gas.amount || '0') : 0;
    const internetCost = mortgageDetails.utilities.internet.include ? parseFloat(mortgageDetails.utilities.internet.amount || '0') : 0;
    const electricCost = mortgageDetails.utilities.electric.include ? parseFloat(mortgageDetails.utilities.electric.amount || '0') : 0;
    
    const totalUtilities = waterCost + sewageCost + gasCost + internetCost + electricCost;
    
    return {
      principalAndInterest: Math.floor(principalAndInterest),
      pmi: Math.floor(pmi),
      propertyTax: Math.floor(propertyTaxMonthly),
      homeInsurance: Math.floor(homeInsuranceMonthly),
      hoaFees: Math.floor(hoaFeesMonthly),
      utilities: Math.floor(totalUtilities),
      total: Math.floor(principalAndInterest + pmi + propertyTaxMonthly + homeInsuranceMonthly + hoaFeesMonthly + totalUtilities),
    };
  };

  const calculateMonthlyPayment = (principal: number, termMonths: number) => {
    if (loanType === 'home') {
      return calculateMortgagePayment(principal, termMonths).total;
    }
    
    const rateToUse = customRate ? parseFloat(customRate) : averageRates.avg;
    const annualRate = rateToUse / 100;
    const monthlyRate = annualRate / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                    (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    const fees = customFees ? parseFloat(customFees) : 0;
    const tax = customTax ? (principal * parseFloat(customTax) / 100) / termMonths : 0;
    const insurance = insuranceCost ? parseFloat(insuranceCost) : 0;
    const propTax = propertyTax ? parseFloat(propertyTax) : 0;
    
    return Math.floor(payment + tax + insurance + propTax + (fees / termMonths));
  };

  const handleContinue = () => {
    const numAmount = Number(amount.replace(/,/g, ''));
    router.push(`/loan-offers?type=${loanType}&amount=${numAmount}` as any);
  };

  const formatAmount = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return Number(num).toLocaleString();
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setAmount(formatted);
    setSelectedPreset(null);
  };

  const handlePresetSelect = (preset: number) => {
    setAmount(preset.toLocaleString());
    setSelectedPreset(preset);
  };

  const numAmount = Number(amount.replace(/,/g, ''));
  const isValid = category ? 
    numAmount >= category.minAmount && numAmount <= category.maxAmount :
    numAmount > 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Loan Amount</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.content}>
              <Text style={styles.title}>How much do you need?</Text>
              <Text style={styles.description}>
                {category?.name || 'Loan'} amount
                {category && ` (${formatAmount(category.minAmount.toString())} - ${formatAmount(category.maxAmount.toString())})`}
              </Text>
              
              {loanType === 'auto' && (
                <View style={styles.selectionCard}>
                  <View style={styles.selectionHeader}>
                    <Car color={colors.primary} size={24} />
                    <Text style={styles.selectionTitle}>Vehicle Details</Text>
                  </View>
                  <Text style={styles.selectionSubtitle}>Tell us about the vehicle you&apos;re interested in</Text>
                  
                  <View style={styles.inputRow}>
                    <View style={[styles.inputField, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Year</Text>
                      <TextInput
                        style={styles.textInput}
                        value={vehicleSelection.year}
                        onChangeText={(text) => setVehicleSelection({ ...vehicleSelection, year: text })}
                        placeholder="2024"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputField, { flex: 2, marginLeft: 12 }]}>
                      <Text style={styles.inputLabel}>Make</Text>
                      <TextInput
                        style={styles.textInput}
                        value={vehicleSelection.make}
                        onChangeText={(text) => setVehicleSelection({ ...vehicleSelection, make: text })}
                        placeholder="Toyota"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Model</Text>
                    <TextInput
                      style={styles.textInput}
                      value={vehicleSelection.model}
                      onChangeText={(text) => setVehicleSelection({ ...vehicleSelection, model: text })}
                      placeholder="Camry XSE"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Vehicle Price</Text>
                    <View style={styles.priceInputWrapper}>
                      <DollarSign color={colors.primary} size={20} />
                      <TextInput
                        style={styles.priceInput}
                        value={vehicleSelection.price}
                        onChangeText={(text) => {
                          const formatted = formatAmount(text);
                          setVehicleSelection({ ...vehicleSelection, price: formatted });
                        }}
                        placeholder="35,000"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => Alert.alert(
                      'Vehicle Information',
                      'You can find vehicle prices on dealer websites like Cars.com, AutoTrader, or your local dealer. Enter the total price including any add-ons.'
                    )}
                  >
                    <Info color={colors.primary} size={16} />
                    <Text style={styles.infoButtonText}>Where to find vehicle info</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {loanType === 'home' && (
                <View style={styles.selectionCard}>
                  <View style={styles.selectionHeader}>
                    <Home color={colors.primary} size={24} />
                    <Text style={styles.selectionTitle}>Property Details</Text>
                  </View>
                  <Text style={styles.selectionSubtitle}>Tell us about the property you&apos;re interested in</Text>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Property Type</Text>
                    <View style={styles.propertyTypes}>
                      {['Single Family', 'Condo', 'Townhouse', 'Multi-Family'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.propertyTypeButton,
                            propertySelection.type === type && styles.propertyTypeButtonActive,
                          ]}
                          onPress={() => setPropertySelection({ ...propertySelection, type })}
                        >
                          <Text style={[
                            styles.propertyTypeText,
                            propertySelection.type === type && styles.propertyTypeTextActive,
                          ]}>
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.inputRow}>
                    <View style={[styles.inputField, { flex: 2 }]}>
                      <Text style={styles.inputLabel}>City</Text>
                      <TextInput
                        style={styles.textInput}
                        value={propertySelection.location}
                        onChangeText={(text) => setPropertySelection({ ...propertySelection, location: text })}
                        placeholder="Los Angeles"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                    <View style={[styles.inputField, { flex: 1, marginLeft: 12 }]}>
                      <Text style={styles.inputLabel}>State</Text>
                      <TextInput
                        style={styles.textInput}
                        value={propertySelection.state}
                        onChangeText={(text) => setPropertySelection({ ...propertySelection, state: text })}
                        placeholder="CA"
                        placeholderTextColor={colors.textTertiary}
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Home Price</Text>
                    <View style={styles.priceInputWrapper}>
                      <DollarSign color={colors.primary} size={20} />
                      <TextInput
                        style={styles.priceInput}
                        value={propertySelection.price}
                        onChangeText={(text) => {
                          const formatted = formatAmount(text);
                          setPropertySelection({ ...propertySelection, price: formatted });
                        }}
                        placeholder="450,000"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => Alert.alert(
                      'Property Information',
                      'You can find property prices on Zillow, Realtor.com, Redfin, or through a local real estate agent. Location affects tax rates and insurance costs.'
                    )}
                  >
                    <Info color={colors.primary} size={16} />
                    <Text style={styles.infoButtonText}>Where to find property info</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <DollarSign color={colors.primary} size={32} strokeWidth={2.5} />
                  <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                {category && !isValid && numAmount > 0 && (
                  <Text style={styles.errorText}>
                    Amount must be between ${category.minAmount.toLocaleString()} and ${category.maxAmount.toLocaleString()}
                  </Text>
                )}
              </View>

              <View style={styles.presetsContainer}>
                <Text style={styles.presetsTitle}>Quick Select</Text>
                <View style={styles.presets}>
                  {presetAmounts.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.presetButton,
                        selectedPreset === preset && styles.presetButtonActive,
                      ]}
                      onPress={() => handlePresetSelect(preset)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.presetText,
                          selectedPreset === preset && styles.presetTextActive,
                        ]}
                      >
                        ${(preset / 1000).toFixed(0)}K
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {loanType === 'home' && numAmount > 0 && isValid && (
                <View style={styles.mortgageCalculatorCard}>
                  <Text style={styles.mortgageCalculatorTitle}>Mortgage Calculator</Text>
                  <Text style={styles.mortgageCalculatorSubtitle}>Configure your mortgage details</Text>

                  <View style={styles.downPaymentSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Down Payment</Text>
                      <Text style={styles.sectionValue}>${mortgageDetails.downPaymentAmount.toLocaleString()}</Text>
                    </View>
                    
                    <View style={styles.percentageButtons}>
                      {[5, 10, 15, 20, 30].map((percent) => {
                        const amount = Math.floor((numAmount * percent) / 100);
                        return (
                          <TouchableOpacity
                            key={percent}
                            style={[
                              styles.percentageButton,
                              mortgageDetails.downPaymentPercent === percent && styles.percentageButtonActive,
                            ]}
                            onPress={() => setMortgageDetails(prev => ({ ...prev, downPaymentPercent: percent }))}
                          >
                            <Text style={[
                              styles.percentageButtonText,
                              mortgageDetails.downPaymentPercent === percent && styles.percentageButtonTextActive,
                            ]}>
                              {percent}%
                            </Text>
                            <Text style={[
                              styles.percentageButtonAmount,
                              mortgageDetails.downPaymentPercent === percent && styles.percentageButtonAmountActive,
                            ]}>
                              ${(amount / 1000).toFixed(0)}K
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={styles.customPercentageInput}>
                      <Text style={styles.inputLabel}>Custom Down Payment %</Text>
                      <TextInput
                        style={styles.textInput}
                        value={mortgageDetails.downPaymentPercent.toString()}
                        onChangeText={(text) => {
                          const percent = parseInt(text) || 0;
                          if (percent >= 0 && percent <= 100) {
                            setMortgageDetails(prev => ({ ...prev, downPaymentPercent: percent }));
                          }
                        }}
                        placeholder="20"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.loanProgramSection}>
                    <Text style={styles.sectionTitle}>Loan Program</Text>
                    <Text style={styles.sectionSubtitle}>Select your preferred mortgage type</Text>
                    
                    {[
                      { id: '30-year-fixed' as const, label: '30-Year Fixed', rate: '7.0%', description: 'Most popular, lowest monthly payment' },
                      { id: '15-year-fixed' as const, label: '15-Year Fixed', rate: '6.5%', description: 'Lower rate, higher monthly payment' },
                      { id: '5-year-arm' as const, label: '5-Year ARM', rate: '6.25%', description: 'Adjustable rate, lowest initial rate' },
                    ].map((program) => (
                      <TouchableOpacity
                        key={program.id}
                        style={[
                          styles.loanProgramButton,
                          mortgageDetails.loanProgram === program.id && styles.loanProgramButtonActive,
                        ]}
                        onPress={() => setMortgageDetails(prev => ({ ...prev, loanProgram: program.id, customRate: '' }))}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={styles.loanProgramHeader}>
                            <Text style={[
                              styles.loanProgramLabel,
                              mortgageDetails.loanProgram === program.id && styles.loanProgramLabelActive,
                            ]}>
                              {program.label}
                            </Text>
                            <Text style={[
                              styles.loanProgramRate,
                              mortgageDetails.loanProgram === program.id && styles.loanProgramRateActive,
                            ]}>
                              {program.rate}
                            </Text>
                          </View>
                          <Text style={[
                            styles.loanProgramDescription,
                            mortgageDetails.loanProgram === program.id && styles.loanProgramDescriptionActive,
                          ]}>
                            {program.description}
                          </Text>
                        </View>
                        {mortgageDetails.loanProgram === program.id && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}

                    <View style={styles.customRateInput}>
                      <Text style={styles.inputLabel}>Custom Interest Rate (%)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={mortgageDetails.customRate}
                        onChangeText={(text) => setMortgageDetails(prev => ({ ...prev, customRate: text }))}
                        placeholder="Enter custom rate"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.inputHint}>Leave blank to use program rate</Text>
                    </View>
                  </View>

                  {mortgageDetails.downPaymentPercent < 20 && (
                    <View style={styles.pmiSection}>
                      <View style={styles.pmiHeader}>
                        <Text style={styles.sectionTitle}>Mortgage Insurance (PMI)</Text>
                        <TouchableOpacity
                          style={styles.toggleSwitch}
                          onPress={() => setMortgageDetails(prev => ({ ...prev, includePMI: !prev.includePMI }))}
                        >
                          <View style={[
                            styles.toggleTrack,
                            mortgageDetails.includePMI && styles.toggleTrackActive,
                          ]}>
                            <View style={[
                              styles.toggleThumb,
                              mortgageDetails.includePMI && styles.toggleThumbActive,
                            ]} />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.sectionSubtitle}>
                        Required for down payments less than 20%. Typical rate: 0.3% - 1.5% annually.
                      </Text>
                      {mortgageDetails.includePMI && (
                        <View style={styles.inputField}>
                          <Text style={styles.inputLabel}>PMI Rate (% annually)</Text>
                          <TextInput
                            style={styles.textInput}
                            value={mortgageDetails.pmiRate}
                            onChangeText={(text) => setMortgageDetails(prev => ({ ...prev, pmiRate: text }))}
                            placeholder="0.5"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="decimal-pad"
                          />
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.additionalCostsSection}>
                    <Text style={styles.sectionTitle}>Additional Monthly Costs</Text>
                    
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>Property Tax Rate (% annually)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={mortgageDetails.propertyTaxRate}
                        onChangeText={(text) => setMortgageDetails(prev => ({ ...prev, propertyTaxRate: text }))}
                        placeholder={propertySelection.state ? `${getStatePropertyTaxRate(propertySelection.state).toFixed(2)}% (${propertySelection.state} avg)` : '1.0'}
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="decimal-pad"
                      />
                      {propertySelection.state && (
                        <Text style={styles.inputHint}>
                          Average for {propertySelection.state.toUpperCase()}: {getStatePropertyTaxRate(propertySelection.state).toFixed(2)}%
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>Homeowner Insurance ($/month)</Text>
                      <TextInput
                        style={styles.textInput}
                        value={mortgageDetails.homeInsurance}
                        onChangeText={(text) => setMortgageDetails(prev => ({ ...prev, homeInsurance: text }))}
                        placeholder="200"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                      <Text style={styles.inputHint}>Typical range: $150 - $300/month</Text>
                    </View>

                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>HOA Fees ($/month) - Optional</Text>
                      <TextInput
                        style={styles.textInput}
                        value={mortgageDetails.hoaFees}
                        onChangeText={(text) => setMortgageDetails(prev => ({ ...prev, hoaFees: text }))}
                        placeholder="0"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                      />
                      <Text style={styles.inputHint}>Leave blank if not applicable</Text>
                    </View>
                  </View>

                  <View style={styles.utilitiesSection}>
                    <Text style={styles.sectionTitle}>Utility Fees (Optional)</Text>
                    <Text style={styles.sectionSubtitle}>Include in monthly payment estimate</Text>
                    
                    {[
                      { key: 'water' as const, label: 'Water', placeholder: '50' },
                      { key: 'sewage' as const, label: 'Sewage', placeholder: '40' },
                      { key: 'gas' as const, label: 'Gas', placeholder: '60' },
                      { key: 'internet' as const, label: 'Internet', placeholder: '70' },
                      { key: 'electric' as const, label: 'Electric', placeholder: '120' },
                    ].map((utility) => (
                      <View key={utility.key} style={styles.utilityRow}>
                        <TouchableOpacity
                          style={styles.utilityCheckbox}
                          onPress={() => setMortgageDetails(prev => ({
                            ...prev,
                            utilities: {
                              ...prev.utilities,
                              [utility.key]: {
                                ...prev.utilities[utility.key],
                                include: !prev.utilities[utility.key].include,
                              },
                            },
                          }))}
                        >
                          <View style={[
                            styles.checkbox,
                            mortgageDetails.utilities[utility.key].include && styles.checkboxActive,
                          ]}>
                            {mortgageDetails.utilities[utility.key].include && (
                              <Text style={styles.checkboxCheck}>✓</Text>
                            )}
                          </View>
                          <Text style={styles.utilityLabel}>{utility.label}</Text>
                        </TouchableOpacity>
                        {mortgageDetails.utilities[utility.key].include && (
                          <View style={styles.utilityInputWrapper}>
                            <Text style={styles.dollarSign}>$</Text>
                            <TextInput
                              style={styles.utilityInput}
                              value={mortgageDetails.utilities[utility.key].amount}
                              onChangeText={(text) => setMortgageDetails(prev => ({
                                ...prev,
                                utilities: {
                                  ...prev.utilities,
                                  [utility.key]: {
                                    ...prev.utilities[utility.key],
                                    amount: text,
                                  },
                                },
                              }))}
                              placeholder={utility.placeholder}
                              placeholderTextColor={colors.textTertiary}
                              keyboardType="numeric"
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {numAmount > 0 && isValid && (
                <>
                  <TouchableOpacity
                    style={styles.customizeButton}
                    onPress={() => setShowCustomFields(!showCustomFields)}
                    activeOpacity={0.7}
                  >
                    <Pencil color={colors.primary} size={20} />
                    <Text style={styles.customizeButtonText}>
                      {showCustomFields ? 'Hide' : 'Customize'} Rates & Terms
                    </Text>
                    <ChevronRight
                      color={colors.primary}
                      size={20}
                      style={{ transform: [{ rotate: showCustomFields ? '90deg' : '0deg' }] }}
                    />
                  </TouchableOpacity>
                  
                  {showCustomFields && (
                    <View style={styles.customFieldsCard}>
                      <Text style={styles.customFieldsTitle}>Customize Your Estimate</Text>
                      <Text style={styles.customFieldsSubtitle}>
                        Leave blank to use average rates for your area
                      </Text>
                      
                      <View style={styles.inputRow}>
                        <View style={[styles.inputField, { flex: 1 }]}>
                          <Text style={styles.inputLabel}>Interest Rate (%)</Text>
                          <TextInput
                            style={styles.textInput}
                            value={customRate}
                            onChangeText={setCustomRate}
                            placeholder={`${averageRates.avg}%`}
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="decimal-pad"
                          />
                        </View>
                        {loanType === 'auto' && (
                          <View style={[styles.inputField, { flex: 1, marginLeft: 12 }]}>
                            <Text style={styles.inputLabel}>Sales Tax (%)</Text>
                            <TextInput
                              style={styles.textInput}
                              value={customTax}
                              onChangeText={setCustomTax}
                              placeholder="7.5%"
                              placeholderTextColor={colors.textTertiary}
                              keyboardType="decimal-pad"
                            />
                          </View>
                        )}
                      </View>
                      
                      {loanType === 'auto' && (
                        <View style={styles.inputField}>
                          <Text style={styles.inputLabel}>Dealer Fees ($)</Text>
                          <TextInput
                            style={styles.textInput}
                            value={customFees}
                            onChangeText={setCustomFees}
                            placeholder="500 - 2000"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="numeric"
                          />
                        </View>
                      )}
                      
                      {loanType === 'home' && (
                        <>
                          <View style={styles.inputField}>
                            <Text style={styles.inputLabel}>Home Insurance ($/month)</Text>
                            <TextInput
                              style={styles.textInput}
                              value={insuranceCost}
                              onChangeText={setInsuranceCost}
                              placeholder="150 - 300"
                              placeholderTextColor={colors.textTertiary}
                              keyboardType="numeric"
                            />
                          </View>
                          
                          <View style={styles.inputField}>
                            <Text style={styles.inputLabel}>Property Tax ($/month)</Text>
                            <TextInput
                              style={styles.textInput}
                              value={propertyTax}
                              onChangeText={setPropertyTax}
                              placeholder="300 - 800"
                              placeholderTextColor={colors.textTertiary}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}
                      
                      <View style={styles.averageRatesCard}>
                        <Text style={styles.averageRatesTitle}>Average Rates for {category?.name}</Text>
                        <View style={styles.averageRatesRow}>
                          <View style={styles.averageRateItem}>
                            <Text style={styles.averageRateLabel}>Low</Text>
                            <Text style={styles.averageRateValue}>{averageRates.min}%</Text>
                          </View>
                          <View style={styles.averageRateItem}>
                            <Text style={styles.averageRateLabel}>Average</Text>
                            <Text style={[styles.averageRateValue, { color: colors.primary }]}>
                              {averageRates.avg}%
                            </Text>
                          </View>
                          <View style={styles.averageRateItem}>
                            <Text style={styles.averageRateLabel}>High</Text>
                            <Text style={styles.averageRateValue}>{averageRates.max}%</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  
                  <View style={styles.termsSection}>
                    <View style={styles.termsSectionHeader}>
                      <View>
                        <Text style={styles.termsSectionTitle}>{loanType === 'home' ? 'Monthly Payment' : 'Select Loan Term'}</Text>
                        <Text style={styles.termsSectionSubtitle}>{loanType === 'home' ? 'Your estimated monthly payment' : 'Choose your preferred payment period'}</Text>
                      </View>
                      {loanType === 'home' && (
                        <TouchableOpacity
                          style={styles.breakdownButton}
                          onPress={() => setShowPaymentBreakdown(!showPaymentBreakdown)}
                        >
                          <Text style={styles.breakdownButtonText}>
                            {showPaymentBreakdown ? 'Hide' : 'Show'} Breakdown
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {loanType === 'home' && showPaymentBreakdown && (
                      <View style={styles.paymentBreakdownCard}>
                        <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
                        {(() => {
                          const homePrice = numAmount;
                          const term = mortgageDetails.loanProgram === '15-year-fixed' ? 180 : mortgageDetails.loanProgram === '5-year-arm' ? 60 : 360;
                          const breakdown = calculateMortgagePayment(homePrice, term);
                          
                          return (
                            <>
                              <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Principal & Interest</Text>
                                <Text style={styles.breakdownValue}>${breakdown.principalAndInterest.toLocaleString()}</Text>
                              </View>
                              {breakdown.pmi > 0 && (
                                <View style={styles.breakdownRow}>
                                  <Text style={styles.breakdownLabel}>Mortgage Insurance (PMI)</Text>
                                  <Text style={styles.breakdownValue}>${breakdown.pmi.toLocaleString()}</Text>
                                </View>
                              )}
                              <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Property Tax</Text>
                                <Text style={styles.breakdownValue}>${breakdown.propertyTax.toLocaleString()}</Text>
                              </View>
                              {breakdown.homeInsurance > 0 && (
                                <View style={styles.breakdownRow}>
                                  <Text style={styles.breakdownLabel}>Home Insurance</Text>
                                  <Text style={styles.breakdownValue}>${breakdown.homeInsurance.toLocaleString()}</Text>
                                </View>
                              )}
                              {breakdown.hoaFees > 0 && (
                                <View style={styles.breakdownRow}>
                                  <Text style={styles.breakdownLabel}>HOA Fees</Text>
                                  <Text style={styles.breakdownValue}>${breakdown.hoaFees.toLocaleString()}</Text>
                                </View>
                              )}
                              {breakdown.utilities > 0 && (
                                <View style={styles.breakdownRow}>
                                  <Text style={styles.breakdownLabel}>Utilities</Text>
                                  <Text style={styles.breakdownValue}>${breakdown.utilities.toLocaleString()}</Text>
                                </View>
                              )}
                              <View style={styles.breakdownDivider} />
                              <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabelTotal}>Total Monthly Payment</Text>
                                <Text style={styles.breakdownValueTotal}>${breakdown.total.toLocaleString()}</Text>
                              </View>
                            </>
                          );
                        })()}
                      </View>
                    )}
                    
                    {loanType === 'home' ? (
                      <View style={styles.homePaymentDisplay}>
                        {(() => {
                          const homePrice = numAmount;
                          const loanAmount = homePrice - mortgageDetails.downPaymentAmount;
                          const term = mortgageDetails.loanProgram === '15-year-fixed' ? 180 : mortgageDetails.loanProgram === '5-year-arm' ? 60 : 360;
                          const payment = calculateMortgagePayment(homePrice, term);
                          
                          return (
                            <View style={styles.homePaymentCard}>
                              <Text style={styles.homePaymentLabel}>Estimated Monthly Payment</Text>
                              <Text style={styles.homePaymentAmount}>${payment.total.toLocaleString()}</Text>
                              <View style={styles.homePaymentDetails}>
                                <Text style={styles.homePaymentDetail}>Loan Amount: ${loanAmount.toLocaleString()}</Text>
                                <Text style={styles.homePaymentDetail}>Term: {term / 12} years</Text>
                                <Text style={styles.homePaymentDetail}>Rate: {getLoanProgramRate().toFixed(2)}%</Text>
                              </View>
                            </View>
                          );
                        })()}
                      </View>
                    ) : (
                      <View style={styles.termsGrid}>
                        {termOptions.map((term) => {
                          const monthlyPayment = calculateMonthlyPayment(numAmount, term);
                          const totalPayment = monthlyPayment * term;
                          const isSelected = selectedTerm === term;
                          
                          return (
                            <View key={term} style={styles.termCardWrapper}>
                              <TouchableOpacity
                                style={[
                                  styles.termCard,
                                  isSelected && styles.termCardActive,
                                ]}
                                onPress={() => setSelectedTerm(term)}
                                activeOpacity={0.7}
                              >
                                <View style={styles.termHeader}>
                                  <Text style={[
                                    styles.termMonths,
                                    isSelected && styles.termMonthsActive,
                                  ]}>
                                    {term} mo
                                  </Text>
                                  {isSelected && (
                                    <View style={styles.selectedBadge}>
                                      <Text style={styles.selectedBadgeText}>✓</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={[
                                  styles.termPayment,
                                  isSelected && styles.termPaymentActive,
                                ]}>
                                  ${monthlyPayment.toLocaleString()}
                                </Text>
                                <Text style={[
                                  styles.termLabel,
                                  isSelected && styles.termLabelActive,
                                ]}>
                                  per month
                                </Text>
                                <View style={styles.termDivider} />
                                <Text style={[
                                  styles.termTotal,
                                  isSelected && styles.termTotalActive,
                                ]}>
                                  ${totalPayment.toLocaleString()} total
                                </Text>
                              </TouchableOpacity>
                              {isSelected && (
                                <Text style={styles.termInfo}>{getTermInfo(term)}</Text>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                  
                    <View style={styles.estimateDisclaimerCard}>
                      <Info color={colors.primary} size={20} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.estimateDisclaimerTitle}>This is an Estimate</Text>
                        <Text style={styles.estimateDisclaimerText}>
                          These calculations are estimates based on {customRate ? 'your custom rate' : `an average ${averageRates.avg}% APR`}. 
                          Actual rates, fees, and terms will be determined by the lender based on your credit score, 
                          income, and other factors. Final amounts may vary.
                        </Text>
                        {customRate && (
                          <Text style={[styles.estimateDisclaimerText, { marginTop: 8, fontWeight: '600' as const }]}>
                            Custom rate in use: {customRate}% APR
                          </Text>
                        )}
                      </View>
                    </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isValid && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isValid}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 48,
    fontWeight: '700' as const,
    color: colors.text,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 8,
    marginLeft: 4,
  },
  presetsContainer: {
    marginBottom: 32,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  presetButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  presetTextActive: {
    color: colors.white,
  },
  termsSection: {
    marginBottom: 24,
  },
  termsSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  termsSectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  termsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  termCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
  },
  termCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    ...colors.shadow,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  termMonths: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    textTransform: 'uppercase',
  },
  termMonthsActive: {
    color: colors.white,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  termPayment: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.primary,
    marginBottom: 2,
  },
  termPaymentActive: {
    color: colors.white,
  },
  termLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  termLabelActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  termDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 6,
  },
  termTotal: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  termTotalActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  selectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginLeft: 12,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputField: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
  },
  propertyTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  propertyTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  propertyTypeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  propertyTypeTextActive: {
    color: colors.white,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 4,
  },
  infoButtonText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '600' as const,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customizeButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
    marginLeft: 12,
  },
  customFieldsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customFieldsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  customFieldsSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  averageRatesCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  averageRatesTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  averageRatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageRateItem: {
    alignItems: 'center',
  },
  averageRateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  averageRateValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  termCardWrapper: {
    width: '48%',
  },
  termInfo: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    paddingHorizontal: 4,
    lineHeight: 15,
  },
  estimateDisclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFE69C',
  },
  estimateDisclaimerTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  estimateDisclaimerText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    ...colors.shadow,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.white,
  },
  mortgageCalculatorCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mortgageCalculatorTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  mortgageCalculatorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  downPaymentSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  sectionValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  percentageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  percentageButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 70,
  },
  percentageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  percentageButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  percentageButtonTextActive: {
    color: colors.white,
  },
  percentageButtonAmount: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  percentageButtonAmountActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  customPercentageInput: {
    marginTop: 8,
  },
  loanProgramSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  loanProgramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  loanProgramButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  loanProgramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loanProgramLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  loanProgramLabelActive: {
    color: colors.white,
  },
  loanProgramRate: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  loanProgramRateActive: {
    color: colors.white,
  },
  loanProgramDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loanProgramDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  customRateInput: {
    marginTop: 8,
  },
  inputHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  pmiSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleSwitch: {
    padding: 4,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    ...colors.shadow,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  additionalCostsSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  utilitiesSection: {
    marginBottom: 0,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  utilityCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.white,
  },
  utilityLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  utilityInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    width: 100,
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginRight: 4,
  },
  utilityInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  termsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  breakdownButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  breakdownButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.white,
  },
  paymentBreakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  breakdownLabelTotal: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  breakdownValueTotal: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: colors.primary,
  },
  homePaymentDisplay: {
    marginBottom: 20,
  },
  homePaymentCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...colors.shadow,
  },
  homePaymentLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  homePaymentAmount: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: colors.white,
    marginBottom: 16,
  },
  homePaymentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  homePaymentDetail: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
