import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebaseConfig';

// datos
interface Player {
  id: string;
  nombre: string;
  apellidos: string;
  posicion: string;
  edad: number;
  altura: number;
  imagen: string;
  video: string;
}

export default function DetalleScreen() {
  // capturamos el id que se envía desde index.tsx
  const { id } = useLocalSearchParams(); 

  const [jugador, setJugador] = useState<Player | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // ver si el modal está abierto o no

  useEffect(() => { // cargamos el jugador si cambia el id o cuando se inicia
    const cargarJugador = async () => {
      if (!id) return;

      try {
        const jugadorRef = doc(db, 'players', id as string); // apuntamos al documento del jugador
        const docSnap = await getDoc(jugadorRef);

        if (docSnap.exists()) {
          setJugador({ id: docSnap.id, ...docSnap.data() } as Player);
        } else {
          console.log("No se encontró el jugador");
        }
      } catch (error) {
        console.error("Error al buscar jugador:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarJugador();
  }, [id]); // cuando nace el componente o si el id cambia

  if (cargando) { // gestión de carga
    return (
      <View style={[styles.contenedor, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#1E293B" />
      </View>
    );
  }

  if (!jugador) { // gestión de error
    return (
      <View style={[styles.contenedor, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Error: Jugador no encontrado</Text>
      </View>
    );
  }

  // render del detalle
  return (
    <ScrollView style={styles.contenedor}>
      
      {/* abrir el modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imagenContenedor}>
        <Image 
          source={{ uri: jugador.imagen.includes('http') ? jugador.imagen : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
          style={styles.imagenPerfil} 
        />
        <Text style={styles.textoZoom}>Toca para ampliar</Text>
      </TouchableOpacity>

      <View style={styles.tarjetaDatos}>
        <Text style={styles.tituloNombre}>{jugador.nombre} {jugador.apellidos}</Text>
        <Text style={styles.textoPosicion}>{jugador.posicion}</Text>
        
        <View style={styles.filaDatos}>
          <View style={styles.datoColumna}>
            <Text style={styles.datoLabel}>Edad</Text>
            <Text style={styles.datoValor}>{jugador.edad} años</Text>
          </View>
          <View style={styles.datoColumna}>
            <Text style={styles.datoLabel}>Altura</Text>
            <Text style={styles.datoValor}>{jugador.altura} m</Text>
          </View>
        </View>

        {/* ir al vídeo */}
        <TouchableOpacity 
          style={styles.botonVideo}
          onPress={() => router.push({ pathname: '/multimedia', params: { id: jugador.id } })}
        >
          <Text style={styles.textoBotonVideo}>Ver Vídeo del Jugador</Text>
        </TouchableOpacity>
      </View>

      {/* modal component para zoom */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalFondo}>
          <TouchableOpacity 
            style={styles.botonCerrarModal} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textoCerrar}>Cerrar X</Text>
          </TouchableOpacity>
          
          <Image 
            source={{ uri: jugador.imagen.includes('http') ? jugador.imagen : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
            style={styles.imagenZoom} 
            resizeMode="contain"
          />
        </View>
      </Modal>

    </ScrollView>
  );
}

// estilos
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  imagenContenedor: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#1E293B',
  },
  imagenPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'white',
  },
  textoZoom: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 10,
  },
  tarjetaDatos: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 24,
    minHeight: 400,
  },
  tituloNombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  textoPosicion: {
    fontSize: 18,
    color: '#3B82F6',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 20,
  },
  filaDatos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  datoColumna: {
    alignItems: 'center',
  },
  datoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 5,
  },
  datoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  botonVideo: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBotonVideo: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos del Modal (Zoom)
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenZoom: {
    width: '90%',
    height: '70%',
  },
  botonCerrarModal: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  textoCerrar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});