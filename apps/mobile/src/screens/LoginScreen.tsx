import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const { access_token } = await res.json();
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('userId', access_token.split('.')[1]);
      navigation.navigate('VolunteerDashboard');
    } else {
      Alert.alert(t('login.error_invalid'));
    }
    setSubmitting(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{t('login.title')}</Text>
      <Text>{t('login.email_placeholder')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('login.password_placeholder')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title={t('login.submit_button')} onPress={onSubmit} disabled={submitting} />
      {submitting && <ActivityIndicator style={{ marginTop: 8 }} />}
    </View>
  );
}
