import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  macro: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class StockComponent implements OnInit {
  stocks$: Observable<Stock[]> | undefined;
  private firestore = inject(Firestore);

  async ngOnInit() {
    const stockCollection = collection(this.firestore, 'stocks');
    const q = query(stockCollection);

    try {
      const querySnapshot = await getDocs(q);
      const stocks: Stock[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as Stock;
        stocks.push({ ...data, id: doc.id }); // Asegúrate de agregar el ID del documento
      });
      this.stocks$ = of(stocks); // Convertir la lista a un Observable
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Función para dar de baja un stock
  async bajaStock(stockId: string): Promise<void> {
    const stockRef = doc(this.firestore, 'stocks', stockId);

    try {
      await deleteDoc(stockRef); // Eliminar el stock
      console.log(`Stock con ID ${stockId} eliminado`);

      // Actualizar la lista de stocks después de la eliminación
      this.refreshStockList();
    } catch (error) {
      console.error('Error eliminando el stock:', error);
    }
  }

  // Función para actualizar la lista de stocks después de una eliminación
  private async refreshStockList() {
    const stockCollection = collection(this.firestore, 'stocks');
    const q = query(stockCollection);

    try {
      const querySnapshot = await getDocs(q);
      const stocks: Stock[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as Stock;
        stocks.push({ ...data, id: doc.id });
      });
      this.stocks$ = of(stocks);
    } catch (error) {
      console.error('Error fetching data after delete:', error);
    }
  }
}
