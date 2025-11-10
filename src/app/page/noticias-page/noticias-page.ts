import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Noticia } from '../../models/Notica.model';
import { Categoria } from '../../models/Categoria.model';
import { NoticiaService } from '../../service/noticia.service';
import { CategoriasService } from '../../service/categorias.service';

@Component({
  selector: 'app-noticias-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './noticias-page.html',
  styleUrl: './noticias-page.css',
})
export class NoticiasPage implements OnInit {
  private noticiaService = inject(NoticiaService);
  private categoriasService = inject(CategoriasService);
  private router = inject(Router);

  // Datos
  todasLasNoticias = signal<Noticia[]>([]);
  categorias = signal<Categoria[]>([]);

  // Estados de carga
  cargandoNoticias = signal<boolean>(false);
  cargandoCategorias = signal<boolean>(false);

  // Filtros
  busqueda = signal<string>('');
  categoriaSeleccionada = signal<string>('todas');
  ordenamiento = signal<'recientes' | 'antiguos' | 'a-z' | 'z-a'>('recientes');

  // Paginación
  paginaActual = signal<number>(1);
  itemsPorPagina = signal<number>(9);

  // Computed: noticias filtradas
  noticiasFiltradas = computed(() => {
    let noticias = [...this.todasLasNoticias()];

    // Filtro por búsqueda
    const busqueda = this.busqueda().toLowerCase();
    if (busqueda) {
      noticias = noticias.filter(n =>
        n.titulo.toLowerCase().includes(busqueda) ||
        n.subtitulo.toLowerCase().includes(busqueda) ||
        n.contenido.toLowerCase().includes(busqueda)
      );
    }

    // Filtro por categoría
    if (this.categoriaSeleccionada() !== 'todas') {
      noticias = noticias.filter(n => n.categoriaId === this.categoriaSeleccionada());
    }

    // Ordenamiento
    switch (this.ordenamiento()) {
      case 'recientes':
        noticias.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        break;
      case 'antiguos':
        noticias.sort((a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime());
        break;
      case 'a-z':
        noticias.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'z-a':
        noticias.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
    }

    return noticias;
  });

  // Computed: total de páginas
  totalPaginas = computed(() =>
    Math.ceil(this.noticiasFiltradas().length / this.itemsPorPagina())
  );

  // Computed: noticias de la página actual
  noticiasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina();
    const fin = inicio + this.itemsPorPagina();
    return this.noticiasFiltradas().slice(inicio, fin);
  });

  // Computed: array de números de página para mostrar
  numerosPagina = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const numeros: number[] = [];

    if (total === 0) return numeros;

    // Mostrar hasta 5 números de página
    let inicio = Math.max(1, actual - 2);
    let fin = Math.min(total, actual + 2);

    // Ajustar si estamos cerca del inicio o fin
    if (actual <= 3) {
      fin = Math.min(5, total);
    }
    if (actual >= total - 2) {
      inicio = Math.max(1, total - 4);
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }

    return numeros;
  });

  // Computed: información de paginación
  rangoResultados = computed(() => {
    const total = this.noticiasFiltradas().length;
    if (total === 0) return { inicio: 0, fin: 0, total: 0 };

    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina() + 1;
    const fin = Math.min(this.paginaActual() * this.itemsPorPagina(), total);

    return { inicio, fin, total };
  });

  // Métodos de filtros
  buscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.busqueda.set(input.value);
    this.paginaActual.set(1); // Reset a primera página
  }

  filtrarPorCategoria(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.categoriaSeleccionada.set(select.value);
    this.paginaActual.set(1);
  }

  ordenarPor(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ordenamiento.set(select.value as 'recientes' | 'antiguos' | 'a-z' | 'z-a');
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoriaSeleccionada.set('todas');
    this.ordenamiento.set('recientes');
    this.paginaActual.set(1);
  }

  // Métodos de paginación
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
      // Scroll al inicio de la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  irAPrimeraPagina(): void {
    this.irAPagina(1);
  }

  irAUltimaPagina(): void {
    this.irAPagina(this.totalPaginas());
  }

  paginaAnterior(): void {
    this.irAPagina(this.paginaActual() - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual() + 1);
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargandoCategorias.set(true);
    this.cargandoNoticias.set(true);

    try {
      const [categorias, noticias] = await Promise.all([
        this.categoriasService.obtenerCategorias(),
        this.noticiaService.obtenerNoticiasPublicadas()
      ]);

      this.categorias.set(categorias);
      this.todasLasNoticias.set(noticias);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.cargandoCategorias.set(false);
      this.cargandoNoticias.set(false);
    }
  }

  // Helper
  getNombreCategoria(categoriaId: string): string {
    return this.categorias().find(c => c.id === categoriaId)?.nombre || '';
  }
}
