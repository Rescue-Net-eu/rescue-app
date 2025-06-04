import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export default function SignupDirectScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    city: '',
    country: '',
    specialization: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    const res = await fetch('http://localhost:3000/api/auth/signup/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        age: Number(form.age),
        city: form.city,
        country: form.country,
        specialization: form.specialization,
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
      <Text>{t('signup.country_label')}</Text>
      <TextInput
        value={form.country}
        onChangeText={(text) => setForm({ ...form, country: text })}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Text>{t('signup.specialization_label')}</Text>
      <TextInput
        value={form.specialization}
        onChangeText={(text) => setForm({ ...form, specialization: text })}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title={t('signup.submit_button')} onPress={onSubmit} disabled={submitting} />
      {submitting && <ActivityIndicator style={{ marginTop: 8 }} />}
    </View>
  );
}
