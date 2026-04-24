import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function ScoreSlider({ value, onChange, min = 0, max = 10, label }: Props) {
  const items = [];
  for (let i = min; i <= max; i++) items.push(i);
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {items.map((n) => {
          const active = n === value;
          let bg = colors.painLow;
          if (n >= 4 && n <= 6) bg = colors.painMid;
          if (n >= 7) bg = colors.painHigh;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onChange(n)}
              style={[
                styles.dot,
                { backgroundColor: active ? bg : colors.border, borderColor: active ? bg : colors.border },
              ]}
            >
              <Text style={[styles.num, { color: active ? '#fff' : colors.textSecondary }]}>{n}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  num: {
    fontSize: 13,
    fontWeight: '600',
  },
});
