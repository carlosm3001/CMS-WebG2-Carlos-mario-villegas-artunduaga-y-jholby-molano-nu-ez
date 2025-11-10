import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { TipoRole } from '../enum/TipoRole';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 Guard Admin ejecutado, esperando carga del usuario...');

  // Esperar a que se cargue el usuario (máximo 3 segundos)
  let intentos = 0;
  const maxIntentos = 30; // 30 intentos x 100ms = 3 segundos máximo

  while (!authService.usuarioActual() && intentos < maxIntentos) {
    await new Promise(resolve => setTimeout(resolve, 100));
    intentos++;
  }

  const usuario = authService.usuarioActual();

  // Si no hay usuario después de esperar, redirigir a login
  if (!usuario) {
    console.log('❌ Usuario no autenticado después de esperar', intentos * 100, 'ms');
    return router.createUrlTree(['/login']);
  }

  console.log('✅ Usuario cargado:', usuario.nombre, usuario.apellido, '| Rol:', usuario.rol);

  // Verificar rol - Solo EDITORES pueden acceder al panel de administración
  if (usuario.rol !== TipoRole.EDITOR) {
    console.log('⛔ Usuario sin permisos para Admin. Rol actual:', usuario.rol);
    return router.createUrlTree(['/']);
  }

  console.log('🎉 Acceso permitido al panel de administración para:', usuario.nombre, '|', usuario.rol);
  return true;
};
