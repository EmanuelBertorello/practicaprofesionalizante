import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore'; // Asegúrate de que Firestore esté importado
import { CrearReceta } from './receta.service';

@Injectable({
  providedIn: 'root'
})
export type DataService = Omit<receta, 'id'>;
@Injectable({
  providedIn: 'root'
})
export class DataService {
    private _firestore = inject(Firestore);
    private _collection = collection(this._firestore, PATH);
  create(stock: CrearReceta ){
    console.log(stock)
    return addDoc(this._collection, receta)
  }

 
}
