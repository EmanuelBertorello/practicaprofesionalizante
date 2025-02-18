import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { getDoc } from '@angular/fire/firestore';

export interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  categoria: string;
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
  firestore: Firestore;

  stocks: Stock[] = [];
  selectedStock: any = {};
  showConfirmModal: boolean = false;
  showEditModal: boolean = false;
  showBajaModal: boolean = false;
  showDeleteModal: boolean = false;  // Agregamos esta propiedad para el modal de eliminación
  cantidadBaja: number = 1;
  searchQuery: string = '';
  selectedTipo: string = '';
  selectedMacro: string = '';
  selectedEstado: string = '';
  cantidadDecrementar: number = 0;

  macrosDisponibles: string[] = [];
  filteredStocks: Stock[] = [];
  estadosDisponibles: string[] = ['Activo', 'Inactivo'];
  tiposDisponibles: string[] = ['Kilogramo', 'Paquete', 'Unidad/es'];

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async ngOnInit() {
    await this.refreshStockList();
    this.filteredStocks = [...this.stocks];  // Inicializamos el filtro
  }

  // Función para verificar si el nombre está duplicado
  isNombreDuplicado(): boolean {
    return this.stocks.some(stock => stock.nombre === this.selectedStock.nombre);
  }

  checkNombreExistente() {
    if (this.isNombreDuplicado()) {
      toast.error('El nombre del stock ya existe.');
    }
  }

  // Función para abrir el modal de baja
  bajarCantidad(stock: Stock) {
    this.selectedStock = stock;
    this.showBajaModal = true;
    this.cantidadBaja = 1;
  }

  // Función para cerrar el modal de baja
  cerrarModalBaja() {
    this.showBajaModal = false;
    this.selectedStock = null;
  }

  // Función para confirmar la baja
  async confirmarBaja() {
    if (this.cantidadBaja > 0 && this.selectedStock) {
      const nuevaCantidad = this.selectedStock.cantidad - this.cantidadBaja;

      if (nuevaCantidad < 0) {
        toast.error('No puedes bajar más de lo que hay en stock');
        return;
      }

      await this.actualizarStockCantidad(this.selectedStock.id, nuevaCantidad);
      this.showBajaModal = false;
    } else {
      toast.error('Cantidad no válida');
    }
  }

  async actualizarStockCantidad(stockId: string, nuevaCantidad: number) {
    const stockRef = doc(this.firestore, 'stocks', stockId);
    try {
      await updateDoc(stockRef, { cantidad: nuevaCantidad });
      toast.success(`Cantidad actualizada. Nuevo stock de ${this.selectedStock.nombre}: ${nuevaCantidad}`);
      await this.refreshStockList();
    } catch (error) {
      toast.error('Error al actualizar la cantidad del stock');
    }
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

      this.stocks = stocks;  // Aquí asignamos el arreglo directamente
      this.filteredStocks = stocks;

      this.tiposDisponibles = [...new Set(stocks.map(stock => stock.tipo))];
      this.macrosDisponibles = [...new Set(stocks.map(stock => stock.categoria))];
    } catch (error) {
      toast.error('Error fetching data: ');
    }
  }

  resetFiltros() {
    this.selectedTipo = '';
    this.selectedMacro = '';
    this.selectedEstado = '';
    this.filtrarStocks();
  }

  filtrarStocks() {
    this.filteredStocks = this.stocks.filter(stock => {
      const coincideBusqueda = this.searchQuery
        ? stock.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const coincideTipo = this.selectedTipo ? stock.tipo === this.selectedTipo : true;
      const coincideMacro = this.selectedMacro ? stock.categoria === this.selectedMacro : true;
      const coincideEstado = this.selectedEstado ? this.getEstado(stock) === this.selectedEstado : true;
      return coincideBusqueda && coincideTipo && coincideMacro && coincideEstado;
    });
  }

  onSearchChange() {
    this.filtrarStocks();
  }

  modificarStock(stock: Stock) {
    this.cerrarModalConfirmacion();
    this.selectedStock = { ...stock };
    this.showEditModal = true;
  }

  mostrarModalConfirmacion(stock: Stock) {
    this.cerrarModal();  // Esto cierra cualquier modal abierto anteriormente
    this.selectedStock = stock;  // Asignamos el producto seleccionado
    this.showDeleteModal = true;  // Mostramos el modal de confirmación de eliminación
  }

  cerrarModal() {
    this.selectedStock = null;
    this.showEditModal = false;
  }

  cerrarModalConfirmacion() {
    this.selectedStock = null;
    this.showDeleteModal = false;  // Cerramos el modal de eliminación
  }

  async bajaStock(stockId: string | undefined) {
    const id = stockId ?? '';
    const stockRef = doc(this.firestore, 'stocks', id);

    try {
      await deleteDoc(stockRef);  // Eliminamos el producto en Firestore
      toast.error(`Stock  eliminado`);
      await this.refreshStockList();  // Recargamos la lista de productos
      this.cerrarModalConfirmacion();  // Cerramos el modal
    } catch (error) {
      toast.error('Error eliminando el stock: ');  // Si ocurre un error
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
        if (this.selectedStock.categoria) cambios.categoria = this.selectedStock.categoria;
        if (this.selectedStock.minimo !== undefined) cambios.minimo = this.selectedStock.minimo;

        if (Object.keys(cambios).length > 0) {
          await updateDoc(stockRef, cambios);
          toast.success(`Stock :${this.selectedStock.nombre} actualizado`);
          this.cerrarModal();
          await this.refreshStockList();
        }
      } catch (error) {
        toast.error('Error al actualizar el stock: ');
      }
    }
  }

  // Métodos para mostrar y cerrar el modal de eliminación
  confirmarEliminacion() {
    this.bajaStock(this.selectedStock?.id);
    this.cerrarModalConfirmacion();
  }

  cerrarModalEliminacion() {
    this.cerrarModalConfirmacion();
  }
}
