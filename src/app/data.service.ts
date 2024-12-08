import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore'; // Asegúrate de que Firestore esté importado

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private firestore: Firestore) {}

  // Método para acceder al servicio Firestore
  getFirestore(): Firestore {
    return this.firestore;
  }
}
