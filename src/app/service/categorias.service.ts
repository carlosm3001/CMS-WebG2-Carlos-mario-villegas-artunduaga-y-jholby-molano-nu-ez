import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  orderBy,
  query
} from '@angular/fire/firestore';
import { Categoria } from '../models/Categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  cargando = signal<boolean>(false);

  constructor(private firestore: Firestore) {}

  // Obtener todas las categorías ordenadas por nombre
  async obtenerCategorias(): Promise<Categoria[]> {
    this.cargando.set(true);
    try {
      const categoriasRef = collection(this.firestore, 'categorias');
      const q = query(categoriasRef, orderBy('nombre', 'asc'));

      const querySnapshot = await getDocs(q);
      const categorias: Categoria[] = [];

      querySnapshot.forEach((doc) => {
        categorias.push({
          id: doc.id,
          ...doc.data()
        } as Categoria);
      });

      return categorias;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }
}
