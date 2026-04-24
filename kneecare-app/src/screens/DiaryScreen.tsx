import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScoreSlider } from '../components/ScoreSlider';
import { useDiaryStore } from '../store/diaryStore';
import { usePatientStore } from '../store/patientStore';
import { DiaryEntry } from '../types';
import { calcBmi, bmiCategory } from '../lib/bmi';
import { formatThaiDate } from '../lib/thaiDate';

const SWELLING_OPTIONS: Array<{ key: DiaryEntry['swelling']; label: string }> = [
  { key: 'none', label: 'ไม่บวม' },
  { key: 'mild', label: 'บวมเล็กน้อย' },
  { key: 'moderate', label: 'บวมปานกลาง' },
  { key: 'severe', label: 'บวมมาก' },
];

export function DiaryScreen() {
  const { entries, getToday, upsertToday } = useDiaryStore();
  const { profile, update } = usePatientStore();
  const today = getToday();

  const [pain, setPain] = useState(today?.painScore ?? 0);
  const [rom, setRom] = useState(today?.romDegrees != null ? String(today.romDegrees) : '');
  const [weight, setWeight] = useState(
    today?.weightKg != null ? String(today.weightKg) : profile.weightKg != null ? String(profile.weightKg) : '',
  );
  const [swelling, setSwelling] = useState<DiaryEntry['swelling']>(today?.swelling ?? 'none');
  const [notes, setNotes] = useState(today?.notes ?? '');

  useEffect(() => {
    if (today) {
      setPain(today.painScore);
      setRom(today.romDegrees != null ? String(today.romDegrees) : '');
      setWeight(today.weightKg != null ? String(today.weightKg) : '');
      setSwelling(today.swelling);
      setNotes(today.notes);
    }
  }, [today?.id]);

  const save = async () => {
    const romNum = rom ? Number(rom) : null;
    const weightNum = weight ? Number(weight) : null;
    await upsertToday({
      painScore: pain,
      romDegrees: Number.isFinite(romNum as number) ? romNum : null,
      weightKg: Number.isFinite(weightNum as number) ? weightNum : null,
      swelling,
      notes,
    });
    if (weightNum && Number.isFinite(weightNum)) {
      await update({ weightKg: weightNum });
    }
  };

  const bmi =
    profile.heightCm && weight && Number(weight) > 0 ? calcBmi(Number(weight), profile.heightCm) : null;
  const bmiInfo = bmi != null ? bmiCategory(bmi) : null;

  const history = entries.filter((e) => e.id !== today?.id).slice(0, 14);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={history}
        keyExtractor={(e) => e.id}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>บันทึกอาการวันนี้</Text>
              <Text style={styles.headerSub}>{formatThaiDate(new Date(), { withDay: true })}</Text>
            </View>

            <Card title="ระดับความปวด (0-10)">
              <ScoreSlider value={pain} onChange={setPain} />
            </Card>

            <Card title="ช่วงการงอเข่า (ROM)">
              <Text style={styles.hint}>ถ้าไม่ทราบค่า ข้ามได้</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={rom}
                  onChangeText={setRom}
                  keyboardType="numeric"
                  placeholder="เช่น 90"
                />
                <Text style={styles.unit}>องศา</Text>
              </View>
            </Card>

            <Card title="น้ำหนักตัว">
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="เช่น 65.5"
                />
                <Text style={styles.unit}>กก.</Text>
              </View>
              {bmi != null && bmiInfo && (
                <View style={styles.bmiBox}>
                  <Text style={styles.bmiLabel}>
                    BMI: {bmi} — {bmiInfo.label}
                  </Text>
                  <Text style={styles.bmiHint}>{bmiInfo.hint}</Text>
                </View>
              )}
            </Card>

            <Card title="อาการบวม">
              <View style={styles.chipRow}>
                {SWELLING_OPTIONS.map((opt) => {
                  const active = opt.key === swelling;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setSwelling(opt.key)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, active && { color: '#fff' }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            <Card title="บันทึกเพิ่มเติม">
              <TextInput
                style={[styles.input, styles.textarea]}
                value={notes}
                onChangeText={setNotes}
                multiline
                placeholder="บันทึกอะไรก็ได้ เช่น กิจกรรมที่ทำวันนี้"
              />
            </Card>

            <PrimaryButton label="บันทึก" onPress={save} />
            <View style={{ height: spacing.xl }} />

            <Text style={styles.historyTitle}>ประวัติ (14 วันล่าสุด)</Text>
          </View>
        }
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Text style={styles.historyDate}>{formatThaiDate(item.date, { short: true })}</Text>
            <View style={styles.historyRow}>
              <Text style={styles.historyMeta}>ปวด {item.painScore}/10</Text>
              {item.romDegrees != null && <Text style={styles.historyMeta}>งอ {item.romDegrees}°</Text>}
              {item.weightKg != null && <Text style={styles.historyMeta}>{item.weightKg} กก.</Text>}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.hint}>ยังไม่มีประวัติ</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { marginBottom: spacing.md },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.primary },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  hint: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  unit: { marginLeft: spacing.sm, color: colors.textSecondary, fontSize: 14 },
  bmiBox: { marginTop: spacing.md, padding: spacing.md, backgroundColor: '#f1f5f9', borderRadius: radius.md },
  bmiLabel: { fontSize: 14, fontWeight: '700', color: colors.primary },
  bmiHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textPrimary },
  historyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  historyCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  historyDate: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  historyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  historyMeta: { fontSize: 13, color: colors.textPrimary, fontWeight: '600', marginRight: spacing.md },
});
