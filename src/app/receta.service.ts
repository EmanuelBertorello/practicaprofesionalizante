import { Injectable, inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';

const PATH = 'recetas';

export interface CrearReceta {
  Imagen: string;
  Info: string;
  Nombre: string;
  Tipo: string;
  ingredientes: string[];
  TiempoCoccion: number;
  Tutorial: string;
}

// Definimos la estructura de Receta como un tipo para poder mapearla correctamente desde Firestore
export interface Receta extends CrearReceta {
  id: string; // Agregamos un campo 'id' para poder identificar cada receta
}

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  // Crear receta
  async create(receta: CrearReceta): Promise<string> {
    // Verificar si ya existe una receta con el mismo nombre
    const q = query(this._collection, where('Nombre', '==', receta.Nombre));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si ya existe una receta con ese nombre, retornamos un mensaje
      return 'Ya existe una receta con ese nombre';
    }

    // Si no existe, guardamos la receta
    try {
      await addDoc(this._collection, receta);
      toast.success('Receta guardada con éxito');
      return ''; // Retornamos una cadena vacía para indicar éxito
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      toast.error('Error al guardar la receta');
      return 'Error al guardar la receta';
    }
  }

  // Obtener todas las recetas
  async getRecipes(): Promise<Receta[]> {
    try {
      const querySnapshot = await getDocs(this._collection);
      return querySnapshot.docs.map(doc => ({
        ...doc.data() as CrearReceta,
        id: doc.id
      }));
    } catch (error) {
      console.error('Error al obtener las recetas:', error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  }

  // Actualizar receta
  async updateReceta(receta: Receta): Promise<void> {
    try {
      const docRef = doc(this._firestore, `${PATH}/${receta.id}`);
      await updateDoc(docRef, { ...receta });
      toast.success('Receta actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      toast.error('Error al actualizar la receta');
      throw error; // Re-throw para que el componente pueda manejarlo
    }
  }

  // Eliminar receta
  async deleteReceta(id: string): Promise<void> {
    try {
      const docRef = doc(this._firestore, `${PATH}/${id}`);
      await deleteDoc(docRef);
      toast.success('Receta eliminada con éxito');
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
      toast.error('Error al eliminar la receta');
      throw error; // Re-throw para que el componente pueda manejarlo
    }
  }
}