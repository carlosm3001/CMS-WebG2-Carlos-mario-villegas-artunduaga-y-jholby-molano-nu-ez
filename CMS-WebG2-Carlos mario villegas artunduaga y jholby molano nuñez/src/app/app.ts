import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponen} from './components/footer-componen/footer-componen';
import {NavbarComponen} from './components/navbar-componen/navbar-componen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponen, NavbarComponen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CMS-WebG2-MosqueraQuigua-SergioDanilo');
}
