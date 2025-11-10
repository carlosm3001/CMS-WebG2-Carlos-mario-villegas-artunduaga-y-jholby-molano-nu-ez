import { Injectable, signal, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  query,
  orderBy,
  where
} from '@angular/fire/firestore';
import { Usuario } from '../models/Usuario.model';
import { Noticia } from '../models/Notica.model';
import { Categoria } from '../models/Categoria.model';
import { TipoRole } from '../enum/TipoRole';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  cargando = signal<boolean>(false);
  private authService = inject(AuthService);

  constructor(private firestore: Firestore) {}

  // ========================================
  // GESTIÓN DE USUARIOS
  // ========================================

  // Obtener todos los usuarios
  async obtenerTodosUsuarios(): Promise<Usuario[]> {
    this.cargando.set(true);
    try {
      const usuariosRef = collection(this.firestore, 'usuarios');
      const q = query(usuariosRef, orderBy('nombre', 'asc'));

      const querySnapshot = await getDocs(q);
      const usuarios: Usuario[] = [];

      querySnapshot.forEach((doc) => {
        usuarios.push({
          uid: doc.id,
          ...doc.data()
        } as Usuario);
      });

      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Cambiar rol de un usuario
  async cambiarRolUsuario(uid: string, nuevoRol: TipoRole): Promise<void> {
    // Validar que no sea el propio usuario
    if (this.authService.usuarioActual()?.uid === uid) {
      throw new Error('No puedes cambiar tu propio rol');
    }

    this.cargando.set(true);
    try {
      const usuarioRef = doc(this.firestore, 'usuarios', uid);
      await updateDoc(usuarioRef, { rol: nuevoRol });
    } catch (error) {
      console.error('Error al cambiar rol del usuario:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Eliminar usuario
  async eliminarUsuario(uid: string): Promise<void> {
    // Validar que no sea el propio usuario
    if (this.authService.usuarioActual()?.uid === uid) {
      throw new Error('No puedes eliminar tu propia cuenta');
    }

    this.cargando.set(true);
    try {
      const usuarioRef = doc(this.firestore, 'usuarios', uid);
      await deleteDoc(usuarioRef);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // GESTIÓN DE NOTICIAS
  // ========================================

  // Obtener todas las noticias (para administración)
  async obtenerTodasNoticias(): Promise<Noticia[]> {
    this.cargando.set(true);
    try {
      const noticiasRef = collection(this.firestore, 'noticias');
      const q = query(noticiasRef, orderBy('fechaCreacion', 'desc'));

      const querySnapshot = await getDocs(q);
      const noticias: Noticia[] = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        noticias.push({
          id: docSnapshot.id,
          ...data,
          fechaCreacion: data['fechaCreacion']?.toDate() || new Date(),
          fechaActualizacion: data['fechaActualizacion']?.toDate() || new Date(),
        } as Noticia);
      });

      return noticias;
    } catch (error) {
      console.error('Error al obtener todas las noticias:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // GESTIÓN DE CATEGORÍAS
  // ========================================

  // Crear nueva categoría
  async crearCategoria(categoria: Omit<Categoria, 'id'>): Promise<string> {
    this.cargando.set(true);
    try {
      const categoriasRef = collection(this.firestore, 'categorias');
      const docRef = await addDoc(categoriasRef, categoria);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Actualizar categoría
  async actualizarCategoria(categoriaId: string, datos: Partial<Categoria>): Promise<void> {
    this.cargando.set(true);
    try {
      const categoriaRef = doc(this.firestore, 'categorias', categoriaId);
      await updateDoc(categoriaRef, datos);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Eliminar categoría
  async eliminarCategoria(categoriaId: string): Promise<void> {
    this.cargando.set(true);
    try {
      const categoriaRef = doc(this.firestore, 'categorias', categoriaId);
      await deleteDoc(categoriaRef);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // ESTADÍSTICAS
  // ========================================

  // Obtener estadísticas generales
  async obtenerEstadisticas(): Promise<{
    totalUsuarios: number;
    totalNoticias: number;
    totalCategorias: number;
    noticiasPorEstado: Record<string, number>;
    usuariosPorRol: Record<string, number>;
  }> {
    this.cargando.set(true);
    try {
      // Obtener todos los usuarios
      const usuariosRef = collection(this.firestore, 'usuarios');
      const usuariosSnapshot = await getDocs(usuariosRef);
      const totalUsuarios = usuariosSnapshot.size;

      // Contar usuarios por rol
      const usuariosPorRol: Record<string, number> = {};
      usuariosSnapshot.forEach((doc) => {
        const usuario = doc.data() as Usuario;
        usuariosPorRol[usuario.rol] = (usuariosPorRol[usuario.rol] || 0) + 1;
      });

      // Obtener todas las noticias
      const noticiasRef = collection(this.firestore, 'noticias');
      const noticiasSnapshot = await getDocs(noticiasRef);
      const totalNoticias = noticiasSnapshot.size;

      // Contar noticias por estado
      const noticiasPorEstado: Record<string, number> = {};
      noticiasSnapshot.forEach((doc) => {
        const noticia = doc.data() as Noticia;
        noticiasPorEstado[noticia.estado] = (noticiasPorEstado[noticia.estado] || 0) + 1;
      });

      // Obtener total de categorías
      const categoriasRef = collection(this.firestore, 'categorias');
      const categoriasSnapshot = await getDocs(categoriasRef);
      const totalCategorias = categoriasSnapshot.size;

      return {
        totalUsuarios,
        totalNoticias,
        totalCategorias,
        noticiasPorEstado,
        usuariosPorRol
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }
}
