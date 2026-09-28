import { MD3DarkTheme } from 'react-native-paper';

export const Colors = {
  // Required Palette
  background: '#0F1117',
  card: '#1A1D26',
  cardBorder: '#262A36',
  cardBorderSubtle: '#1F232E',
  cardElevated: '#212532',
  
  primary: '#4F8CFF',
  primaryGlow: 'rgba(79, 140, 255, 0.16)',
  primaryMuted: '#243B6B',
  
  success: '#00C896',
  successGlow: 'rgba(0, 200, 150, 0.16)',
  successMuted: '#103F33',
  
  warning: '#F7B731',
  warningGlow: 'rgba(247, 183, 49, 0.16)',
  warningMuted: '#4D3B12',
  
  danger: '#FF5C5C',
  dangerGlow: 'rgba(255, 92, 92, 0.16)',
  dangerMuted: '#4E1F1F',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A6B1',
  textMuted: '#5F6676',
  textDark: '#3A3F4D',
  
  surfaceSubtle: '#141720',
  divider: '#202430',
  overlay: 'rgba(15, 17, 23, 0.85)',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  sizes: {
    hero: 40,
    title1: 28,
    title2: 22,
    title3: 18,
    body: 15,
    callout: 13,
    caption: 11,
    micro: 9,
  },
};

export const Layout = {
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export const lifeOSPaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: Colors.background,
    surface: Colors.card,
    surfaceVariant: Colors.surfaceSubtle,
    primary: Colors.primary,
    onPrimary: Colors.textPrimary,
    onBackground: Colors.textPrimary,
    onSurface: Colors.textPrimary,
    onSurfaceVariant: Colors.textSecondary,
    outline: Colors.cardBorder,
    error: Colors.danger,
  },
};
