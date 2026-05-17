import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebaseConfig';

export default function MultimediaScreen() {
  const { id } = useLocalSearchParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  
  // referencia del video para poder mandarle componentes como los botones de acción
  const videoRef = useRef<Video>(null);
  
  // estados para saber cómo pintar los botones según el estado del vídeo
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // cargar la url desde la bbdd
  useEffect(() => {
    const cargarVideo = async () => {
      if (!id) return;
      try {
        const jugadorRef = doc(db, 'players', id as string);
        const docSnap = await getDoc(jugadorRef);

        if (docSnap.exists()) {
          const datos = docSnap.data();
          const urlFinal = datos.video.startsWith('http') // url internet o url local (se pone uno de test)
            ? datos.video 
            : 'https://www.w3schools.com/html/mov_bbb.mp4';
          
          setVideoUrl(urlFinal);
        }
      } catch (error) {
        console.error("Error al buscar vídeo:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarVideo();
  }, [id]);

  // botones de acción ------------------
  const hacerPlay = () => {
    videoRef.current?.playAsync();
    setIsPlaying(true);
  };

  const hacerPausa = () => {
    videoRef.current?.pauseAsync();
    setIsPlaying(false);
  };

  const hacerStop = () => { // pausar y volver al 0
    videoRef.current?.pauseAsync();
    videoRef.current?.setPositionAsync(0);
    setIsPlaying(false);
  };

  const alternarSilencio = () => {
    videoRef.current?.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  if (cargando) {
    return (
      <View style={[styles.contenedor, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Visualizando Jugada</Text>

      {/* componente nativo */}
      <View style={styles.videoContenedor}>
        {videoUrl && (
          <Video
            ref={videoRef}
            style={styles.reproductor}
            source={{ uri: videoUrl }}
            useNativeControls={false} 
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={status => {
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              }
            }}
          />
        )}
      </View>

      {/* botones de acción */}
      <View style={styles.panelControles}>
        {!isPlaying ? (
          <TouchableOpacity style={[styles.boton, styles.botonVerde]} onPress={hacerPlay}>
            <Text style={styles.textoBoton}>PLAY</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.boton, styles.botonAmarillo]} onPress={hacerPausa}>
            <Text style={styles.textoBoton}>PAUSA</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.boton, styles.botonRojo]} onPress={hacerStop}>
          <Text style={styles.textoBoton}>STOP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonGris]} onPress={alternarSilencio}>
          <Text style={styles.textoBoton}>{isMuted ? "SONIDO ON" : "SILENCIAR"}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.infoExtra}>URL Origen: {videoUrl}</Text>
    </View>
  );
}

// estilos
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    paddingTop: 40,
  },
  titulo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoContenedor: {
    width: '100%',
    height: 250,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  reproductor: {
    flex: 1,
  },
  panelControles: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  botonVerde: { backgroundColor: '#22C55E' },
  botonAmarillo: { backgroundColor: '#EAB308' },
  botonRojo: { backgroundColor: '#EF4444' },
  botonGris: { backgroundColor: '#64748B' },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoExtra: {
    color: '#475569',
    fontSize: 10,
    marginTop: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});