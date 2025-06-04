import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

type Mission = { id: string; title: string; description?: string };
type AlertType = { id: string; title: string; status: string };

export default function VolunteerDashboard() {
  const { t } = useTranslation();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const tokenPromise = AsyncStorage.getItem('token');

  const fetchMissions = async () => {
    setLoadingMissions(true);
    const res = await fetch('http://localhost:3000/api/missions', {
      headers: { Authorization: `Bearer ${await tokenPromise}` },
    });
    const data = await res.json();
    setMissions(data);
    setLoadingMissions(false);
  };

  const subscribeToMission = async (missionId: string) => {
    const userId = await AsyncStorage.getItem('userId');
    await fetch(`http://localhost:3000/api/missions/${missionId}/assign/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await tokenPromise}` },
    });
    fetchMissions();
    Alert.alert('Subscribed to mission');
  };

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    const res = await fetch('http://localhost:3000/api/alerts?scope=local', {
      headers: { Authorization: `Bearer ${await tokenPromise}` },
    });
    const data = await res.json();
    setAlerts(data);
    setLoadingAlerts(false);
  };

  const subscribeToAlert = async (alertId: string) => {
    const userId = await AsyncStorage.getItem('userId');
    await fetch(`http://localhost:3000/api/alerts/${alertId}/subscribe/${userId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await tokenPromise}` },
    });
    fetchAlerts();
    Alert.alert('Subscribed to alert');
  };

  useEffect(() => {
    fetchMissions();
    fetchAlerts();
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        {t('dashboard.welcome', { name: 'Volunteer' })}
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 8 }}>{t('dashboard.view_missions')}</Text>
      {loadingMissions ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>{item.title}</Text>
              <Button
                title={t('dashboard.subscribe_alert')}
                onPress={() => subscribeToMission(item.id)}
              />
            </View>
          )}
        />
      )}
      <Button title={t('dashboard.view_missions')} onPress={fetchMissions} />

      <Text style={{ fontSize: 20, marginVertical: 12 }}>{t('dashboard.view_alerts')}</Text>
      {loadingAlerts ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>
                {item.title} ({t(`alerts.${item.status.toLowerCase()}_message`)})
              </Text>
              <Button
                title={t('dashboard.subscribe_alert')}
                onPress={() => subscribeToAlert(item.id)}
              />
            </View>
          )}
        />
      )}
      <Button title={t('dashboard.view_alerts')} onPress={fetchAlerts} />
    </View>
  );
}
