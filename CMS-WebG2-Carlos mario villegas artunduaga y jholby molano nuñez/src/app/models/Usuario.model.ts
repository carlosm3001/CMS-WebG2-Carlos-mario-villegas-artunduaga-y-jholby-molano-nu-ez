import { TipoRole } from '../enum/TipoRole';

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  numero: string;
  rol: TipoRole;
}
