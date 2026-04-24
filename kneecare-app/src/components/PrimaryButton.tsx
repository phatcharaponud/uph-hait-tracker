import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, variant = 'solid', disabled, style }: Props) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.label,
          (isOutline || isGhost) && { color: colors.primary },
          isDanger && { color: colors.surface },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
});
