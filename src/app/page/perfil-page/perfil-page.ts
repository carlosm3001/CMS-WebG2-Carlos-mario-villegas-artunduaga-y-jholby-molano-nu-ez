import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Usuario } from '../../models/Usuario.model';
import { doc, updateDoc, Firestore } from '@angular/fire/firestore';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-perfil-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilPage {
  // Inyección de dependencias
  authService = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Modo edición
  modoEdicion = signal<boolean>(false);

  // Datos editables (copias para el formulario)
  nombreEdit = signal<string>('');
  apellidoEdit = signal<string>('');
  numeroEdit = signal<string>('');

  // Estados
  guardando = signal<boolean>(false);
  mensaje = signal<{ tipo: 'success' | 'error', texto: string } | null>(null);

  constructor() {
    // Inicializar datos editables
    const usuario = this.authService.usuarioActual();
    if (usuario) {
      this.nombreEdit.set(usuario.nombre);
      this.apellidoEdit.set(usuario.apellido);
      this.numeroEdit.set(usuario.numero);
    }
  }

  // Computed: nombre completo
  nombreCompleto = computed(() => {
    const usuario = this.authService.usuarioActual();
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : '';
  });

  // Activar modo edición
  activarEdicion(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario) {
      this.nombreEdit.set(usuario.nombre);
      this.apellidoEdit.set(usuario.apellido);
      this.numeroEdit.set(usuario.numero);
      this.modoEdicion.set(true);
      this.mensaje.set(null);
    }
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.mensaje.set(null);
  }

  // Guardar cambios
  async guardarCambios(): Promise<void> {
    const usuario = this.authService.usuarioActual();
    if (!usuario) return;

    // Validaciones
    if (!this.nombreEdit() || !this.apellidoEdit() || !this.numeroEdit()) {
      this.mensaje.set({ tipo: 'error', texto: 'Todos los campos son obligatorios' });
      return;
    }

    this.guardando.set(true);
    this.mensaje.set(null);

    try {
      // Actualizar en Firestore
      const usuarioRef = doc(this.firestore, 'usuarios', usuario.uid);
      await updateDoc(usuarioRef, {
        nombre: this.nombreEdit(),
        apellido: this.apellidoEdit(),
        numero: this.numeroEdit()
      });

      // Actualizar el signal local
      const usuarioActualizado: Usuario = {
        ...usuario,
        nombre: this.nombreEdit(),
        apellido: this.apellidoEdit(),
        numero: this.numeroEdit()
      };
      this.authService.usuarioActual.set(usuarioActualizado);

      this.modoEdicion.set(false);
      this.mensaje.set({ tipo: 'success', texto: 'Perfil actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      this.mensaje.set({ tipo: 'error', texto: 'Error al actualizar el perfil' });
    } finally {
      this.guardando.set(false);
    }
  }

  // Cerrar sesión
  async cerrarSesion(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Obtener nombre del rol
  getNombreRol(rol: string): string {
    const roles: Record<string, string> = {
      'Visitante': 'Visitante',
      'Reportero': 'Reportero',
      'Editor': 'Editor',
      'Admin': 'Administrador'
    };
    return roles[rol] || rol;
  }

  // Obtener color del badge del rol
  getColorRol(rol: string): string {
    const colores: Record<string, string> = {
      'Visitante': 'bg-gray-200 text-gray-800',
      'Reportero': 'bg-blue-200 text-blue-800',
      'Editor': 'bg-purple-200 text-purple-800',
      'Admin': 'bg-red-200 text-red-800'
    };
    return colores[rol] || 'bg-gray-200 text-gray-800';
  }
}
