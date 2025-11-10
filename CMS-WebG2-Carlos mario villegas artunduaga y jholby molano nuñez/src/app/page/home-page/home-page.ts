import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../models/Categoria.model';
import { Noticia } from '../../models/Notica.model';
import { CATEGORIAS, NOTICIAS } from '../../data';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  // Signals para datos estáticos
  categorias = signal<Categoria[]>(CATEGORIAS);
  todasLasNoticias = signal<Noticia[]>(NOTICIAS);

  // Computed signals para organizar las noticias
  noticiaDestacada = computed(() => this.todasLasNoticias()[0]);

  noticiasGrid = computed(() => this.todasLasNoticias().slice(1, 7));

  noticiasUltimas = computed(() => this.todasLasNoticias().slice(7, 10));

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
