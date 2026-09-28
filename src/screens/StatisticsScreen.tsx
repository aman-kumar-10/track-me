import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/theme';
import { Timeframe, StatisticsService, DomainStatistics } from '../services/statisticsService';
import { TimeframeSelector } from '../components/charts/TimeframeSelector';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { BarVolumeChart } from '../components/charts/BarVolumeChart';

interface StatisticsScreenProps {
  onBack?: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [stats, setStats] = useState<DomainStatistics>(() => StatisticsService.getEmptyStatistics());

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const liveStats = await StatisticsService.getStatistics(timeframe);
        if (isMounted) {
          setStats(liveStats);
        }
      } catch (err) {
        console.warn('Error loading stats in StatisticsScreen:', err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [timeframe]);



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
          <Text style={styles.headerOverline}>PERFORMANCE HORIZONS</Text>
          <Text style={styles.headerTitle}>Analytics & Trends</Text>
        </View>

        <View style={styles.timeframePill}>
          <Text style={styles.timeframePillText}>{timeframe.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeframe Selector (Weekly, Monthly, Yearly) */}
        <TimeframeSelector
          selectedTimeframe={timeframe}
          onSelect={(tf) => setTimeframe(tf)}
        />

        {/* Executive Aggregate Metric Cards Strip */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>AVG DISCIPLINE</Text>
            <Text style={[styles.summaryValue, { color: Colors.primary }]}>
              {stats.discipline.currentAverage}%
            </Text>
            <Text style={styles.summarySub}>Target: ≥85%</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL DEEP WORK</Text>
            <Text style={[styles.summaryValue, { color: '#9D65FF' }]}>
              {(stats.study.totalVolume! / 60).toFixed(1)} hrs
            </Text>
            <Text style={styles.summarySub}>Goal: 90m/day</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL SPENT</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>
              ₹{stats.expenses.totalVolume?.toFixed(0)}
            </Text>
            <Text style={styles.summarySub}>Controlled</Text>
          </View>
        </View>

        {/* 1. DISCIPLINE TREND */}
        <TrendLineChart
          title="Discipline Score Index"
          categoryTag="CORE CONSISTENCY"
          points={stats.discipline.points}
          averageValue={stats.discipline.currentAverage}
          peakValue={stats.discipline.peakValue}
          targetValue={stats.discipline.targetValue}
          unit="%"
          accentColor={Colors.primary}
          deltaPercent={stats.discipline.deltaPercent}
        />

        {/* 2. STUDY TREND */}
        <BarVolumeChart
          title="Deep Work & Study Duration"
          categoryTag="INTELLECTUAL PRODUCTION"
          points={stats.study.points}
          averageValue={stats.study.currentAverage}
          totalVolume={stats.study.totalVolume}
          targetValue={stats.study.targetValue}
          unit="m"
          accentColor="#9D65FF"
          deltaPercent={stats.study.deltaPercent}
        />

        {/* 3. EXPENSE TREND */}
        <BarVolumeChart
          title="Financial Outflow Volume"
          categoryTag="CAPITAL DISCIPLINE"
          points={stats.expenses.points}
          averageValue={stats.expenses.currentAverage}
          totalVolume={stats.expenses.totalVolume}
          targetValue={stats.expenses.targetValue}
          prefix="₹"
          accentColor={Colors.success}
          deltaPercent={stats.expenses.deltaPercent}
        />

        {/* 4. WORKOUT TREND */}
        <TrendLineChart
          title="Workout Session Volume"
          categoryTag="PHYSICAL CONDITIONING"
          points={stats.workout.points}
          averageValue={stats.workout.currentAverage}
          peakValue={stats.workout.peakValue}
          targetValue={stats.workout.targetValue}
          unit="m"
          accentColor={Colors.danger}
          deltaPercent={stats.workout.deltaPercent}
        />

        {/* 5. WATER INTAKE TREND */}
        <BarVolumeChart
          title="Cellular Hydration Intake"
          categoryTag="METABOLIC HEALTH"
          points={stats.water.points}
          averageValue={stats.water.currentAverage}
          totalVolume={stats.water.totalVolume}
          targetValue={stats.water.targetValue}
          unit=" ml"
          accentColor={Colors.primary}
          deltaPercent={stats.water.deltaPercent}
        />
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
  timeframePill: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Layout.radius.sm,
  },
  timeframePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  scrollContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl * 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 12,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.divider,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  summarySub: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
