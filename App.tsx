import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lifeOSPaperTheme, Colors } from './src/constants/theme';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { DailyEntryScreen } from './src/screens/DailyEntryScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { WeeklyReportScreen } from './src/screens/WeeklyReportScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomTabBar, ScreenTab } from './src/components/navigation/BottomTabBar';
import { SupabaseService } from './src/api/supabaseService';
import { calculateDailyScores } from './src/services/scoringEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={lifeOSPaperTheme}>
        <View style={styles.rootContainer}>
          <View style={styles.screenContainer}>
            {currentTab === 'dashboard' && (
              <DashboardScreen
                onNavigateToEntry={() => setCurrentTab('entry')}
                onNavigateToStats={() => setCurrentTab('stats')}
                onNavigateToSettings={() => setCurrentTab('settings')}
                refreshTrigger={refreshTrigger}
              />
            )}

            {currentTab === 'entry' && (
              <DailyEntryScreen
                onBack={() => setCurrentTab('dashboard')}
                onSaveSuccess={() => {
                  setRefreshTrigger((prev) => prev + 1);
                  setCurrentTab('dashboard');
                }}
              />
            )}

            {currentTab === 'stats' && (
              <StatisticsScreen onBack={() => setCurrentTab('dashboard')} />
            )}

            {currentTab === 'report' && (
              <WeeklyReportScreen onBack={() => setCurrentTab('dashboard')} />
            )}

            {currentTab === 'settings' && (
              <SettingsScreen
                onBack={() => setCurrentTab('dashboard')}
                onProfileUpdated={() => setRefreshTrigger((prev) => prev + 1)}
              />
            )}
          </View>

          <BottomTabBar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
