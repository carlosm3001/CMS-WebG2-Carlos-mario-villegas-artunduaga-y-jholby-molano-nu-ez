import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Noticia } from '../../models/Notica.model';
import { Categoria } from '../../models/Categoria.model';
import { Usuario } from '../../models/Usuario.model';
import { NOTICIAS, CATEGORIAS, USUARIOS } from '../../data';

@Component({
  selector: 'app-detalle-noticia-page',
  imports: [CommonModule],
  templateUrl: './detalle-noticia-page.html',
  styleUrl: './detalle-noticia-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleNoticiaPage {
  // Por ahora usamos la primera noticia como ejemplo
  // En el futuro se obtendrá el ID de los route params
  noticiaActual = signal<Noticia>(NOTICIAS[0]);

  todasLasNoticias = signal<Noticia[]>(NOTICIAS);
  categorias = signal<Categoria[]>(CATEGORIAS);
  usuarios = signal<Usuario[]>(USUARIOS);

  // Computed: Categoría de la noticia actual
  categoria = computed(() => {
    const categoriaId = this.noticiaActual().categoriaId;
    return this.categorias().find(c => c.id === categoriaId);
  });

  // Computed: Autor de la noticia
  autor = computed(() => {
    const autorUid = this.noticiaActual().autorUid;
    return this.usuarios().find(u => u.uid === autorUid);
  });

  // Computed: Noticias relacionadas (misma categoría, excluyendo la actual)
  noticiasRelacionadas = computed(() => {
    const categoriaId = this.noticiaActual().categoriaId;
    const noticiaId = this.noticiaActual().id;

    return this.todasLasNoticias()
      .filter(n => n.categoriaId === categoriaId && n.id !== noticiaId)
      .slice(0, 3); // Máximo 3 noticias relacionadas
  });

  // Computed: Tiempo estimado de lectura (basado en palabras)
  tiempoLectura = computed(() => {
    const palabras = this.noticiaActual().contenido.split(' ').length;
    const minutos = Math.ceil(palabras / 200); // ~200 palabras por minuto
    return minutos;
  });

  // Método para volver atrás
  volverAtras(): void {
    window.history.back();
  }

  // Método helper para obtener nombre de autor
  getNombreAutor(): string {
    const autor = this.autor();
    return autor ? `${autor.nombre} ${autor.apellido}` : 'Autor desconocido';
  }

  // Métodos de compartir (opcional, por ahora solo console.log)
  compartirFacebook(): void {
    console.log('Compartir en Facebook');
    // En producción: window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
  }

  compartirTwitter(): void {
    console.log('Compartir en Twitter');
    // En producción: window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`)
  }

  compartirWhatsApp(): void {
    console.log('Compartir en WhatsApp');
    // En producción: window.open(`https://wa.me/?text=${title} ${url}`)
  }
}
