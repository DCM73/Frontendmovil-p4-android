import { router } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebaseConfig';

// tipado de datos de players
interface Player {
  id: string;
  nombre: string;
  apellidos: string;
  posicion: string;
  imagen: string;
}

export default function InicioScreen() {

  const [jugadores, setJugadores] = useState<Player[]>([]); // variables de esto para guardar datos
  const [cargando, setCargando] = useState(true);

  // cargamos los datos de firebase cuando aparezca la pantalla (substituimos componentDidMount)
  useEffect(() => {
    const playersRef = collection(db, 'players'); // referenciamos la colección

    const unsubscribe = onSnapshot(playersRef, (snapshot) => { // snapshot para conexiuón en tiempo real
      const arrayTemporal: Player[] = [];
      snapshot.forEach((doc) => {
        arrayTemporal.push({ id: doc.id, ...doc.data() } as Player);
      });
      
      setJugadores(arrayTemporal); // guardamos los datos
      setCargando(false);
    }, (error) => {
      console.error("Error cargando jugadores:", error);
      setCargando(false);
    });

    // si el usuario sale se limpia la conexión a la bbdd
    return () => unsubscribe();
  }, []); // array vacío --> sólo se ejecuta una vez

  // diseño de tarjetas para pintar cada elemento del array
  const renderItem = ({ item }: { item: Player }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push({ pathname: '/detalle', params: { id: item.id } })}
    >
      <Image 
        source={{ uri: item.imagen.includes('http') ? item.imagen : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} // condicional para menajo de imagenes locales (no pienso pagar firebase)
        style={styles.imagen} 
      />
      <View style={styles.infoContenedor}>
        <Text style={styles.nombre}>{item.nombre} {item.apellidos}</Text>
        <Text style={styles.posicion}>{item.posicion}</Text>
      </View>
    </TouchableOpacity>
  );

  // render en la pantalla
  return (
    <View style={styles.contenedorPantalla}>
      {cargando ? (
        <ActivityIndicator size="large" color="#1E293B" style={{ marginTop: 50 }} />
      ) : (
        <FlatList // scroll
          data={jugadores} // datos
          keyExtractor={(item) => item.id} // id de cada item
          renderItem={renderItem} // el diseño de arriba
          contentContainerStyle={styles.listaPadding}
        />
      )}
    </View>
  );
}

// estilos
const styles = StyleSheet.create({
  contenedorPantalla: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  listaPadding: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  infoContenedor: {
    marginLeft: 16,
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  posicion: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});