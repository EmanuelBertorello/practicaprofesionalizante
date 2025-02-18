import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { getDoc } from '@angular/fire/firestore'; // Asegúrate de importar getDoc correctamente

export interface Stock {
  id: string;
  nombre: string;
  cantidad: number;
  tipo: string;
  categoria: string;
  minimo: number; // Añadir el campo minimo
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
  selectedStock: any = {};
  showConfirmModal: boolean = false;
  showEditModal: boolean = false;
  showBajaModal: boolean = false; // Variable para controlar la visibilidad del modal de baja
  cantidadBaja: number = 1; // Variable para la cantidad a reducir
  searchQuery: string = '';
  selectedTipo: string = '';
  selectedMacro: string = '';
  selectedEstado: string = '';
  cantidadDecrementar: number = 0;  // Agregar esta propiedad

  macrosDisponibles: string[] = [];
  filteredStocks: Stock[] = [];
  estadosDisponibles: string[] = ['Activo', 'Inactivo'];
  tiposDisponibles: string[] = ['Kilogramo', 'Paquete', 'Unidad/es'];

  async ngOnInit() {
    await this.refreshStockList();

    this.stocks$?.subscribe(stocks => {
      this.filteredStocks = stocks;
    });
  }

  // Función para abrir el modal de baja
  bajarCantidad(stock: Stock) {
    this.selectedStock = stock;
    this.showBajaModal = true; // Abrir el modal
    this.cantidadBaja = 1; // Restablecer el valor de la cantidad a bajar por si ya había algo ingresado
  }

  // Función para cerrar el modal de baja
  cerrarModalBaja() {
    this.showBajaModal = false; // Cerrar el modal
    this.selectedStock = null; // Limpiar la selección
  }

  // Función para confirmar la baja
  async confirmarBaja() {
    if (this.cantidadBaja > 0 && this.selectedStock) {
      // Reducir la cantidad en la base de datos
      const nuevaCantidad = this.selectedStock.cantidad - this.cantidadBaja;

      if (nuevaCantidad < 0) {
        toast.error('No puedes bajar más de lo que hay en stock');
        return;
      }

      // Actualizar la cantidad en la base de datos
      await this.actualizarStockCantidad(this.selectedStock.id, nuevaCantidad);
      this.showBajaModal = false; // Cerrar el modal
    } else {
      toast.error('Cantidad no válida');
    }
  }

  // Función para actualizar la cantidad en la base de datos
  async actualizarStockCantidad(stockId: string, nuevaCantidad: number) {
    const stockRef = doc(this.firestore, 'stocks', stockId);
    try {
      await updateDoc(stockRef, { cantidad: nuevaCantidad });
      toast.success(`Cantidad actualizada. Nuevo stock de ${this.selectedStock.nombre}: ${nuevaCantidad}`);
      await this.refreshStockList(); // Refrescar la lista después de la actualización
    } catch (error) {
      toast.error('Error al actualizar la cantidad del stock');
    }
  }

  async bajaCantidadStock(stockId: string | undefined) {
    if (this.cantidadDecrementar <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    const id = stockId ?? '';
    const stockRef = doc(this.firestore, 'stocks', id);

    try {
      const stockData = await getDoc(stockRef);
      const stock = stockData.data() as Stock;
      if (stock && stock.cantidad >= this.cantidadDecrementar) {
        // Disminuir la cantidad del stock
        const nuevaCantidad = stock.cantidad - this.cantidadDecrementar;
        await updateDoc(stockRef, { cantidad: nuevaCantidad });

        toast.success(`Cantidad de ${stock.nombre} disminuida en ${this.cantidadDecrementar}`);
        this.cantidadDecrementar = 0; // resetear la cantidad a bajar
        await this.refreshStockList();
      } else {
        toast.error('Cantidad insuficiente para dar de baja');
      }
    } catch (error) {
      toast.error('Error al disminuir la cantidad del stock');
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
      this.stocks$ = of(stocks);
      this.filteredStocks = stocks;

      this.tiposDisponibles = [...new Set(stocks.map(stock => stock.tipo))];
      this.macrosDisponibles = [...new Set(stocks.map(stock => stock.categoria))];
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
        const coincideMacro = this.selectedMacro ? stock.categoria === this.selectedMacro : true;
        const coincideEstado = this.selectedEstado ? this.getEstado(stock) === this.selectedEstado : true;
        return coincideBusqueda && coincideTipo && coincideMacro && coincideEstado;
      });
    });
  }

  onSearchChange() {
    this.filtrarStocks();
  }

  modificarStock(stock: Stock) {
    this.cerrarModalConfirmacion(); // Asegurar que el modal de confirmación esté cerrado
    this.selectedStock = { ...stock };
    this.showEditModal = true;
  }

  mostrarModalConfirmacion(stock: Stock) {
    this.cerrarModal(); // Asegurar que el modal de edición esté cerrado
    this.selectedStock = stock;
    this.showConfirmModal = true;
  }

  cerrarModal() {
    this.selectedStock = null;
    this.showEditModal = false;
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
      toast.error('Error eliminando el stock:');
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
        if (this.selectedStock.categoria) cambios.categoria = this.selectedStock.categoria; // Asegúrate de incluir la categoría
        if (this.selectedStock.minimo !== undefined) cambios.minimo = this.selectedStock.minimo; // Asegúrate de incluir el campo mínimo

        if (Object.keys(cambios).length > 0) {
          await updateDoc(stockRef, cambios);
          toast.success(`Stock :${this.selectedStock.nombre} actualizado`);
          this.cerrarModal();
          await this.refreshStockList();
        }
      } catch (error) {
        toast.error('Error al actualizar el stock:');
      }
    }
  }
}
