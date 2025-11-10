import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AdminService } from '../../service/admin.service';
import { CategoriasService } from '../../service/categorias.service';
import { NoticiaService } from '../../service/noticia.service';
import { Usuario } from '../../models/Usuario.model';
import { Noticia } from '../../models/Notica.model';
import { Categoria } from '../../models/Categoria.model';
import { TipoRole } from '../../enum/TipoRole';
import { EstadoPublicacion } from '../../enum/EstadoPublicacion';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css']
})
export class AdminPage implements OnInit {
  // Servicios
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private categoriasService = inject(CategoriasService);
  private noticiaService = inject(NoticiaService);

  // Estado de la página
  seccionActiva = signal<'dashboard' | 'usuarios' | 'publicaciones' | 'categorias'>('dashboard');
  cargando = signal<boolean>(false);
  mensaje = signal<string>('');

  // Usuario actual
  usuarioActual = this.authService.usuarioActual;

  // Método para verificar si es el usuario actual
  esUsuarioActual(userId: string): boolean {
    return this.usuarioActual()?.uid === userId;
  }

  // Dashboard - Estadísticas
  estadisticas = signal<{
    totalUsuarios: number;
    totalNoticias: number;
    totalCategorias: number;
    noticiasPorEstado: Record<string, number>;
    usuariosPorRol: Record<string, number>;
  } | null>(null);

  // Gestión de Usuarios
  usuarios = signal<Usuario[]>([]);
  filtroUsuario = signal<string>('');
  usuariosFiltrados = computed(() => {
    const filtro = this.filtroUsuario().toLowerCase();
    if (!filtro) return this.usuarios();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(filtro) ||
      u.apellido.toLowerCase().includes(filtro) ||
      u.email.toLowerCase().includes(filtro) ||
      u.rol.toLowerCase().includes(filtro)
    );
  });

  // Gestión de Publicaciones
  publicaciones = signal<Noticia[]>([]);
  categorias = signal<Categoria[]>([]);
  filtroPublicacion = signal<{
    estado: string;
    autor: string;
    categoria: string;
  }>({
    estado: '',
    autor: '',
    categoria: ''
  });

  publicacionesFiltradas = computed(() => {
    const filtro = this.filtroPublicacion();
    return this.publicaciones().filter(p => {
      const coincideEstado = !filtro.estado || p.estado === filtro.estado;
      const coincideAutor = !filtro.autor || p.autorUid === filtro.autor;
      const coincideCategoria = !filtro.categoria || p.categoriaId === filtro.categoria;
      return coincideEstado && coincideAutor && coincideCategoria;
    });
  });

  // Gestión de Categorías
  nuevaCategoria = signal<{ nombre: string; descripcion: string }>({
    nombre: '',
    descripcion: ''
  });
  categoriaEditando = signal<Categoria | null>(null);

  // Estados disponibles
  estadosPublicacion = Object.values(EstadoPublicacion);
  rolesUsuario = Object.values(TipoRole);

  async ngOnInit(): Promise<void> {
    await this.cargarDashboard();
    await this.cargarUsuarios();
    await this.cargarPublicaciones();
    await this.cargarCategorias();
  }

  // ========================================
  // NAVEGACIÓN
  // ========================================

  cambiarSeccion(seccion: 'dashboard' | 'usuarios' | 'publicaciones' | 'categorias'): void {
    this.seccionActiva.set(seccion);
    this.mensaje.set('');
  }

  // ========================================
  // DASHBOARD
  // ========================================

  async cargarDashboard(): Promise<void> {
    try {
      this.cargando.set(true);
      const stats = await this.adminService.obtenerEstadisticas();
      this.estadisticas.set(stats);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      this.mostrarMensaje('Error al cargar estadísticas');
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // GESTIÓN DE USUARIOS
  // ========================================

  async cargarUsuarios(): Promise<void> {
    try {
      this.cargando.set(true);
      const usuarios = await this.adminService.obtenerTodosUsuarios();
      this.usuarios.set(usuarios);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.mostrarMensaje('Error al cargar usuarios');
    } finally {
      this.cargando.set(false);
    }
  }

  async cambiarRolUsuario(uid: string, nuevoRol: TipoRole): Promise<void> {
    if (this.esUsuarioActual(uid)) {
      this.mostrarMensaje('No puedes cambiar tu propio rol');
      return;
    }

    if (!confirm(`¿Cambiar rol a ${nuevoRol}?`)) return;

    try {
      this.cargando.set(true);
      await this.adminService.cambiarRolUsuario(uid, nuevoRol);
      await this.cargarUsuarios();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      this.mostrarMensaje('Error al cambiar rol del usuario');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarUsuario(uid: string, nombre: string): Promise<void> {
    if (this.esUsuarioActual(uid)) {
      this.mostrarMensaje('No puedes eliminar tu propia cuenta');
      return;
    }

    if (!confirm(`¿Eliminar usuario ${nombre}? Esta acción no se puede deshacer.`)) return;

    try {
      this.cargando.set(true);
      await this.adminService.eliminarUsuario(uid);
      await this.cargarUsuarios();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      this.mostrarMensaje('Error al eliminar usuario');
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // GESTIÓN DE PUBLICACIONES
  // ========================================

  async cargarPublicaciones(): Promise<void> {
    try {
      this.cargando.set(true);
      const publicaciones = await this.adminService.obtenerTodasNoticias();
      this.publicaciones.set(publicaciones);
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      this.mostrarMensaje('Error al cargar publicaciones');
    } finally {
      this.cargando.set(false);
    }
  }

  async cambiarEstadoPublicacion(noticiaId: string, nuevoEstado: EstadoPublicacion): Promise<void> {
    try {
      this.cargando.set(true);
      await this.noticiaService.cambiarEstado(noticiaId, nuevoEstado);
      await this.cargarPublicaciones();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Estado de publicación actualizado');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      this.mostrarMensaje('Error al cambiar estado de la publicación');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarPublicacion(noticiaId: string, titulo: string): Promise<void> {
    if (!confirm(`¿Eliminar publicación "${titulo}"? Esta acción no se puede deshacer.`)) return;

    try {
      this.cargando.set(true);
      await this.noticiaService.eliminarNoticia(noticiaId);
      await this.cargarPublicaciones();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Publicación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      this.mostrarMensaje('Error al eliminar publicación');
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // GESTIÓN DE CATEGORÍAS
  // ========================================

  async cargarCategorias(): Promise<void> {
    try {
      this.cargando.set(true);
      const categorias = await this.categoriasService.obtenerCategorias();
      this.categorias.set(categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.mostrarMensaje('Error al cargar categorías');
    } finally {
      this.cargando.set(false);
    }
  }

  async crearCategoria(): Promise<void> {
    const categoria = this.nuevaCategoria();
    if (!categoria.nombre.trim()) {
      this.mostrarMensaje('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      this.cargando.set(true);
      await this.adminService.crearCategoria({
        nombre: categoria.nombre.trim(),
        descripcion: categoria.descripcion.trim()
      });

      // Limpiar formulario
      this.nuevaCategoria.set({ nombre: '', descripcion: '' });
      await this.cargarCategorias();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Categoría creada correctamente');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      this.mostrarMensaje('Error al crear categoría');
    } finally {
      this.cargando.set(false);
    }
  }

  iniciarEdicionCategoria(categoria: Categoria): void {
    this.categoriaEditando.set({ ...categoria });
  }

  cancelarEdicionCategoria(): void {
    this.categoriaEditando.set(null);
  }

  async guardarEdicionCategoria(): Promise<void> {
    const categoria = this.categoriaEditando();
    if (!categoria || !categoria.nombre.trim()) {
      this.mostrarMensaje('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      this.cargando.set(true);
      await this.adminService.actualizarCategoria(categoria.id, {
        nombre: categoria.nombre.trim(),
        descripcion: categoria.descripcion?.trim()
      });

      this.categoriaEditando.set(null);
      await this.cargarCategorias();
      this.mostrarMensaje('Categoría actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      this.mostrarMensaje('Error al actualizar categoría');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarCategoria(categoriaId: string, nombre: string): Promise<void> {
    if (!confirm(`¿Eliminar categoría "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      this.cargando.set(true);
      await this.adminService.eliminarCategoria(categoriaId);
      await this.cargarCategorias();
      await this.cargarDashboard(); // Actualizar estadísticas
      this.mostrarMensaje('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      this.mostrarMensaje('Error al eliminar categoría');
    } finally {
      this.cargando.set(false);
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  private mostrarMensaje(mensaje: string): void {
    this.mensaje.set(mensaje);
    setTimeout(() => this.mensaje.set(''), 5000); // Limpiar mensaje después de 5 segundos
  }

  // Helpers para templates
  getNombreCategoria(categoriaId: string): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  getNombreUsuario(uid: string): string {
    const usuario = this.usuarios().find(u => u.uid === uid);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario desconocido';
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
