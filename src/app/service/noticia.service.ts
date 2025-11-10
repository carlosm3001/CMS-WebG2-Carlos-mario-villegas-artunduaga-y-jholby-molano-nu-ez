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
  getDoc,
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

  // Obtener noticias publicadas para la página de inicio
  async obtenerNoticiasPublicadas(): Promise<Noticia[]> {
    this.cargando.set(true);
    try {
      // SOLUCIÓN TEMPORAL: Obtener todas las noticias y filtrar en cliente
      // TODO: Restaurar consulta con where y orderBy después de que el índice esté construido
      const querySnapshot = await getDocs(collection(this.firestore, 'noticias'));

      const noticias: Noticia[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data['estado'] === EstadoPublicacion.PUBLICADO) {
          noticias.push({
            id: doc.id,
            titulo: data['titulo'],
            subtitulo: data['subtitulo'],
            contenido: data['contenido'],
            categoriaId: data['categoriaId'],
            imagen: data['imagen'] || [],
            autorUid: data['autorUid'],
            fechaCreacion: data['fechaCreacion']?.toDate() || new Date(),
            fechaActualizacion: data['fechaActualizacion']?.toDate() || new Date(),
            estado: data['estado']
          });
        }
      });

      // SOLUCIÓN TEMPORAL: Ordenar por fecha de creación descendente en cliente
      // TODO: Remover ordenamiento cliente después de restaurar consulta optimizada
      return noticias.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
    } catch (error) {
      console.error('Error al obtener noticias publicadas:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Obtener noticia por ID
  async obtenerNoticiaPorId(id: string): Promise<Noticia | null> {
    try {
      const docRef = doc(this.firestore, 'noticias', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          titulo: data['titulo'],
          subtitulo: data['subtitulo'],
          contenido: data['contenido'],
          categoriaId: data['categoriaId'],
          imagen: data['imagen'] || [],
          autorUid: data['autorUid'],
          fechaCreacion: data['fechaCreacion']?.toDate() || new Date(),
          fechaActualizacion: data['fechaActualizacion']?.toDate() || new Date(),
          estado: data['estado']
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo noticia por ID:', error);
      throw error;
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
