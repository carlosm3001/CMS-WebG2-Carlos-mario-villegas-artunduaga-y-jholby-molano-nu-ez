import { Injectable, signal, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs
} from '@angular/fire/firestore';
import { Usuario } from '../models/Usuario.model';
import { TipoRole } from '../enum/TipoRole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal para usuario actual
  usuarioActual = signal<Usuario | null>(null);

  // Signal para estado de carga
  cargando = signal<boolean>(false);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private ngZone: NgZone
  ) {
    // Escuchar cambios de autenticación
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      // Ejecutar dentro de la zona de Angular
      this.ngZone.run(async () => {
        if (firebaseUser) {
          await this.cargarDatosUsuario(firebaseUser.uid);
        } else {
          this.usuarioActual.set(null);
        }
      });
    });
  }

  // Registrar nuevo usuario
  async registrar(datos: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    numero: string;
  }): Promise<void> {
    this.cargando.set(true);
    try {
      // Crear usuario en Firebase Auth
      const credencial = await createUserWithEmailAndPassword(
        this.auth,
        datos.email,
        datos.password
      );

      // Crear documento de usuario en Firestore
      const usuario: Usuario = {
        uid: credencial.user.uid,
        email: datos.email,
        nombre: datos.nombre,
        apellido: datos.apellido,
        numero: datos.numero,
        rol: TipoRole.VISITANTE // Rol por defecto
      };

      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), usuario);
      this.usuarioActual.set(usuario);
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Iniciar sesión
  async login(email: string, password: string): Promise<void> {
    this.cargando.set(true);
    try {
      const credencial = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await this.cargarDatosUsuario(credencial.user.uid);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      this.cargando.set(false);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.usuarioActual.set(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Cargar datos del usuario desde Firestore
  private async cargarDatosUsuario(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.usuarioActual.set(docSnap.data() as Usuario);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  // Obtener usuario actual
  get usuario(): Usuario | null {
    return this.usuarioActual();
  }

  // Obtener todos los usuarios
  async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'usuarios'));
      const usuarios: Usuario[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usuarios.push({
          uid: doc.id,
          email: data['email'],
          nombre: data['nombre'],
          apellido: data['apellido'],
          numero: data['numero'],
          rol: data['rol']
        });
      });

      return usuarios;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  // Verificar si está autenticado
  get estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }
}
