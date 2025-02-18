import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from '@angular/fire/firestore';

const PATH = 'stocks';

export interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  categoria: string;
  minimo: number;
}

export type CrearStock = Omit<Stock, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);

  // Función para verificar si el stock existe (sin cambios)
  checkIfStockExists(nombre: string): Promise<boolean> {
    const stockQuery = query(this._collection, where('nombre', '==', nombre));
    return getDocs(stockQuery).then((snapshot) => !snapshot.empty);
  }

  // Función para crear un nuevo stock (sin cambios)
  create(stock: CrearStock): Promise<void> {
    return addDoc(this._collection, stock).then(() => {});
  }

  // Nueva función para obtener un stock por nombre
  async getStockByName(nombre: string): Promise<Stock | null> {
    const q = query(this._collection, where('nombre', '==', nombre));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Stock; // Aseguramos el tipo Stock
    } else {
      return null;
    }
  }

  // Nueva función para actualizar un stock existente
  async update(stock: Stock): Promise<void> {
    const stockDocRef = doc(this._firestore, PATH, stock.id); // Obtén la referencia al documento
    await updateDoc(stockDocRef, { ...stock }); // Actualiza el documento con el objeto stock completo
  }
}