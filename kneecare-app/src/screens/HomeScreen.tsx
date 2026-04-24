import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { usePatientStore } from '../store/patientStore';
import { useDiaryStore } from '../store/diaryStore';
import { getPhaseByDay } from '../data/timeline';
import { daysBetween, formatThaiDate, todayIso } from '../lib/thaiDate';
import { ProgressBar } from '../components/ProgressBar';
import { SectionHeader } from '../components/SectionHeader';

interface Props {
  navigation: any;
}

export function HomeScreen({ navigation }: Props) {
  const { profile } = usePatientStore();
  const { getToday } = useDiaryStore();

  const dayFromSurgery = useMemo(() => {
    if (!profile.surgeryDate) return null;
    return daysBetween(profile.surgeryDate, todayIso());
  }, [profile.surgeryDate]);

  const phase = dayFromSurgery != null ? getPhaseByDay(dayFromSurgery) : null;
  const todayEntry = getToday();

  const needsSetup = !profile.name || !profile.surgeryDate;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroHello}>สวัสดี{profile.name ? ` คุณ${profile.name}` : ''}</Text>
          <Text style={styles.heroDate}>{formatThaiDate(new Date(), { withDay: true })}</Text>
        </View>

        {needsSetup && (
          <Card title="ยังไม่ได้ตั้งค่าโปรไฟล์" subtitle="กรอกข้อมูลพื้นฐานและวันผ่าตัดเพื่อรับโปรแกรมส่วนตัว">
            <PrimaryButton label="ตั้งค่าโปรไฟล์" onPress={() => navigation.navigate('Profile')} />
          </Card>
        )}

        {phase && dayFromSurgery != null && (
          <Card
            title={phase.title}
            subtitle={
              dayFromSurgery < 0
                ? `อีก ${Math.abs(dayFromSurgery)} วันถึงวันผ่าตัด`
                : `วันที่ ${dayFromSurgery} หลังผ่าตัด`
            }
          >
            <Text style={styles.para}>{phase.description}</Text>

            <Text style={styles.subTitle}>เป้าหมายวันนี้</Text>
            {phase.goals.map((g, i) => (
              <Text key={i} style={styles.bullet}>
                • {g}
              </Text>
            ))}

            {phase.warnings.length > 0 && (
              <>
                <Text style={[styles.subTitle, { color: colors.danger }]}>⚠️ สัญญาณเตือน</Text>
                {phase.warnings.map((w, i) => (
                  <Text key={i} style={[styles.bullet, { color: colors.danger }]}>
                    • {w}
                  </Text>
                ))}
              </>
            )}
          </Card>
        )}

        <SectionHeader title="สรุปวันนี้" />
        <Card>
          <ProgressBar
            label="บันทึกอาการวันนี้"
            value={todayEntry ? 100 : 0}
            max={100}
          />
          <View style={{ height: spacing.md }} />
          <PrimaryButton
            label={todayEntry ? 'แก้ไขบันทึกวันนี้' : 'บันทึกอาการวันนี้'}
            onPress={() => navigation.navigate('Diary')}
            variant={todayEntry ? 'outline' : 'solid'}
          />
        </Card>

        <Card title="ทางลัด">
          <View style={styles.row}>
            <PrimaryButton
              label="ออกกำลังกาย"
              onPress={() => navigation.navigate('Exercises')}
              style={styles.quick}
            />
            <PrimaryButton
              label="รายการยา"
              onPress={() => navigation.navigate('Medications')}
              variant="outline"
              style={styles.quick}
            />
          </View>
        </Card>

        <Card title="⚠️ ติดต่อทีมทันทีถ้ามีอาการเหล่านี้">
          <Text style={styles.bullet}>• ไข้ &gt; 38°C</Text>
          <Text style={styles.bullet}>• น่องบวม แดง เจ็บข้างเดียว</Text>
          <Text style={styles.bullet}>• ปวดรุนแรงขึ้นเรื่อย ๆ</Text>
          <Text style={styles.bullet}>• แผลมีหนองหรือเลือดซึมไม่หยุด</Text>
          <Text style={styles.bullet}>• หอบเหนื่อย เจ็บหน้าอก</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { marginBottom: spacing.lg },
  heroHello: { fontSize: 22, fontWeight: '700', color: colors.primary },
  heroDate: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  para: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  subTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm, marginBottom: spacing.xs },
  bullet: { fontSize: 14, color: colors.textPrimary, marginBottom: 2, lineHeight: 20 },
  row: { flexDirection: 'row', gap: spacing.sm },
  quick: { flex: 1, marginRight: spacing.sm },
});
