import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { PrimaryButton } from '../components/PrimaryButton';
import { useMedicationStore } from '../store/medicationStore';
import { SAMPLE_MEDS } from '../data/defaultMeds';
import { Medication } from '../types';

export function MedicationsScreen() {
  const { medications, logDose, getTodayLog, addMedication, removeMedication } = useMedicationStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', dosage: '', timesText: '08:00' });

  const handleAdd = async (preset?: Omit<Medication, 'id' | 'startDate'>) => {
    if (preset) {
      await addMedication(preset);
    } else {
      if (!draft.name.trim()) return;
      await addMedication({
        name: draft.name.trim(),
        dosage: draft.dosage.trim() || '1 เม็ด',
        times: draft.timesText
          .split(',')
          .map((s) => s.trim())
          .filter((s) => /^\d{2}:\d{2}$/.test(s)),
        endDate: null,
        notes: '',
      });
      setDraft({ name: '', dosage: '', timesText: '08:00' });
    }
    setModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ยาประจำวัน</Text>
        <Text style={styles.headerSub}>กดปุ่มหลังเวลายาเพื่อยืนยันว่าทานแล้ว</Text>
      </View>

      {medications.length === 0 ? (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={styles.empty}>ยังไม่มียาในรายการ — เริ่มจากเทมเพลตด้านล่าง</Text>
          {SAMPLE_MEDS.map((m) => (
            <TouchableOpacity key={m.name} style={styles.sampleCard} onPress={() => handleAdd(m)}>
              <Text style={styles.sampleName}>+ {m.name}</Text>
              <Text style={styles.sampleMeta}>{m.dosage} · {m.times.join(', ')}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: spacing.md }} />
          <PrimaryButton label="เพิ่มยาเอง" onPress={() => setModalOpen(true)} variant="outline" />
        </ScrollView>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.medName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeMedication(item.id)}>
                  <Text style={styles.remove}>ลบ</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.medDose}>{item.dosage}</Text>
              {item.notes ? <Text style={styles.medNotes}>{item.notes}</Text> : null}
              <View style={styles.timeRow}>
                {item.times.map((t) => {
                  const log = getTodayLog(item.id, t);
                  const taken = log?.taken === true;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => logDose(item.id, t, !taken)}
                      style={[styles.timeChip, taken && styles.timeChipDone]}
                    >
                      <Text style={[styles.timeChipText, taken && { color: '#fff' }]}>
                        {taken ? '✓ ' : ''}{t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}

      {medications.length > 0 && (
        <View style={styles.fabWrap}>
          <PrimaryButton label="+ เพิ่มยา" onPress={() => setModalOpen(true)} />
        </View>
      )}

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>เพิ่มยาใหม่</Text>
            <Text style={styles.label}>ชื่อยา</Text>
            <TextInput
              style={styles.input}
              value={draft.name}
              onChangeText={(t) => setDraft({ ...draft, name: t })}
              placeholder="เช่น Paracetamol 500 mg"
            />
            <Text style={styles.label}>ขนาด</Text>
            <TextInput
              style={styles.input}
              value={draft.dosage}
              onChangeText={(t) => setDraft({ ...draft, dosage: t })}
              placeholder="เช่น 1 เม็ด"
            />
            <Text style={styles.label}>เวลา (HH:MM คั่นด้วย ,)</Text>
            <TextInput
              style={styles.input}
              value={draft.timesText}
              onChangeText={(t) => setDraft({ ...draft, timesText: t })}
              placeholder="08:00, 12:00, 18:00"
            />
            <View style={{ height: spacing.md }} />
            <PrimaryButton label="บันทึก" onPress={() => handleAdd()} />
            <View style={{ height: spacing.sm }} />
            <PrimaryButton label="ยกเลิก" variant="ghost" onPress={() => setModalOpen(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: 0 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.primary },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  empty: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  sampleCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sampleName: { fontSize: 15, fontWeight: '600', color: colors.primary },
  sampleMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  medDose: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  medNotes: { fontSize: 12, color: colors.warning, marginTop: spacing.xs },
  remove: { fontSize: 13, color: colors.danger },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md, gap: spacing.xs },
  timeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  timeChipDone: { backgroundColor: colors.success, borderColor: colors.success },
  timeChipText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  fabWrap: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.surface, padding: spacing.lg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
