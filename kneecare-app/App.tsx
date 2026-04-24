import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';
import { usePatientStore } from './src/store/patientStore';
import { useDiaryStore } from './src/store/diaryStore';
import { useMedicationStore } from './src/store/medicationStore';
import { colors } from './src/theme/colors';

export default function App() {
  const [ready, setReady] = useState(false);
  const loadPatient = usePatientStore((s) => s.load);
  const loadDiary = useDiaryStore((s) => s.load);
  const loadMeds = useMedicationStore((s) => s.load);

  useEffect(() => {
    (async () => {
      await Promise.all([loadPatient(), loadDiary(), loadMeds()]);
      setReady(true);
    })();
  }, [loadPatient, loadDiary, loadMeds]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
