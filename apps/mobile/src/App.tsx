import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

import SignupTokenScreen from './screens/SignupTokenScreen';
import SignupDirectScreen from './screens/SignupDirectScreen';
import LoginScreen from './screens/LoginScreen';
import VolunteerDashboard from './screens/VolunteerDashboard';
import AdminAlertsScreen from './screens/AdminAlertsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = React.useState<'Login' | 'VolunteerDashboard'>('Login');

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        setInitialRoute('VolunteerDashboard');
      }
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name="SignupToken" component={SignupTokenScreen} />
          <Stack.Screen name="SignupDirect" component={SignupDirectScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="VolunteerDashboard" component={VolunteerDashboard} />
          <Stack.Screen name="AdminAlerts" component={AdminAlertsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
