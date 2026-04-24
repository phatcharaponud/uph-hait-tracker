import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme/colors';
import { EXERCISES } from '../data/exercises';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { useDiaryStore } from '../store/diaryStore';

interface Props {
  route: { params: { id: string } };
  navigation: any;
}

export function ExerciseDetailScreen({ route, navigation }: Props) {
  const exercise = EXERCISES.find((e) => e.id === route.params.id);
  const { upsertToday, getToday } = useDiaryStore();
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [holdLeft, setHoldLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.para}>ไม่พบท่านี้</Text>
      </SafeAreaView>
    );
  }

  const totalReps = exercise.sets * exercise.reps;
  const doneReps = (currentSet - 1) * exercise.reps + currentRep;
  const progress = Math.round((doneReps / totalReps) * 100);

  const finishRep = () => {
    if (currentRep + 1 >= exercise.reps) {
      if (currentSet >= exercise.sets) {
        setRunning(false);
        markComplete();
        return;
      }
      setCurrentSet((s) => s + 1);
      setCurrentRep(0);
    } else {
      setCurrentRep((r) => r + 1);
    }
  };

  const startRep = () => {
    if (exercise.holdSeconds <= 0) {
      finishRep();
      return;
    }
    setHoldLeft(exercise.holdSeconds);
    setRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setHoldLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          finishRep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const markComplete = async () => {
    const today = getToday();
    const list = new Set(today?.exercisesCompleted ?? []);
    list.add(exercise.id);
    await upsertToday({ exercisesCompleted: Array.from(list) });
  };

  const reset = () => {
    setCurrentSet(1);
    setCurrentRep(0);
    setHoldLeft(0);
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const done = currentSet > exercise.sets;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.sub}>
          {exercise.nameEn} · {exercise.targetMuscle}
        </Text>

        <Card title="วิธีทำ">
          <Text style={styles.para}>{exercise.description}</Text>
        </Card>

        <Card title="โปรแกรม">
          <Text style={styles.para}>
            {exercise.sets} เซ็ต × {exercise.reps} ครั้ง
            {exercise.holdSeconds > 0 ? ` (ค้าง ${exercise.holdSeconds} วินาที)` : ''}
          </Text>
        </Card>

        {exercise.cautions.length > 0 && (
          <Card title="ข้อควรระวัง">
            {exercise.cautions.map((c, i) => (
              <Text key={i} style={[styles.para, { color: colors.warning }]}>
                • {c}
              </Text>
            ))}
          </Card>
        )}

        <Card title={done ? '🎉 สำเร็จแล้ว!' : `เซ็ต ${currentSet} / ${exercise.sets}`}>
          {!done && (
            <>
              <Text style={styles.big}>
                ทำแล้ว {currentRep} / {exercise.reps} ครั้ง
              </Text>
              {running && exercise.holdSeconds > 0 && (
                <Text style={styles.timer}>ค้างไว้ {holdLeft} วิ...</Text>
              )}
              <Text style={styles.meta}>ความคืบหน้า: {progress}%</Text>
              <View style={{ height: spacing.md }} />
              <PrimaryButton
                label={running ? 'กำลังค้าง...' : exercise.holdSeconds > 0 ? 'เริ่มค้าง' : 'นับ 1 ครั้ง'}
                onPress={startRep}
                disabled={running}
              />
              <View style={{ height: spacing.sm }} />
              <PrimaryButton label="รีเซ็ต" onPress={reset} variant="ghost" />
            </>
          )}
          {done && (
            <>
              <Text style={styles.para}>บันทึกไว้ในไดอารี่วันนี้เรียบร้อย</Text>
              <View style={{ height: spacing.md }} />
              <PrimaryButton label="ทำอีกครั้ง" onPress={reset} variant="outline" />
              <View style={{ height: spacing.sm }} />
              <PrimaryButton label="กลับ" onPress={() => navigation.goBack()} variant="ghost" />
            </>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 2 },
  sub: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  para: { fontSize: 14, color: colors.textPrimary, lineHeight: 22 },
  big: { fontSize: 32, fontWeight: '700', color: colors.primary, textAlign: 'center', marginVertical: spacing.md },
  timer: { fontSize: 18, color: colors.accent, textAlign: 'center', fontWeight: '700' },
  meta: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});
