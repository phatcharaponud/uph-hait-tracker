import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { EXERCISES } from '../data/exercises';
import { usePatientStore } from '../store/patientStore';
import { daysBetween, todayIso } from '../lib/thaiDate';
import { getPhaseKey } from '../data/timeline';

interface Props {
  navigation: any;
}

export function ExercisesScreen({ navigation }: Props) {
  const { profile } = usePatientStore();

  const phaseKey = useMemo(() => {
    if (!profile.surgeryDate) return 'pre_op';
    return getPhaseKey(daysBetween(profile.surgeryDate, todayIso()));
  }, [profile.surgeryDate]);

  const list = useMemo(() => {
    return EXERCISES.map((ex) => ({
      ...ex,
      recommended: ex.phase.includes(phaseKey as any),
    })).sort((a, b) => Number(b.recommended) - Number(a.recommended));
  }, [phaseKey]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ท่าออกกำลังกาย</Text>
        <Text style={styles.headerSub}>
          เน้นเสริม Quadriceps และเพิ่มช่วงการเคลื่อนไหวเข่า
        </Text>
      </View>
      <FlatList
        data={list}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })}
            style={styles.card}
            activeOpacity={0.85}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.name}>{item.name}</Text>
              {item.recommended && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>แนะนำ</Text>
                </View>
              )}
            </View>
            <Text style={styles.muscle}>{item.targetMuscle}</Text>
            <Text style={styles.meta}>
              {item.sets} เซ็ต × {item.reps} ครั้ง
              {item.holdSeconds > 0 ? ` (ค้าง ${item.holdSeconds} วิ)` : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: 0 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.primary },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  muscle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  meta: { fontSize: 13, color: colors.primary, marginTop: spacing.sm, fontWeight: '600' },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
