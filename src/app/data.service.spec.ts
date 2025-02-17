import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Stock } from '../app/stock/stock.component'; // Importar la interfaz

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: Firestore) {}

  getItems(): Observable<Stock[]> {
    const stockCollection = collection(this.firestore, 'stocks'); // Asegúrate de usar el nombre correcto de la colección
    return collectionData(stockCollection, { idField: 'id' }) as Observable<Stock[]>;
  }
}
