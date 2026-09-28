import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { UserProfile } from '../../types';

interface ProfileStatsHeaderProps {
  profile: UserProfile;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
}

export const ProfileStatsHeader: React.FC<ProfileStatsHeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenSettings,
}) => {
  // Calculate BMI
  const heightM = profile.heightCm / 100;
  const bmi = heightM > 0 ? (profile.weightKg / (heightM * heightM)).toFixed(1) : '22.0';

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return 'OP';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'OP';
    return parts
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {/* Top Bar: Profile Monogram, Name & Settings Button */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenProfile}
          style={styles.profileIdentifier}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
          </View>
          <View>
            <View style={styles.systemBadgeRow}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.systemTag}>LIFE OS / ACTIVE</Text>
            </View>
            <Text style={styles.userName}>{profile.name}</Text>
          </View>
        </TouchableOpacity>

        {/* Date and Action Icons */}
        <View style={styles.rightActions}>
          <View style={styles.datePill}>
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={13}
              color={Colors.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.dateText}>{currentDateFormatted}</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="cog-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Biometric Stats Strip (Age, Height, Weight, BMI) */}
      <View style={styles.biometricStrip}>
        <View style={styles.bioMetricItem}>
          <Text style={styles.bioLabel}>AGE</Text>
          <Text style={styles.bioValue}>{profile.age} <Text style={styles.bioUnit}>yr</Text></Text>
        </View>

        <View style={styles.bioDivider} />

        <View style={styles.bioMetricItem}>
          <Text style={styles.bioLabel}>HEIGHT</Text>
          <Text style={styles.bioValue}>{profile.heightCm} <Text style={styles.bioUnit}>cm</Text></Text>
        </View>

        <View style={styles.bioDivider} />

        <View style={styles.bioMetricItem}>
          <Text style={styles.bioLabel}>WEIGHT</Text>
          <Text style={styles.bioValue}>{profile.weightKg} <Text style={styles.bioUnit}>kg</Text></Text>
        </View>

        <View style={styles.bioDivider} />

        <View style={styles.bioMetricItem}>
          <Text style={styles.bioLabel}>BMI</Text>
          <Text style={[styles.bioValue, { color: Colors.success }]}>
            {bmi}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  profileIdentifier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.cardElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  systemBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  systemTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Layout.radius.sm,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: Layout.spacing.md,
  },
  bioMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  bioDivider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.divider,
  },
  bioLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  bioValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bioUnit: {
    fontSize: 10,
    fontWeight: '400',
    color: Colors.textMuted,
  },
});
