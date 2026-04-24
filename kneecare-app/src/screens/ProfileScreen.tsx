import React, { useState } from 'react';
import {
  ScrollView,
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
import { usePatientStore } from '../store/patientStore';
import { PatientProfile, SurgeryType } from '../types';

const SURGERY_OPTIONS: Array<{ key: SurgeryType; label: string }> = [
  { key: 'none', label: 'ยังไม่ผ่าตัด (ข้อเข่าเสื่อม)' },
  { key: 'pre_op', label: 'รอผ่าตัด' },
  { key: 'post_op', label: 'ผ่าตัดแล้ว' },
];

const SIDE_OPTIONS: Array<{ key: NonNullable<PatientProfile['affectedSide']>; label: string }> = [
  { key: 'left', label: 'ซ้าย' },
  { key: 'right', label: 'ขวา' },
  { key: 'both', label: 'ทั้งสองข้าง' },
];

export function ProfileScreen() {
  const { profile, update, reset } = usePatientStore();
  const [form, setForm] = useState<PatientProfile>(profile);

  const setField = <K extends keyof PatientProfile>(key: K, value: PatientProfile[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    await update(form);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.headerTitle}>ข้อมูลผู้ป่วย</Text>
        <Text style={styles.headerSub}>ข้อมูลจะเก็บในเครื่องเท่านั้น</Text>

        <Card title="ข้อมูลทั่วไป">
          <Text style={styles.label}>ชื่อ</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setField('name', t)}
            placeholder="ชื่อ-นามสกุล"
          />

          <Text style={styles.label}>ปีเกิด (พ.ศ.)</Text>
          <TextInput
            style={styles.input}
            value={form.birthYear ? String(form.birthYear + 543) : ''}
            onChangeText={(t) => {
              const n = Number(t);
              setField('birthYear', Number.isFinite(n) && n > 0 ? n - 543 : null);
            }}
            keyboardType="numeric"
            placeholder="เช่น 2505"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>ส่วนสูง (ซม.)</Text>
              <TextInput
                style={styles.input}
                value={form.heightCm != null ? String(form.heightCm) : ''}
                onChangeText={(t) => {
                  const n = Number(t);
                  setField('heightCm', Number.isFinite(n) && n > 0 ? n : null);
                }}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>น้ำหนัก (กก.)</Text>
              <TextInput
                style={styles.input}
                value={form.weightKg != null ? String(form.weightKg) : ''}
                onChangeText={(t) => {
                  const n = Number(t);
                  setField('weightKg', Number.isFinite(n) && n > 0 ? n : null);
                }}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </Card>

        <Card title="สถานะการรักษา">
          <View style={styles.chipRow}>
            {SURGERY_OPTIONS.map((opt) => {
              const active = opt.key === form.surgeryType;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setField('surgeryType', opt.key)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && { color: '#fff' }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>
            {form.surgeryType === 'pre_op' ? 'วันผ่าตัด (YYYY-MM-DD)' : 'วันที่ผ่าตัด (YYYY-MM-DD)'}
          </Text>
          <TextInput
            style={styles.input}
            value={form.surgeryDate ?? ''}
            onChangeText={(t) => setField('surgeryDate', t || null)}
            placeholder="เช่น 2026-05-15"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            ใส่เป็นปี ค.ศ. (ระบบจะแปลงเป็น พ.ศ. ให้อัตโนมัติในการแสดงผล)
          </Text>

          <Text style={styles.label}>ข้างที่เจ็บ/ผ่าตัด</Text>
          <View style={styles.chipRow}>
            {SIDE_OPTIONS.map((opt) => {
              const active = opt.key === form.affectedSide;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setField('affectedSide', opt.key)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && { color: '#fff' }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <PrimaryButton label="บันทึกข้อมูล" onPress={save} />
        <View style={{ height: spacing.md }} />
        <PrimaryButton label="ล้างข้อมูลทั้งหมด" onPress={reset} variant="danger" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.primary },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  hint: { fontSize: 11, color: colors.textMuted, marginTop: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
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
});
