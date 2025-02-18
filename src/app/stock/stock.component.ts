import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
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
  selectedStock: Stock | null = null;
  showConfirmModal: boolean = false;
  showEditModal: boolean = false; // Añadido para manejar el modal de edición
  searchQuery: string = '';
  selectedTipo: string = '';
  selectedMacro: string = '';
  selectedEstado: string = '';
 
  macrosDisponibles: string[] = [];
  filteredStocks: Stock[] = [];
  estadosDisponibles: string[] = ['Activo', 'Inactivo']; // Ejemplo

  tiposDisponibles: string[] = ['Kilogramo', 'Paquete', 'Unidad/es']; // Añadido

  async ngOnInit() {
    await this.refreshStockList();

    this.stocks$?.subscribe(stocks => {
      this.filteredStocks = stocks;
    });
  }

  async refreshStockList() {
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
      this.filteredStocks = stocks;

      this.tiposDisponibles = [...new Set(stocks.map(stock => stock.tipo))];
      this.macrosDisponibles = [...new Set(stocks.map(stock => stock.macro))];
    } catch (error) {
      toast.error('Error fetching data:');
    }
  }

  resetFiltros() {
    this.selectedTipo = '';
    this.selectedMacro = '';
    this.selectedEstado = '';
    this.filtrarStocks();
  }

  filtrarStocks() {
    this.stocks$?.subscribe(stocks => {
      this.filteredStocks = stocks.filter(stock => {
        const coincideBusqueda = this.searchQuery
          ? stock.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        const coincideTipo = this.selectedTipo ? stock.tipo === this.selectedTipo : true;
        const coincideMacro = this.selectedMacro ? stock.macro === this.selectedMacro : true;
        const coincideEstado = this.selectedEstado ? this.getEstado(stock) === this.selectedEstado : true;
        return coincideBusqueda && coincideTipo && coincideMacro && coincideEstado;
      });
    });
  }

  onSearchChange() {
    this.filtrarStocks();
  }

  modificarStock(stock: Stock) {
    // Solo se abre el modal de edición si el modal de confirmación no está abierto
    if (!this.showConfirmModal) {
      this.selectedStock = { ...stock };
      this.showEditModal = true; // Abrir el modal de edición
    }
  }

  cerrarModal() {
    this.selectedStock = null;
    this.showEditModal = false;
  }

  mostrarModalConfirmacion(stock: Stock) {
    // Solo se abre el modal de confirmación si el modal de edición no está abierto
    if (!this.showEditModal) {
      this.selectedStock = stock;
      this.showConfirmModal = true;
    }
  }

  cerrarModalConfirmacion() {
    this.selectedStock = null;
    this.showConfirmModal = false;
  }

  async bajaStock(stockId: string | undefined) {
    const id = stockId ?? '';
    const stockRef = doc(this.firestore, 'stocks', id);

    try {
      await deleteDoc(stockRef);
      toast.error(`Stock: ${this.selectedStock?.nombre} eliminado`);
      await this.refreshStockList();
      this.cerrarModalConfirmacion();
    } catch (error) {
      toast.error('Error eliminando el stock:' );
    }
  }

  getEstado(stock: Stock): string {
    if (stock.cantidad > stock.minimo) {
      return 'ok';
    } else if (stock.cantidad === stock.minimo) {
      return 'minimo';
    } else {
      return 'faltante';
    }
  }

  async guardarCambios() {
    if (this.selectedStock) {
      const stockRef = doc(this.firestore, 'stocks', this.selectedStock.id);

      try {
        const cambios: Partial<Stock> = {};
        if (this.selectedStock.nombre) cambios.nombre = this.selectedStock.nombre;
        if (this.selectedStock.cantidad) cambios.cantidad = this.selectedStock.cantidad;
        if (this.selectedStock.tipo) cambios.tipo = this.selectedStock.tipo;

        if (Object.keys(cambios).length > 0) {
          await updateDoc(stockRef, cambios);
          toast.error(`Stock :${this.selectedStock.nombre} actualizado`);
          this.cerrarModal();
          await this.refreshStockList();
        }
      } catch (error) {
        toast.error('Error al actualizar el stock:' );
      }
    }
  }
}
