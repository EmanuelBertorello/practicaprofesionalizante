import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  macro: string;
  minimo: number;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class StockComponent implements OnInit {
  stocks$: Observable<Stock[]> | undefined;
  private firestore = inject(Firestore);
  selectedStock: Stock | null = null; // Variable para el modal
  showConfirmModal: boolean = false; // Controla la visibilidad del modal de confirmación

  async ngOnInit() {
    this.refreshStockList();
  }

  modificarStock(stock: Stock) {
    this.selectedStock = { ...stock }; 
  }
  
  cerrarModal() {
    this.selectedStock = null;
  }

  // Mostrar el modal de confirmación de eliminación
  mostrarModalConfirmacion(stock: Stock) {
    this.selectedStock = stock;
    this.showConfirmModal = true;
  }

  // Cerrar el modal de confirmación sin eliminar
  cerrarModalConfirmacion() {
    this.selectedStock = null;
    this.showConfirmModal = false;
  }

  // Eliminar el stock
  async bajaStock(stockId: string | undefined) {
    const id = stockId ?? ''; // Valor por defecto
    const stockRef = doc(this.firestore, 'stocks', id);
  
    try {
      await deleteDoc(stockRef);
      console.log(`Stock con ID ${id} eliminado`);
      this.refreshStockList();
      this.cerrarModalConfirmacion(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error('Error eliminando el stock:', error);
    }
  }
  // Método para calcular el estado
getEstado(stock: any): string {
  if (stock.cantidad > stock.minimo) {
    return 'OK';
  } else if (stock.cantidad === stock.minimo) {
    return 'Mínimo';
  } else {
    return 'Faltante';
  }
}


  // Guarda los cambios realizados en el stock
  async guardarCambios() {
    if (this.selectedStock) {
      const stockRef = doc(this.firestore, 'stocks', this.selectedStock.id);

      try {
        // Verifica si los campos realmente cambian antes de hacer la actualización
        const cambios: Partial<Stock> = {};
        if (this.selectedStock.nombre) cambios.nombre = this.selectedStock.nombre;
        if (this.selectedStock.cantidad) cambios.cantidad = this.selectedStock.cantidad;
        if (this.selectedStock.tipo) cambios.tipo = this.selectedStock.tipo;

        if (Object.keys(cambios).length > 0) {
          await updateDoc(stockRef, cambios);
          console.log(`Stock con ID ${this.selectedStock.id} actualizado`);
          this.cerrarModal();
          this.refreshStockList(); // Recargar la tabla
        }
      } catch (error) {
        console.error('Error al actualizar el stock:', error);
      }
    }
  }

  // Recarga la lista de stocks
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
