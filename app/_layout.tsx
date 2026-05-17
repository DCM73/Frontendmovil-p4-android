import { Stack } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function LayoutPrincipal() {
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