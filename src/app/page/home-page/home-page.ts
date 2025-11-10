import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/Categoria.model';
import { Noticia } from '../../models/Notica.model';
import { NoticiaService } from '../../service/noticia.service';
import { CategoriasService } from '../../service/categorias.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  // Inyección de servicios
  private noticiaService = inject(NoticiaService);
  private categoriasService = inject(CategoriasService);

  // Signals para datos dinámicos
  noticias = signal<Noticia[]>([]);
  categorias = signal<Categoria[]>([]);

  // Estados de carga
  cargandoNoticias = signal<boolean>(false);
  cargandoCategorias = signal<boolean>(false);

  // Computed signals para organizar las noticias
  noticiaDestacada = computed(() => this.noticias()[0]);

  noticiasGrid = computed(() => {
    const todas = this.noticias();
    // Si hay más de 4 noticias, mostrar 6 en el grid (índices 1-6)
    // Si hay 4 o menos, mostrar todas menos la primera (destacada)
    if (todas.length > 4) {
      return todas.slice(1, 7); // 6 noticias para el grid
    } else {
      return todas.slice(1); // Todas menos la destacada
    }
  });

  noticiasUltimas = computed(() => {
    const todas = this.noticias();
    // Tomar las últimas 3 noticias, o menos si no hay suficientes
    return todas.slice(-3);
  });

  // Lifecycle hook
  ngOnInit() {
    this.cargarNoticias();
    this.cargarCategorias();
  }

  // Cargar noticias publicadas
  async cargarNoticias() {
    this.cargandoNoticias.set(true);
    try {
      const noticias = await this.noticiaService.obtenerNoticiasPublicadas();
      this.noticias.set(noticias);
    } catch (error) {
      console.error('Error cargando noticias:', error);
    } finally {
      this.cargandoNoticias.set(false);
    }
  }

  // Cargar categorías
  async cargarCategorias() {
    this.cargandoCategorias.set(true);
    try {
      const categorias = await this.categoriasService.obtenerCategorias();
      this.categorias.set(categorias);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      this.cargandoCategorias.set(false);
    }
  }

  // Método helper para obtener nombre de categoría
  getNombreCategoria(categoriaId: string): string {
    const categoria = this.categorias().find(cat => cat.id === categoriaId);
    return categoria?.nombre || '';
  }

  // Método helper para formatear fecha relativa
  getHorasTranscurridas(fecha: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));

    if (horas < 1) return 'Hace menos de 1 hora';
    if (horas === 1) return 'Hace 1 hora';
    if (horas < 24) return `Hace ${horas} horas`;

    const dias = Math.floor(horas / 24);
    if (dias === 1) return 'Hace 1 día';
    return `Hace ${dias} días`;
  }
}
