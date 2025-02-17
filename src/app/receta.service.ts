import { Injectable, inject } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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

@Injectable({
  providedIn: 'root',
})
export class RecetaService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  create(receta: CrearReceta) {
    console.log('Guardando receta:', receta);
    return addDoc(this._collection, receta)
      .then(() => {
        toast.success('Receta guardada con éxito');
      })
      .catch((error) => {
        console.error('Error al guardar la receta:', error);
        toast.error('Error al guardar la receta');
      });
  }
}
