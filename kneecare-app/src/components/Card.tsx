import React from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ title, subtitle, children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
