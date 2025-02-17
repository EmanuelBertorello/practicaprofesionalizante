import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Stock {
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
  searchQuery: string = ''; // Variable para almacenar el texto de búsqueda
  filteredStocks: Stock[] = []; // Para almacenar los stocks filtrados

  async ngOnInit() {
    await this.refreshStockList();  // Cargar los datos iniciales

    // Nos suscribimos al observable y actualizamos filteredStocks
    this.stocks$?.subscribe(stocks => {
      this.filteredStocks = stocks; // Inicialmente mostrar todos los stocks
    });
  }

  modificarStock(stock: Stock) {
    this.selectedStock = { ...stock }; 
  }
  
  cerrarModal() {
    this.selectedStock = null;
  }

  // Mostrar el modal de confirmación de eliminación
  mostrarModalConfirmacion(stock: Stock) {
    this.selectedStock = null;  // Cierra el modal de modificación
    this.showConfirmModal = true;  // Abre el modal de confirmación
    this.selectedStock = stock;  // Muestra el stock seleccionado
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
      await this.refreshStockList();
      this.cerrarModalConfirmacion(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error('Error eliminando el stock:', error);
    }
  }

  // Método para calcular el estado
  getEstado(stock: Stock): string {
    if (stock.cantidad > stock.minimo) {
      return 'ok';
    } else if (stock.cantidad === stock.minimo) {
      return 'minimo';
    } else {
      return 'faltante';
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
          await this.refreshStockList(); // Recargar la lista de stocks
        }
      } catch (error) {
        console.error('Error al actualizar el stock:', error);
      }
    }
  }

  // Recarga la lista de stocks desde Firestore
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
      this.filteredStocks = stocks; // Inicialmente, mostramos todos los stocks
    } catch (error) {
      console.error('Error fetching data after delete:', error);
    }
  }

  // Método que se llama cuando cambia el valor del buscador
  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.stocks$?.subscribe(stocks => {
        this.filteredStocks = stocks; // Si el buscador está vacío, mostramos todos los stocks
      });
    } else {
      // Filtrar los stocks según la búsqueda
      this.filteredStocks = this.filteredStocks.filter(stock => 
        stock.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
