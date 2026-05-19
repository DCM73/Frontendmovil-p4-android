import { getApp } from 'firebase/app';
import { get, ref } from 'firebase/database';
import { db } from '../firebaseConfig';

export type Player = {
  id: string;
  nombre: string;
  apellidos: string;
  edad: number;
  altura: number;
  posicion: string;
  photoUrl: string;
  videoUrl: string;
};

export const getjugadoresOnce = async (): Promise<Player[]> => {
  console.log('➡️ Llamando a Firebase ruta "jugadores" ...');

  try {
    const app = getApp();
    console.log('🔥 Firebase projectId:', app.options.projectId);
    console.log('🔥 Firebase databaseURL:', app.options.databaseURL);
    console.log('🔥 DB app projectId:', db.app.options.projectId);
    console.log('🔥 DB app databaseURL:', db.app.options.databaseURL);

    // ✅ Ruta típica: /jugadores
    const snapshot = await get(ref(db, 'jugadores/jugadores'));

    if (!snapshot.exists()) {
      console.log('⚠️ No hay datos (o no existe) la ruta "jugadores" en esta DB.');
      return [];
    }

    const data = snapshot.val(); // { "id1": {...}, "id2": {...} }

    // ✅ LOG 1: ver el JSON completo que viene de Firebase
    console.log('📦 raw data:', JSON.stringify(data, null, 2));


    // Tu log actual (keys)
    console.log('📦 Raw data keys:', data ? Object.keys(data) : []);

    const lista: Player[] = Object.keys(data).map((key) => {
      const item = data[key] ?? {};

      // ✅ LOG 2: ver cada jugador tal cual viene de Firebase
      console.log('🧩 item raw:', JSON.stringify(item, null, 2));

      return {
        id: key,
        nombre: item.nombre ?? '',
        apellidos: item.apellidos ?? '',
        edad: item.edad ?? 0,
        altura: item.altura ?? 0,
        posicion: item.posicion ?? '',
        photoUrl: item.photoUrl ?? '',
        // por si en algún momento lo escribiste como "videoUrlL" o similar:
        videoUrl: item.videoUrl ?? item.videoUrlL ?? '',
      };
    });

    console.log('✅ lista jugadores:', lista);
    return lista;
  } catch (e) {
    console.log('❌ Error leyendo jugadores en RTDB:', e);
    return [];
  }
};