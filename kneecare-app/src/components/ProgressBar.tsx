import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  value: number;
  max?: number;
  label?: string;
}

export function ProgressBar({ value, max = 100, label }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.caption}>{Math.round(pct)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  track: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
