import { Component, computed, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Noticia } from '../../models/Notica.model';
import { Categoria } from '../../models/Categoria.model';
import { Usuario } from '../../models/Usuario.model';
import { NoticiaService } from '../../service/noticia.service';
import { CategoriasService } from '../../service/categorias.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-detalle-noticia-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-noticia-page.html',
  styleUrl: './detalle-noticia-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleNoticiaPage implements OnInit {
  // Inyección de servicios
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private noticiaService = inject(NoticiaService);
  private categoriasService = inject(CategoriasService);
  private authService = inject(AuthService);

  // Signals para datos dinámicos
  noticiaActual = signal<Noticia | null>(null);
  categorias = signal<Categoria[]>([]);
  usuarios = signal<Usuario[]>([]);
  todasLasNoticias = signal<Noticia[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  // Computed signals
  categoria = computed(() => {
    const noticia = this.noticiaActual();
    if (!noticia) return null;
    return this.categorias().find(c => c.id === noticia.categoriaId);
  });

  autor = computed(() => {
    const noticia = this.noticiaActual();
    if (!noticia) return null;
    return this.usuarios().find(u => u.uid === noticia.autorUid);
  });

  noticiasRelacionadas = computed(() => {
    const noticia = this.noticiaActual();
    if (!noticia) return [];

    return this.todasLasNoticias()
      .filter(n => n.categoriaId === noticia.categoriaId && n.id !== noticia.id)
      .slice(0, 3);
  });

  tiempoLectura = computed(() => {
    const noticia = this.noticiaActual();
    if (!noticia) return 0;

    const palabras = noticia.contenido.split(' ').length;
    return Math.ceil(palabras / 200);
  });

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      this.cargando.set(true);
      this.error.set('');

      // Obtener ID de la ruta
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.error.set('ID de noticia no encontrado en la URL');
        return;
      }
// Cargar datos en paralelo
      const [noticia, categorias, todasLasNoticias] = await Promise.all([
        this.noticiaService.obtenerNoticiaPorId(id),
        this.categoriasService.obtenerCategorias(),
        this.noticiaService.obtenerNoticiasPublicadas()
      ]);

      if (!noticia) {
        this.error.set('La noticia no existe o ha sido eliminada');
        return;
      }
      // Obtener autores necesarios (autor de la noticia actual + autores de noticias relacionadas)
      const noticiasRelacionadas = todasLasNoticias
        .filter(n => n.categoriaId === noticia.categoriaId && n.id !== noticia.id)
        .slice(0, 3);

      const autorUidsNecesarios = [
        noticia.autorUid,
        ...noticiasRelacionadas.map(n => n.autorUid)
      ].filter((uid, index, arr) => arr.indexOf(uid) === index); // Eliminar duplicados

      // Obtener usuarios de autores necesarios
      const usuarios = await this.obtenerUsuariosPorIds(autorUidsNecesarios);

      // Actualizar signals
      this.noticiaActual.set(noticia);
      this.categorias.set(categorias);
      this.usuarios.set(usuarios);
      this.todasLasNoticias.set(todasLasNoticias);

    } catch (error) {
      console.error('Error cargando datos de la noticia:', error);
      this.error.set('Error al cargar la noticia. Por favor intenta de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }

  // Método para volver atrás
  volverAtras(): void {
    this.router.navigate(['/']);
  }

  // Método helper para obtener nombre de autor
  getNombreAutor(): string {
    const autor = this.autor();
    return autor ? `${autor.nombre} ${autor.apellido}` : 'Autor desconocido';
  }

  // Métodos de compartir
  compartirFacebook(): void {
    const url = window.location.href;
    const title = this.noticiaActual()?.titulo || '';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  }
// Método para obtener usuarios específicos por IDs (solo autores necesarios)
  private async obtenerUsuariosPorIds(uids: string[]): Promise<Usuario[]> {
    try {
      const usuarios: Usuario[] = [];

      for (const uid of uids) {
        try {
          // Intentar obtener usuario por ID individual
          const docRef = doc(this.firestore, 'usuarios', uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            usuarios.push({
              uid: docSnap.id,
              email: data['email'],
              nombre: data['nombre'],
              apellido: data['apellido'],
              numero: data['numero'],
              rol: data['rol']
            });
          }
        } catch (error) {
          console.warn('Error obteniendo usuario ${uid}:', error);
          // Continuar con otros usuarios si uno falla
        }
      }

      return usuarios;
    } catch (error) {
      console.error('Error obteniendo usuarios por IDs:', error);
      return [];
    }
  }
  compartirTwitter(): void {
    const url = window.location.href;
    const title = this.noticiaActual()?.titulo || '';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  }

  compartirWhatsApp(): void {
    const url = window.location.href;
    const title = this.noticiaActual()?.titulo || '';
    const text = `${title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}
