import { EstadoPublicacion } from '../enum/EstadoPublicacion';

export interface Noticia {
  id: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  categoriaId: string;
  imagen: string[];
  autorUid: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  estado: EstadoPublicacion;
}
