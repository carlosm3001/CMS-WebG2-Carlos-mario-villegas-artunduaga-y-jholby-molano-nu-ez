import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { TipoRole } from '../../enum/TipoRole';

@Component({
  selector: 'app-navbar-componen',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-componen.html',
  styleUrl: './navbar-componen.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponen {
  authService = inject(AuthService);

  // Computed para determinar permisos
  esEditor = computed(() => {
    const usuario = this.authService.usuarioActual();
    return usuario?.rol === TipoRole.EDITOR;
  });

  esReportero = computed(() => {
    const usuario = this.authService.usuarioActual();
    return usuario?.rol === TipoRole.REPORTERO;
  });

  esVisitante = computed(() => {
    const usuario = this.authService.usuarioActual();
    return usuario?.rol === TipoRole.VISITANTE;
  });

  tieneAccesoCMS = computed(() => {
    return this.esEditor() || this.esReportero();
  });

  tieneAccesoAdmin = computed(() => {
    return this.esEditor();
  });
}
