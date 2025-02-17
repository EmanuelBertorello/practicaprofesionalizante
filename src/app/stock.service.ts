import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';

const PATH = 'stocks';

export interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  macro: string;
  minimo: number;
}

export type CrearStock = Omit<Stock, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  // Función para verificar si el stock existe
  checkIfStockExists(nombre: string): Promise<boolean> {
    const stockQuery = query(this._collection, where('nombre', '==', nombre));
    return getDocs(stockQuery).then((snapshot) => !snapshot.empty); // Retorna true si hay un documento con ese nombre
  }

  // Función para crear un nuevo stock
  create(stock: CrearStock): Promise<void> {
    console.log(stock);
    return addDoc(this._collection, stock).then(() => {});
  }
}
