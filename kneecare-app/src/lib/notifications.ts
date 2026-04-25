import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../types';

const CHANNEL_ID = 'medication-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationSetup(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'แจ้งเตือนยา',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1e3a5f',
      sound: 'default',
    });
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;

  const req = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return req.granted;
}

function parseHHMM(time: string): { hour: number; minute: number } | null {
  const m = /^(\d{2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export async function scheduleMedicationReminders(med: Medication): Promise<string[]> {
  const ids: string[] = [];
  for (const time of med.times) {
    const parsed = parseHHMM(time);
    if (!parsed) continue;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `ถึงเวลายา ${med.name}`,
        body: `${med.dosage}${med.notes ? ` · ${med.notes}` : ''}`,
        data: { medicationId: med.id, time },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelAllForMedication(notificationIds: string[]): Promise<void> {
  for (const id of notificationIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // ignore
    }
  }
}

export async function cancelAllScheduled(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
