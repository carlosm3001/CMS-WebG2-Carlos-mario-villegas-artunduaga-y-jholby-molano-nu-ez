import { Usuario } from '../models/Usuario.model';
import { TipoRole } from '../enum/TipoRole';

export const USUARIOS: Usuario[] = [
  {
    uid: 'usr-001',
    email: 'maria.silva@noticiasamazonicas.com',
    nombre: 'María',
    apellido: 'Silva',
    numero: '+57 320 123 4567',
    rol: TipoRole.EDITOR
  },
  {
    uid: 'usr-002',
    email: 'carlos.ramirez@noticiasamazonicas.com',
    nombre: 'Carlos',
    apellido: 'Ramírez',
    numero: '+57 315 234 5678',
    rol: TipoRole.REPORTERO
  },
  {
    uid: 'usr-003',
    email: 'ana.torres@noticiasamazonicas.com',
    nombre: 'Ana',
    apellido: 'Torres',
    numero: '+57 310 345 6789',
    rol: TipoRole.REPORTERO
  },
  {
    uid: 'usr-004',
    email: 'juan.mendoza@noticiasamazonicas.com',
    nombre: 'Juan',
    apellido: 'Mendoza',
    numero: '+57 318 456 7890',
    rol: TipoRole.REPORTERO
  },
  {
    uid: 'usr-005',
    email: 'lucia.vasquez@noticiasamazonicas.com',
    nombre: 'Lucía',
    apellido: 'Vásquez',
    numero: '+57 312 567 8901',
    rol: TipoRole.EDITOR
  }
];
