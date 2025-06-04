import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

type RouteParams = {
  token: string;
};

export default function SignupTokenScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = (route.params as unknown as RouteParams);

  const [valid, setValid] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/api/invitations/validate?token=${token}`)
      .then((res) => res.json())
      .then((data) => setValid(data.valid))
      .catch(() => setValid(false));
  }, [token]);

  const onSubmit = async () => {
    setSubmitting(true);
    const res = await fetch('http://localhost:3000/api/auth/signup/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        age: Number(form.age),
        city: form.city,
      }),
    });
    if (res.ok) {
      Alert.alert(t('signup.success_message'));
      navigation.navigate('Login');
    } else {
      Alert.alert('Signup failed');
    }
    setSubmitting(false);
  };

  if (valid === null) return <ActivityIndicator size="large" />;
  if (!valid) return <Text>{t('signup.invalid_token')}</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{t('signup.title')}</Text>
      <Text>{t('signup.first_name_label')}</Text>
      <TextInput
        value={form.firstName}
        onChangeText={(text) => setForm({ ...form, firstName: text })}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('signup.last_name_label')}</Text>
      <TextInput
        value={form.lastName}
        onChangeText={(text) => setForm({ ...form, lastName: text })}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('signup.email_label')}</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('signup.age_label')}</Text>
      <TextInput
        value={form.age}
        onChangeText={(text) => setForm({ ...form, age: text })}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('signup.city_label')}</Text>
      <TextInput
        value={form.city}
        onChangeText={(text) => setForm({ ...form, city: text })}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title={t('signup.submit_button')} onPress={onSubmit} disabled={submitting} />
    </View>
  );
}
