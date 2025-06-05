import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
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
  images?: { url: string }[];
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
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
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

  const requestLocationPermission = async () => {
    const status = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    return status === 'granted';
  };

  const grabMyLocation = async () => {
    const permitted = await requestLocationPermission();
    if (!permitted) {
      Alert.alert('Permission denied');
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
      },
      (err) => {
        console.error(err);
        Alert.alert('Unable to get location, please enter manually.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
    );
  };

  const pickImages = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 });
    if (result.assets) {
      setSelectedAssets(result.assets);
    }
  };

  const createAlert = async () => {
    const token = await tokenPromise;
    const orgId = await orgIdPromise;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('sourceOrgId', orgId as string);
    formData.append('country', country);
    if (region) formData.append('region', region);
    formData.append('localities', JSON.stringify(localities.split(',').map((l) => l.trim())));
    if (latitude !== '') formData.append('latitude', latitude);
    if (longitude !== '') formData.append('longitude', longitude);

    selectedAssets.forEach((asset) => {
      if (!asset.uri) return;
      const uriParts = asset.uri.split('/');
      const name = uriParts[uriParts.length - 1];
      const type = asset.type || 'image/jpeg';
      formData.append('images', {
        uri: asset.uri,
        name,
        type,
      } as any);
    });

    await fetch('http://localhost:3000/api/alerts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
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
      <Button title={t('alerts.image_upload_label')} onPress={pickImages} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
        {selectedAssets.map((asset) => (
          <Image key={asset.uri} source={{ uri: asset.uri }} style={{ width: 80, height: 80, marginRight: 8, marginBottom: 8 }} />
        ))}
      </View>
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
            <View style={{ marginBottom: 12, borderWidth: 1, padding: 8, borderRadius: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {item.title} ({t(`alerts.${item.status.toLowerCase()}_message`)})
              </Text>
              <Text>{item.description}</Text>
              <Text>{t('alerts.country_label')}: {item.country}</Text>
              {item.region && <Text>{t('alerts.region_label')}: {item.region}</Text>}
              <Text>{t('alerts.locality_label')}: {item.localities.join(', ')}</Text>
              {item.latitude != null && item.longitude != null && (
                <Text>{t('alerts.coordinates_label')}: {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</Text>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                {item.images?.map((img) => (
                  <Image key={img.url} source={{ uri: `http://localhost:3000/${img.url}` }} style={{ width: 80, height: 80, marginRight: 8, marginBottom: 8 }} />
                ))}
              </View>
              {item.status === 'PENDING_APPROVAL' && (
                <Button title={t('admin.approve_alert')} onPress={() => approveAlert(item.id)} color="green" />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
