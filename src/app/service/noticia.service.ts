import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Noticia } from '../models/Notica.model';
import { EstadoPublicacion } from '../enum/EstadoPublicacion';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  cargando = signal<boolean>(false);

  constructor(private firestore: Firestore) {}

  // Obtener noticias del usuario actual
  async obtenerNoticiasUsuario(autorUid: string): Promise<Noticia[]> {
    this.cargando.set(true);
    try {
      const noticiasRef = collection(this.firestore, 'noticias');
      // SOLUCIÓN TEMPORAL: Quitar orderBy para evitar error de índice
      // TODO: Restaurar orderBy('fechaCreacion', 'desc') después de crear el índice
      const q = query(
        noticiasRef,
        where('autorUid', '==', autorUid)
        // orderBy('fechaCreacion', 'desc') // Temporalmente comentado
      );

      const querySnapshot = await getDocs(q);
      const noticias: Noticia[] = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        noticias.push({
          id: docSnapshot.id,
          ...data,
          // Convertir Timestamps a Date
          fechaCreacion: data['fechaCreacion']?.toDate() || new Date(),
          fechaActualizacion: data['fechaActualizacion']?.toDate() || new Date(),
        } as Noticia);
      });

      // SOLUCIÓN TEMPORAL: Ordenar en el cliente
      // TODO: Remover ordenamiento cliente después de crear el índice
      noticias.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());

      return noticias;
    } catch (error) {
      console.error('Error al obtener noticias:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Crear nueva noticia
  async crearNoticia(noticia: Omit<Noticia, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'estado'>): Promise<string> {
    this.cargando.set(true);
    try {
      const noticiasRef = collection(this.firestore, 'noticias');
      const docRef = await addDoc(noticiasRef, {
        ...noticia,
        fechaCreacion: Timestamp.now(),
        fechaActualizacion: Timestamp.now(),
        estado: EstadoPublicacion.BORRADOR
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear noticia:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Actualizar noticia existente
  async actualizarNoticia(
    noticiaId: string,
    datos: Partial<Omit<Noticia, 'id' | 'autorUid' | 'fechaCreacion'>>
  ): Promise<void> {
    this.cargando.set(true);
    try {
      const noticiaRef = doc(this.firestore, 'noticias', noticiaId);
      await updateDoc(noticiaRef, {
        ...datos,
        fechaActualizacion: Timestamp.now(),
        estado: EstadoPublicacion.BORRADOR // Vuelve a borrador al editar
      });
    } catch (error) {
      console.error('Error al actualizar noticia:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Cambiar estado de la noticia
  async cambiarEstado(
    noticiaId: string,
    nuevoEstado: EstadoPublicacion
  ): Promise<void> {
    this.cargando.set(true);
    try {
      const noticiaRef = doc(this.firestore, 'noticias', noticiaId);
      await updateDoc(noticiaRef, {
        estado: nuevoEstado,
        fechaActualizacion: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Eliminar noticia
  async eliminarNoticia(noticiaId: string): Promise<void> {
    this.cargando.set(true);
    try {
      const noticiaRef = doc(this.firestore, 'noticias', noticiaId);
      await deleteDoc(noticiaRef);
    } catch (error) {
      console.error('Error al eliminar noticia:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }
}
