import { inject, Injectable,   } from '@angular/core';

import {Firestore,collection,addDoc } from '@angular/fire/firestore';
const PATH = 'stocks';

export interface Stock {
  id: string,
  nombre: string;
  cantidad: number;
  tipo: string;
  macro: string;

}
export type CrearStock = Omit<Stock, 'id'>;
@Injectable({
  providedIn: 'root'
})
export class StockService {
    private _firestore = inject(Firestore);
    private _collection = collection(this._firestore, PATH);
  create(stock: CrearStock ){
    console.log(stock)
    return addDoc(this._collection, stock)
  }

 
}
