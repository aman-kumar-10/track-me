import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors, Layout } from '../../constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'subtle' | 'bordered';
  glowColor?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'default',
  glowColor,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return Colors.cardElevated;
      case 'subtle':
        return Colors.surfaceSubtle;
      default:
        return Colors.card;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: glowColor ? glowColor : Colors.cardBorder,
        },
        glowColor ? { borderWidth: 1.2 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    padding: Layout.spacing.lg,
    overflow: 'hidden',
  },
});
