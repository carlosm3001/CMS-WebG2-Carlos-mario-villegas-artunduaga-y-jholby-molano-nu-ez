import { Injectable, signal, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { TipoRole } from '../enum/TipoRole';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  cargando = signal<boolean>(false);
  progreso = signal<number>(0);

  private authService = inject(AuthService);

  constructor(private storage: Storage) {}

  // Subir múltiples imágenes
  async subirImagenes(archivos: FileList, carpeta: string = 'noticias'): Promise<string[]> {
    // Validar que el usuario esté autenticado y tenga rol válido
    const usuario = this.authService.usuarioActual();
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }

    if (usuario.rol !== TipoRole.REPORTERO && usuario.rol !== TipoRole.EDITOR) {
      throw new Error('No tienes permisos para subir imágenes');
    }

    this.cargando.set(true);
    this.progreso.set(0);

    const urls: string[] = [];
    const totalArchivos = archivos.length;

    for (let i = 0; i < totalArchivos; i++) {
      const archivo = archivos[i];

      // Validar archivo
      if (!this.validarArchivo(archivo)) {
        throw new Error(`Archivo ${archivo.name} no es válido`);
      }

      // Generar nombre único
      const nombreUnico = `${Date.now()}_${Math.random().toString(36).substring(2)}_${archivo.name}`;
      const ruta = `${carpeta}/${nombreUnico}`;

      try {
        // Subir archivo
        const storageRef = ref(this.storage, ruta);
        await uploadBytes(storageRef, archivo);

        // Obtener URL de descarga
        const url = await getDownloadURL(storageRef);
        urls.push(url);

        // Actualizar progreso
        this.progreso.set(((i + 1) / totalArchivos) * 100);
      } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
      }
    }

    this.cargando.set(false);
    return urls;
  }

  // Validar archivo de imagen
  private validarArchivo(archivo: File): boolean {
    // Tipos MIME permitidos
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Tamaño máximo (5MB)
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB en bytes

    return tiposPermitidos.includes(archivo.type) && archivo.size <= tamanoMaximo;
  }

  // Eliminar imagen (opcional, para futuras ediciones)
  async eliminarImagen(url: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      // No lanzar error si ya no existe
    }
  }
}
