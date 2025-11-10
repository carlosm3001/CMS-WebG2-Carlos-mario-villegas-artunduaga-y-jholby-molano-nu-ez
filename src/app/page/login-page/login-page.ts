import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  // Modo: 'login' o 'registro'
  modo = signal<'login' | 'registro'>('login');

  // Formulario de login
  emailLogin = signal<string>('');
  passwordLogin = signal<string>('');

  // Formulario de registro
  emailRegistro = signal<string>('');
  passwordRegistro = signal<string>('');
  confirmarPassword = signal<string>('');
  nombre = signal<string>('');
  apellido = signal<string>('');
  numero = signal<string>('');

  // Estados
  error = signal<string>('');
  mostrarPassword = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Cambiar entre login y registro
  cambiarModo(nuevoModo: 'login' | 'registro'): void {
    this.modo.set(nuevoModo);
    this.error.set('');
  }

  // Iniciar sesión
  async iniciarSesion(): Promise<void> {
    this.error.set('');

    // Validaciones
    if (!this.emailLogin() || !this.passwordLogin()) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    try {
      await this.authService.login(this.emailLogin(), this.passwordLogin());
      // Redirigir al home después del login
      this.router.navigate(['/']);
    } catch (error: any) {
      this.manejarError(error);
    }
  }

  // Registrarse
  async registrarse(): Promise<void> {
    this.error.set('');

    // Validaciones
    if (!this.emailRegistro() || !this.passwordRegistro() ||
        !this.nombre() || !this.apellido() || !this.numero()) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    if (this.passwordRegistro() !== this.confirmarPassword()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.passwordRegistro().length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await this.authService.registrar({
        email: this.emailRegistro(),
        password: this.passwordRegistro(),
        nombre: this.nombre(),
        apellido: this.apellido(),
        numero: this.numero()
      });
      // Redirigir al home después del registro
      this.router.navigate(['/']);
    } catch (error: any) {
      this.manejarError(error);
    }
  }

  // Manejar errores de Firebase
  private manejarError(error: any): void {
    console.error('Error:', error);

    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        this.error.set('Este correo ya está registrado');
        break;
      case 'auth/invalid-email':
        this.error.set('Correo electrónico inválido');
        break;
      case 'auth/user-not-found':
        this.error.set('Usuario no encontrado');
        break;
      case 'auth/wrong-password':
        this.error.set('Contraseña incorrecta');
        break;
      case 'auth/weak-password':
        this.error.set('La contraseña es muy débil');
        break;
      case 'auth/invalid-credential':
        this.error.set('Credenciales inválidas');
        break;
      default:
        this.error.set('Ocurrió un error. Por favor intenta de nuevo');
    }
  }

  // Toggle mostrar/ocultar password
  toggleMostrarPassword(): void {
    this.mostrarPassword.set(!this.mostrarPassword());
  }

  // Getter para estado de carga
  get cargando(): boolean {
    return this.authService.cargando();
  }
}
