import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Receta {
  Imagen: string;
  Info: string;
  Nombre: string;
  Tipo: string;
  ingredientes: string[];
  tiempoCoccion: number;
  tutorial: string;
  isHovered?: boolean;
}

@Component({
  selector: 'app-recetas',
  standalone: true,
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
  host: { 'ngSkipHydration': '' },
  imports: [CommonModule]
})
export class RecetasComponent implements OnInit {
  recetas: Receta[] = [];  // Declarar el arreglo de recetas
  filteredRecetas: Receta[] = [];  // Para almacenar las recetas filtradas
  private firestore = inject(Firestore);

  async ngOnInit() {
    const stockCollection = collection(this.firestore, 'recetas');
    const q = query(stockCollection);

    try {
      const querySnapshot = await getDocs(q);
      const recetas: Receta[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data() as Receta;
        recetas.push({ ...data });
      });
      this.recetas = recetas;
      this.filteredRecetas = recetas;  // Inicializa las recetas filtradas
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Función para manejar la búsqueda
  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredRecetas = this.recetas.filter(receta =>
      receta.Nombre.toLowerCase().includes(searchTerm)  // Filtrar por Nombre
    );
  }
}
