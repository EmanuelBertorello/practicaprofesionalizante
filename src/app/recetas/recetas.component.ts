import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

interface Receta {
  Imagen: string;
  Info: string;
  Nombre: string;
  Tipo: string;
  ingredientes: string[];
  TiempoCoccion: number;
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
  recetas: Receta[] = [];
  filteredRecetas: Receta[] = [];
  
  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const recetasCollection = collection(this.firestore, 'recetas');

    try {
      const querySnapshot = await getDocs(recetasCollection);
      this.recetas = querySnapshot.docs.map(doc => doc.data() as Receta);
      this.filteredRecetas = [...this.recetas]; // Mantiene una copia inicial
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    }
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
  
    this.filteredRecetas = this.recetas.filter(receta =>
      receta.Nombre ? receta.Nombre.toLowerCase().includes(searchTerm) : false
    );
  }
  
}
