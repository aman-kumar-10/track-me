import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants/theme';

export type ScreenTab = 'dashboard' | 'entry' | 'report' | 'stats' | 'settings';

interface BottomTabBarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

interface TabButtonProps {
  item: { key: ScreenTab; label: string; icon: string };
  isActive: boolean;
  onPress: () => void;
}

const AnimatedTabButton: React.FC<TabButtonProps> = ({ item, isActive, onPress }) => {
  const [scaleAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.tabBtn, isActive && styles.tabBtnActive]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={19}
          color={isActive ? Colors.primary : Colors.textMuted}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { key: ScreenTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'view-dashboard-outline' },
    { key: 'entry', label: 'Daily Log', icon: 'plus-circle-outline' },
    { key: 'stats', label: 'Analytics', icon: 'chart-timeline-variant' },
    { key: 'report', label: 'AI Review', icon: 'creation' },
    { key: 'settings', label: 'Settings', icon: 'cog-outline' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <AnimatedTabButton
          key={tab.key}
          item={tab}
          isActive={currentTab === tab.key}
          onPress={() => onSelectTab(tab.key)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#12151E',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingVertical: 7,
    paddingHorizontal: Layout.spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBtn: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: Layout.radius.sm,
    gap: 3,
  },
  tabBtnActive: {
    backgroundColor: `${Colors.primary}15`,
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
