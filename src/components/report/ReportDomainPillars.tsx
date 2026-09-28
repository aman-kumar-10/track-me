import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';
import { AppCard } from '../common/AppCard';

interface ReportDomainPillarsProps {
  disciplineAssessment: string;
  fitnessAssessment: string;
  learningAssessment: string;
  spendingAssessment: string;
}

export const ReportDomainPillars: React.FC<ReportDomainPillarsProps> = ({
  disciplineAssessment,
  fitnessAssessment,
  learningAssessment,
  spendingAssessment,
}) => {
  const domains = [
    {
      title: 'DISCIPLINE & CIRCADIAN',
      icon: 'weather-sunset-up',
      color: Colors.warning,
      content: disciplineAssessment,
    },
    {
      title: 'FITNESS & CONDITIONING',
      icon: 'dumbbell',
      color: Colors.danger,
      content: fitnessAssessment,
    },
    {
      title: 'LEARNING & INTELLECTUAL',
      icon: 'book-open-page-variant-outline',
      color: '#9D65FF',
      content: learningAssessment,
    },
    {
      title: 'FINANCIAL CONTROL',
      icon: 'currency-usd',
      color: Colors.success,
      content: spendingAssessment,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>DOMAIN INTELLIGENCE AUDIT</Text>

      {domains.map((d) => (
        <AppCard key={d.title} style={styles.pillarCard}>
          <View style={styles.pillarHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${d.color}1A`, borderColor: `${d.color}33` }]}>
              <MaterialCommunityIcons name={d.icon as any} size={16} color={d.color} />
            </View>
            <Text style={styles.pillarTitle}>{d.title}</Text>
          </View>
          <Text style={styles.pillarContent}>{d.content}</Text>
        </AppCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.lg,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.1,
    marginBottom: Layout.spacing.sm,
  },
  pillarCard: {
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  pillarContent: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontWeight: '400',
  },
});
