import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { TipoRole } from '../enum/TipoRole';

export const cmsGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 Guard CMS ejecutado, esperando carga del usuario...');

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

  // Verificar rol - Solo REPORTERO y EDITOR pueden acceder al CMS
  const rolesPermitidos = [TipoRole.REPORTERO, TipoRole.EDITOR];

  if (!rolesPermitidos.includes(usuario.rol)) {
    console.log('⛔ Usuario sin permisos para CMS. Rol actual:', usuario.rol);
    return router.createUrlTree(['/']);
  }

  console.log('🎉 Acceso permitido al CMS para:', usuario.nombre, '|', usuario.rol);
  return true;
};
