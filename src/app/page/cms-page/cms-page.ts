import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NoticiaService } from '../../service/noticia.service';
import { CategoriasService } from '../../service/categorias.service';
import { StorageService } from '../../service/storage.service';
import { Noticia } from '../../models/Notica.model';
import { EstadoPublicacion } from '../../enum/EstadoPublicacion';
import { TipoRole } from '../../enum/TipoRole';
import { Categoria } from '../../models/Categoria.model';

type ModoFormulario = 'lista' | 'crear' | 'editar';
type FiltroEstado = 'todas' | EstadoPublicacion;

@Component({
  selector: 'app-cms-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-page.html',
  styleUrl: './cms-page.css',
})
export class CmsPage {
  private authService = inject(AuthService);
  private noticiaService = inject(NoticiaService);
  private categoriasService = inject(CategoriasService);
  storageService = inject(StorageService);
  router = inject(Router);

  // Signals de estado
  noticias = signal<Noticia[]>([]);
  modo = signal<ModoFormulario>('lista');
  filtroEstado = signal<FiltroEstado>('todas');
  noticiaSeleccionada = signal<Noticia | null>(null);
  mostrarConfirmacionEliminar = signal<boolean>(false);
  mensajeError = signal<string>('');
  mensajeExito = signal<string>('');

  // Formulario signals
  formTitulo = signal<string>('');
  formSubtitulo = signal<string>('');
  formContenido = signal<string>('');
  formCategoriaId = signal<string>('');

  // Cambiar de URLs a archivos
  archivosSeleccionados = signal<FileList | null>(null);
  imagenesPreview = signal<string[]>([]);
  subiendoImagenes = signal<boolean>(false);

  // Categorías dinámicas
  categorias = signal<Categoria[]>([]);
  categoriasCargando = signal<boolean>(true);
  categoriasError = signal<string>('');

  // Enums para template
  EstadoPublicacion = EstadoPublicacion;
  TipoRole = TipoRole;

  // Computed signals
  usuarioActual = computed(() => this.authService.usuarioActual());

  tieneAcceso = computed(() => {
    const usuario = this.usuarioActual();
    return usuario?.rol === TipoRole.REPORTERO || usuario?.rol === TipoRole.EDITOR;
  });

  noticiasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    const todasNoticias = this.noticias();

    if (filtro === 'todas') {
      return todasNoticias;
    }

    return todasNoticias.filter(n => n.estado === filtro);
  });

  cargando = computed(() => this.noticiaService.cargando());

  // Contadores de noticias por estado
  contadorBorradores = computed(() =>
    this.noticias().filter(n => n.estado === EstadoPublicacion.BORRADOR).length
  );

  contadorPendientes = computed(() =>
    this.noticias().filter(n => n.estado === EstadoPublicacion.PENDIENTE).length
  );

  contadorPublicadas = computed(() =>
    this.noticias().filter(n => n.estado === EstadoPublicacion.PUBLICADO).length
  );

  imagenesValidas = computed(() =>
    this.imagenesPreview().length > 0
  );

  // Signal para formImagenes
  formImagenes = signal<string[]>([]);

  formularioValido = computed(() => {
    return (
      this.formTitulo().trim().length > 0 &&
      this.formSubtitulo().trim().length > 0 &&
      this.formContenido().trim().length >= 50 &&
      this.formCategoriaId().trim().length > 0 &&
      this.imagenesValidas()
    );
  });

  // Validación: no permitir crear si no hay categorías
  puedeCrearNoticia = computed(() => {
    return this.categorias().length > 0 && !this.categoriasCargando();
  });

  constructor() {
    // Verificar acceso y cargar noticias al iniciar
    effect(() => {
      const usuario = this.usuarioActual();
      if (usuario) {
        if (this.tieneAcceso()) {
          this.cargarNoticias();
          this.cargarCategorias();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  // Cargar noticias del usuario actual
  async cargarNoticias(): Promise<void> {
    const usuario = this.usuarioActual();
    if (!usuario) return;

    try {
      const noticias = await this.noticiaService.obtenerNoticiasUsuario(usuario.uid);
      this.noticias.set(noticias);
      this.limpiarMensajes();
    } catch (error) {
      this.mensajeError.set('Error al cargar las noticias');
      console.error(error);
    }
  }

  // Cargar categorías dinámicas
  async cargarCategorias(): Promise<void> {
    try {
      this.categoriasError.set('');
      const categoriasObtenidas = await this.categoriasService.obtenerCategorias();
      this.categorias.set(categoriasObtenidas);

      if (categoriasObtenidas.length === 0) {
        this.categoriasError.set('No hay categorías disponibles. Contacta al administrador.');
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.categoriasError.set('Error al cargar categorías. Intenta de nuevo.');
    } finally {
      this.categoriasCargando.set(false);
    }
  }

  // Cambiar modo del formulario
  cambiarModo(modo: ModoFormulario, noticia?: Noticia): void {
    this.modo.set(modo);
    this.limpiarMensajes();

    if (modo === 'crear') {
      this.limpiarFormulario();
    } else if (modo === 'editar' && noticia) {
      this.noticiaSeleccionada.set(noticia);
      this.cargarFormulario(noticia);
    } else if (modo === 'lista') {
      this.limpiarFormulario();
      this.noticiaSeleccionada.set(null);
    }
  }

  // Cargar datos en el formulario
  cargarFormulario(noticia: Noticia): void {
    this.formTitulo.set(noticia.titulo);
    this.formSubtitulo.set(noticia.subtitulo);
    this.formContenido.set(noticia.contenido);
    this.formCategoriaId.set(noticia.categoriaId);
    this.formImagenes.set([...noticia.imagen]);
  }

  // Limpiar formulario
  limpiarFormulario(): void {
    this.formTitulo.set('');
    this.formSubtitulo.set('');
    this.formContenido.set('');
    this.formCategoriaId.set('');
    this.archivosSeleccionados.set(null);
    this.imagenesPreview.set([]);
  }

  // Método para manejar selección de archivos
  seleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = input.files;

    if (archivos && archivos.length > 0) {
      // Validar cantidad máxima
      if (archivos.length > 5) {
        this.mensajeError.set('Máximo 5 imágenes permitidas');
        return;
      }

      this.archivosSeleccionados.set(archivos);
      this.generarPreviews(archivos);
    }
  }

  // Generar previews de las imágenes
  private async generarPreviews(archivos: FileList): Promise<void> {
    const previews: string[] = [];

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];

      if (this.validarArchivoPreview(archivo)) {
        const preview = await this.crearPreview(archivo);
        previews.push(preview);
      }
    }

    this.imagenesPreview.set(previews);
  }

  // Crear preview con FileReader
  private crearPreview(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(archivo);
    });
  }

  // Validar archivo para preview
  private validarArchivoPreview(archivo: File): boolean {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return tiposPermitidos.includes(archivo.type);
  }

  // Eliminar preview de imagen
  eliminarPreview(index: number): void {
    this.imagenesPreview.update(previews => previews.filter((_, i) => i !== index));
    // También actualizar archivosSeleccionados si es necesario
    // Nota: FileList es readonly, así que manejamos solo los previews
  }

  // Guardar noticia (crear o editar)
  async guardarNoticia(): Promise<void> {
    if (!this.formularioValido()) {
      this.mensajeError.set('Por favor completa todos los campos requeridos');
      return;
    }

    const usuario = this.usuarioActual();
    if (!usuario) return;

    try {
      let urlsImagenes: string[] = [];

      // Subir imágenes si hay archivos seleccionados
      if (this.archivosSeleccionados()) {
        this.subiendoImagenes.set(true);
        urlsImagenes = await this.storageService.subirImagenes(
          this.archivosSeleccionados()!,
          `noticias/${usuario.uid}`
        );
        this.subiendoImagenes.set(false);
      }

      if (this.modo() === 'crear') {
        await this.noticiaService.crearNoticia({
          titulo: this.formTitulo().trim(),
          subtitulo: this.formSubtitulo().trim(),
          contenido: this.formContenido().trim(),
          categoriaId: this.formCategoriaId(),
          imagen: urlsImagenes,
          autorUid: usuario.uid
        });
        this.mensajeExito.set('Noticia creada como borrador exitosamente');
      } else if (this.modo() === 'editar') {
        const noticia = this.noticiaSeleccionada();
        if (!noticia) return;

        await this.noticiaService.actualizarNoticia(noticia.id, {
          titulo: this.formTitulo().trim(),
          subtitulo: this.formSubtitulo().trim(),
          contenido: this.formContenido().trim(),
          categoriaId: this.formCategoriaId(),
          imagen: urlsImagenes.length > 0 ? urlsImagenes : noticia.imagen
        });
        this.mensajeExito.set('Noticia actualizada como borrador exitosamente');
      }

      await this.cargarNoticias();
      this.cambiarModo('lista');
    } catch (error) {
      this.mensajeError.set('Error al guardar la noticia. Intenta de nuevo.');
      console.error(error);
    } finally {
      this.subiendoImagenes.set(false);
    }
  }

  // Enviar a revisión (cambiar a PENDIENTE)
  async enviarARevision(): Promise<void> {
    if (!this.formularioValido()) {
      this.mensajeError.set('Por favor completa todos los campos requeridos');
      return;
    }

    const confirmar = confirm(
      '¿Estás seguro de enviar esta noticia a revisión? ' +
      'Una vez enviada, no podrás editarla hasta que sea revisada por un administrador.'
    );

    if (!confirmar) return;

    const usuario = this.usuarioActual();
    if (!usuario) return;

    try {
      let urlsImagenes: string[] = [];

      // Subir imágenes si hay archivos seleccionados
      if (this.archivosSeleccionados()) {
        this.subiendoImagenes.set(true);
        urlsImagenes = await this.storageService.subirImagenes(
          this.archivosSeleccionados()!,
          `noticias/${usuario.uid}`
        );
        this.subiendoImagenes.set(false);
      }

      if (this.modo() === 'crear') {
        // Crear y cambiar estado
        const noticiaId = await this.noticiaService.crearNoticia({
          titulo: this.formTitulo().trim(),
          subtitulo: this.formSubtitulo().trim(),
          contenido: this.formContenido().trim(),
          categoriaId: this.formCategoriaId(),
          imagen: urlsImagenes,
          autorUid: usuario.uid
        });
        await this.noticiaService.cambiarEstado(noticiaId, EstadoPublicacion.PENDIENTE);
      } else if (this.modo() === 'editar') {
        const noticia = this.noticiaSeleccionada();
        if (!noticia) return;

        // Actualizar y cambiar estado
        await this.noticiaService.actualizarNoticia(noticia.id, {
          titulo: this.formTitulo().trim(),
          subtitulo: this.formSubtitulo().trim(),
          contenido: this.formContenido().trim(),
          categoriaId: this.formCategoriaId(),
          imagen: urlsImagenes.length > 0 ? urlsImagenes : noticia.imagen
        });
        await this.noticiaService.cambiarEstado(noticia.id, EstadoPublicacion.PENDIENTE);
      }

      this.mensajeExito.set('Noticia enviada a revisión exitosamente');
      await this.cargarNoticias();
      this.cambiarModo('lista');
    } catch (error) {
      this.mensajeError.set('Error al enviar la noticia a revisión');
      console.error(error);
    } finally {
      this.subiendoImagenes.set(false);
    }
  }

  // Cambiar estado de una noticia existente
  async cambiarEstadoNoticia(noticia: Noticia, nuevoEstado: EstadoPublicacion): Promise<void> {
    try {
      await this.noticiaService.cambiarEstado(noticia.id, nuevoEstado);
      this.mensajeExito.set(`Estado cambiado a ${nuevoEstado} exitosamente`);
      await this.cargarNoticias();
    } catch (error) {
      this.mensajeError.set('Error al cambiar el estado');
      console.error(error);
    }
  }

  // Mostrar confirmación de eliminación
  confirmarEliminar(noticia: Noticia): void {
    this.noticiaSeleccionada.set(noticia);
    this.mostrarConfirmacionEliminar.set(true);
  }

  // Cancelar eliminación
  cancelarEliminar(): void {
    this.noticiaSeleccionada.set(null);
    this.mostrarConfirmacionEliminar.set(false);
  }

  // Eliminar noticia
  async eliminarNoticia(): Promise<void> {
    const noticia = this.noticiaSeleccionada();
    if (!noticia) return;

    try {
      await this.noticiaService.eliminarNoticia(noticia.id);
      this.mensajeExito.set('Noticia eliminada exitosamente');
      await this.cargarNoticias();
      this.cancelarEliminar();
    } catch (error) {
      this.mensajeError.set('Error al eliminar la noticia');
      console.error(error);
    }
  }

  // Cambiar filtro de estado
  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroEstado.set(filtro);
  }

  // Obtener nombre de categoría
  obtenerNombreCategoria(categoriaId: string): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  // Obtener clase CSS según estado
  obtenerClaseEstado(estado: EstadoPublicacion): string {
    switch (estado) {
      case EstadoPublicacion.BORRADOR:
        return 'estado-borrador';
      case EstadoPublicacion.PENDIENTE:
        return 'estado-pendiente';
      case EstadoPublicacion.PUBLICADO:
        return 'estado-publicado';
      case EstadoPublicacion.RECHAZADO:
        return 'estado-rechazado';
      default:
        return '';
    }
  }

  // Verificar si puede editar
  puedeEditar(noticia: Noticia): boolean {
    return noticia.estado === EstadoPublicacion.BORRADOR ||
           noticia.estado === EstadoPublicacion.RECHAZADO;
  }

  // Limpiar mensajes
  limpiarMensajes(): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  // Formatear fecha
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
