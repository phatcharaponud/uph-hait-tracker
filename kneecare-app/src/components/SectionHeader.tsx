import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
