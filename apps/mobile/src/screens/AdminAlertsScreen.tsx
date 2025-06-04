import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

type AlertType = {
  id: string;
  title: string;
  description?: string;
  country: string;
  region?: string;
  localities: string[];
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function AdminAlertsScreen() {
  const { t } = useTranslation();

  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [localities, setLocalities] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const tokenPromise = AsyncStorage.getItem('token');
  const orgIdPromise = AsyncStorage.getItem('orgId');

  const fetchAlerts = async () => {
    setLoading(true);
    const token = await tokenPromise;
    const res = await fetch('http://localhost:3000/api/alerts?scope=all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const grabMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toString());
          setLongitude(pos.coords.longitude.toString());
        },
        (err) => {
          console.error(err);
          Alert.alert('Unable to get location, please enter manually.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      Alert.alert('Geolocation not supported.');
    }
  };

  const createAlert = async () => {
    const token = await tokenPromise;
    const orgId = await orgIdPromise;
    const body: any = {
      title,
      description,
      sourceOrgId: orgId,
      country,
      region,
      localities: localities.split(',').map((l) => l.trim()),
    };
    if (latitude !== '') {
      body.latitude = parseFloat(latitude);
    }
    if (longitude !== '') {
      body.longitude = parseFloat(longitude);
    }
    await fetch('http://localhost:3000/api/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    fetchAlerts();
    Alert.alert('Alert created');
  };

  const approveAlert = async (id: string) => {
    const token = await tokenPromise;
    await fetch(`http://localhost:3000/api/alerts/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    fetchAlerts();
    Alert.alert('Alert approved');
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{t('admin.create_alert')}</Text>

      <TextInput
        placeholder={t('alerts.title_label')}
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder={t('alerts.description_label')}
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8, height: 80 }}
        multiline
      />
      <TextInput
        placeholder={t('alerts.country_label')}
        value={country}
        onChangeText={setCountry}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder={t('alerts.region_label')}
        value={region}
        onChangeText={setRegion}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder={t('alerts.locality_label')}
        value={localities}
        onChangeText={setLocalities}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <TextInput
          placeholder={t('alerts.latitude_label')}
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
          style={{ flex: 1, borderWidth: 1, marginRight: 4, padding: 8 }}
        />
        <TextInput
          placeholder={t('alerts.longitude_label')}
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
          style={{ flex: 1, borderWidth: 1, marginLeft: 4, padding: 8 }}
        />
      </View>

      <Button title={t('alerts.use_my_location')} onPress={grabMyLocation} />

      <View style={{ height: 8 }} />
      <Button title={t('alerts.submit_button')} onPress={createAlert} />

      {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}

      <Text style={{ fontSize: 20, marginVertical: 16 }}>Existing Alerts</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 12,
                borderWidth: 1,
                padding: 8,
                borderRadius: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>
                {item.title} ({t(`alerts.${item.status.toLowerCase()}_message`)})
              </Text>
              <Text>{item.description}</Text>
              <Text>
                {t('alerts.country_label')}: {item.country}
              </Text>
              {item.region && (
                <Text>
                  {t('alerts.region_label')}: {item.region}
                </Text>
              )}
              <Text>
                {t('alerts.locality_label')}: {item.localities.join(', ')}
              </Text>
              {item.latitude != null && item.longitude != null && (
                <Text>
                  {t('alerts.coordinates_label')}: {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                </Text>
              )}
              {item.status === 'PENDING_APPROVAL' && (
                <Button
                  title={t('admin.approve_alert')}
                  onPress={() => approveAlert(item.id)}
                  color="green"
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
