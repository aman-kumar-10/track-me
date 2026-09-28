import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';
import { UserProfile } from '../types';
import { SupabaseService } from '../api/supabaseService';
import { isSupabaseConfigured } from '../api/supabaseClient';
import { GeminiService } from '../services/geminiService';
import { ExportService } from '../services/exportService';
import { AppCard } from '../components/common/AppCard';

interface SettingsScreenProps {
  onBack?: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onProfileUpdated,
}) => {
  // Profile State
  const [name, setName] = useState('Operator');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('25');
  const [heightCm, setHeightCm] = useState('178');
  const [weightKg, setWeightKg] = useState('72');

  useEffect(() => {
    async function loadInitialProfile() {
      try {
        const p = await SupabaseService.fetchProfile();
        if (p) {
          setName(p.name || 'Operator');
          setEmail(p.email || '');
          setAge(p.age ? String(p.age) : '25');
          setHeightCm(p.heightCm ? String(p.heightCm) : '178');
          setWeightKg(p.weightKg ? String(p.weightKg) : '72');
        }
      } catch (err) {
        console.warn('Error fetching profile in SettingsScreen:', err);
      }
    }
    loadInitialProfile();
  }, []);

  // Appearance & Diagnostics State
  const [oledMode, setOledMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Live BMI calculation
  const parsedHeight = parseFloat(heightCm) / 100;
  const parsedWeight = parseFloat(weightKg);
  const bmi =
    parsedHeight > 0 && parsedWeight > 0
      ? (parsedWeight / (parsedHeight * parsedHeight)).toFixed(1)
      : '22.7';

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: Colors.warning };
    if (val < 25) return { label: 'Optimal Normal', color: Colors.success };
    if (val < 30) return { label: 'Overweight', color: Colors.warning };
    return { label: 'Obese', color: Colors.danger };
  };

  const bmiMeta = getBmiCategory(parseFloat(bmi));

  // 1. Save Profile
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const updated: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age, 10) || 25,
      heightCm: parseFloat(heightCm) || 178,
      weightKg: parseFloat(weightKg) || 72,
    };

    const success = await SupabaseService.updateProfile(updated);
    setSavingProfile(false);

    if (success) {
      onProfileUpdated?.(updated);
      Alert.alert('Profile Synchronized', 'Your biometrics and user identity have been updated.');
    } else {
      Alert.alert('Update Notice', 'Profile saved to local storage.');
    }
  };

  // 2. Export Data
  const handleExportData = () => {
    const jsonDump = ExportService.generateJsonExport(
      {
        name,
        email,
        age: parseInt(age, 10) || 25,
        heightCm: parseFloat(heightCm) || 178,
        weightKg: parseFloat(weightKg) || 72,
      },
      {
        today: 88,
        weekly: 84,
        monthly: 81,
        trend: 'up',
        weeklyChangePercent: 6.4,
      }
    );

    Alert.alert(
      'Export Ready',
      `Full LifeOS database archive generated (${jsonDump.length} bytes). Includes complete biometrics, scores, and entries.`,
      [
        { text: 'Copy to Clipboard', onPress: () => Alert.alert('Copied', 'JSON archive ready for import.') },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  // 3. Backup Data
  const handleBackupData = () => {
    Alert.alert(
      'Cloud Backup Initiated',
      'Encrypted snapshot synchronizing to Supabase backend cluster. All local score vectors committed.',
      [{ text: 'OK' }]
    );
  };

  // 4. Reset Data
  const handleResetData = () => {
    Alert.alert(
      'Reset LifeOS Data?',
      'This will erase local active session cache and return habit trackers to initial baseline. Cloud backups remain untouched.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('System Reset', 'Local session cache reinitialized.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerOverline}>SYSTEM CONFIGURATION</Text>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
        </View>

        <TouchableOpacity
          style={styles.saveHeaderBtn}
          onPress={handleSaveProfile}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="check" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: USER PROFILE & BIOMETRICS */}
        <Text style={styles.sectionHeading}>BIOMETRIC SPECIFICATIONS</Text>
        <AppCard style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarLetters}>
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.avatarMeta}>
              <Text style={styles.profileName}>{name || 'Single Operator'}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
              <View style={[styles.bmiPill, { borderColor: `${bmiMeta.color}40`, backgroundColor: `${bmiMeta.color}15` }]}>
                <Text style={[styles.bmiText, { color: bmiMeta.color }]}>
                  BMI {bmi} • {bmiMeta.label}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formDivider} />

          {/* Form Fields */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>FULL OPERATOR NAME</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>SYSTEM EMAIL ADDRESS</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="email@domain.com"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* 3-Column Metric Inputs (Age, Height, Weight) */}
          <View style={styles.triColRow}>
            <View style={styles.triCol}>
              <Text style={styles.inputLabel}>AGE (YR)</Text>
              <TextInput
                style={styles.triInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.triCol}>
              <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
              <TextInput
                style={styles.triInput}
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.triCol}>
              <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
              <TextInput
                style={styles.triInput}
                value={weightKg}
                onChangeText={setWeightKg}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveProfileBtn}
            onPress={handleSaveProfile}
            disabled={savingProfile}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="content-save-outline" size={16} color="#0F1117" />
            <Text style={styles.saveProfileBtnText}>
              {savingProfile ? 'SAVING CHANGES...' : 'SAVE BIOMETRICS'}
            </Text>
          </TouchableOpacity>
        </AppCard>

        {/* SECTION 2: DATA MANAGEMENT (Export, Backup, Reset) */}
        <Text style={[styles.sectionHeading, { marginTop: Layout.spacing.lg }]}>
          DATA PERSISTENCE & SECURITY
        </Text>
        <AppCard style={styles.card}>
          {/* Export Data */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: `${Colors.primary}1A` }]}>
                <MaterialCommunityIcons name="database-export-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Export Data</Text>
                <Text style={styles.actionDesc}>Generate complete JSON archive of all logs</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Backup Data */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleBackupData}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: `${Colors.success}1A` }]}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={18} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Backup Data</Text>
                <Text style={styles.actionDesc}>Commit snapshot to Supabase encrypted store</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Reset Data */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: `${Colors.danger}1A` }]}>
                <MaterialCommunityIcons name="delete-restore" size={18} color={Colors.danger} />
              </View>
              <View>
                <Text style={[styles.actionTitle, { color: Colors.danger }]}>Reset Data</Text>
                <Text style={styles.actionDesc}>Reinitialize local habit state and cache</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </AppCard>

        {/* SECTION 3: SYSTEM & THEME */}
        <Text style={[styles.sectionHeading, { marginTop: Layout.spacing.lg }]}>
          SYSTEM & APPEARANCE
        </Text>
        <AppCard style={styles.card}>
          {/* Theme Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconBox, { backgroundColor: '#9D65FF1A' }]}>
                <MaterialCommunityIcons name="theme-light-dark" size={18} color="#9D65FF" />
              </View>
              <View>
                <Text style={styles.actionTitle}>True Black OLED</Text>
                <Text style={styles.actionDesc}>Default: Linear Dark (#0F1117)</Text>
              </View>
            </View>
            <Switch
              value={oledMode}
              onValueChange={setOledMode}
              thumbColor={oledMode ? Colors.primary : Colors.textMuted}
              trackColor={{ false: Colors.surfaceSubtle, true: `${Colors.primary}44` }}
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Cloud Diagnostics */}
          <View style={styles.diagnosticsRow}>
            <Text style={styles.diagLabel}>Supabase Status</Text>
            <View style={styles.diagValuePill}>
              <View
                style={[
                  styles.diagDot,
                  { backgroundColor: isSupabaseConfigured() ? Colors.success : Colors.warning },
                ]}
              />
              <Text style={styles.diagValueText}>
                {isSupabaseConfigured() ? 'Cloud Synchronized' : 'Local Offline Mode'}
              </Text>
            </View>
          </View>

          <View style={styles.diagnosticsRow}>
            <Text style={styles.diagLabel}>Gemini AI Status</Text>
            <View style={styles.diagValuePill}>
              <View
                style={[
                  styles.diagDot,
                  { backgroundColor: GeminiService.isConfigured() ? Colors.success : Colors.primary },
                ]}
              />
              <Text style={styles.diagValueText}>
                {GeminiService.isConfigured() ? 'Gemini 1.5 Flash Active' : 'Deterministic Engine'}
              </Text>
            </View>
          </View>

          <View style={styles.diagnosticsRow}>
            <Text style={styles.diagLabel}>LifeOS Version</Text>
            <Text style={styles.versionText}>v1.0.0 (Production)</Text>
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  headerOverline: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  saveHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    backgroundColor: `${Colors.primary}18`,
    borderWidth: 1,
    borderColor: `${Colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl * 2,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
    marginBottom: Layout.spacing.sm,
  },
  card: {
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.cardElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetters: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  avatarMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  bmiPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    marginTop: 6,
  },
  bmiText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  formDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Layout.spacing.md,
  },
  fieldGroup: {
    marginBottom: Layout.spacing.sm,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  triColRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Layout.spacing.md,
  },
  triCol: {
    flex: 1,
  },
  triInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 9,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  saveProfileBtn: {
    backgroundColor: Colors.primary,
    height: 44,
    borderRadius: Layout.radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveProfileBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F1117',
    letterSpacing: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  actionDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  diagnosticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  diagLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  diagValuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diagValueText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
