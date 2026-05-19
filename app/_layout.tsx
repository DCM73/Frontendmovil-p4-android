import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useEffect } from 'react';

// nuevo modular api
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  setBackgroundMessageHandler,
  AuthorizationStatus,
  subscribeToTopic
} from '@react-native-firebase/messaging';

// manejo de notis en segundo plano
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.log('Nottificación en segundo plano', remoteMessage);
});

export default function LayoutPrincipal() {
  useEffect(() => {
      // pedir permiso al usuario para recibir notis
      const solicitarPermisos = async () => {
        const authStatus = await requestPermission(getMessaging());
              const enabled =
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL;

              if (enabled) {
                console.log('Permiso de notificaciones concedido (API Moderna).');
                const token = await getToken(getMessaging());
                console.log('FCM TOKEN:', token);

                await subscribeToTopic(getMessaging(), "todos"); // conx móvil
                console.log('Suscrito con éxito al canal global');
              }
      };

      solicitarPermisos();

      // manejo de notis en primer plano
      const unsubscribe = onMessage(getMessaging(), async remoteMessage => {
            Alert.alert(
              remoteMessage.notification?.title || 'Nueva Notificación',
              remoteMessage.notification?.body || 'Tienes un nuevo mensaje de Equipo Basket'
            );
        });

      return unsubscribe;
    }, []);

  return (
    <Stack // stack para volver atrás entre pantlalas, se pone una encima de la otra
      screenOptions={{
        headerStyle: { backgroundColor: '#1E293B' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',

        headerRight: () => (
          <TouchableOpacity 
            onPress={() => router.replace('/')} // para ir al inicio limpio
            style={{ padding: 5 }}
          >
            <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 16 }}>Inicio</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Jugadores Disponibles' }} />
      <Stack.Screen name="detalle" options={{ title: 'Detalle del Jugador' }} />
      <Stack.Screen name="multimedia" options={{ title: 'Reproductor Multimedia' }} />
    </Stack>
  );
}