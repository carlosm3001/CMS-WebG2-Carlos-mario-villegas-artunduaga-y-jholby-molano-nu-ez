import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-navbar-componen',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar-componen.html',
  styleUrl: './navbar-componen.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponen {
  authService = inject(AuthService);
}
