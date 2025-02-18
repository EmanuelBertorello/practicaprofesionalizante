import { Component, OnInit } from '@angular/core';
import { RecetaService, Receta } from '../receta.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-listado-recetas',
  templateUrl: './listado-recetas.component.html',
  styleUrls: ['./listado-recetas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIf]
})
export class ListadoRecetasComponent implements OnInit {
  searchQuery = '';
  filteredRecetas: Receta[] = [];
  recetas: Receta[] = [];
  showEditModal: boolean = false;
  selectedReceta: Receta = {} as Receta;
  showDeleteConfirmation: boolean = false;

  constructor(private recetaService: RecetaService, private router: Router) {}

  ngOnInit() {
    this.cargarRecetas();
    if (window.innerWidth < 768) {
      toast.error("se recomienda entrar desde un PC")
    }
   
  }

  cargarRecetas() {
    this.recetaService.getRecipes().then((recetas: Receta[]) => {
      this.recetas = recetas;
      this.filteredRecetas = recetas;
    }).catch((error: Error) => {
      console.error('Error al cargar las recetas:', error);
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredRecetas = this.recetas;
    } else {
      this.filteredRecetas = this.recetas.filter((receta) =>
        receta.Nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  openEditModal(receta: Receta) {
    this.selectedReceta = { ...receta };
    this.showEditModal = true;
  }

  updateReceta() {
    this.recetaService.updateReceta(this.selectedReceta).then(() => {
      this.cargarRecetas();
      this.showEditModal = false;
    }).catch((error: Error) => {
      console.error('Error al actualizar la receta:', error);
    });
  }

  openDeleteConfirmation(receta: Receta) {
    this.selectedReceta = receta;
    this.showDeleteConfirmation = true;
  }
   
  deleteReceta() {
    this.recetaService.deleteReceta(this.selectedReceta.id).then(() => {
      this.cargarRecetas();
      this.showDeleteConfirmation = false;
    }).catch((error: Error) => {
      console.error('Error al eliminar la receta:', error);
    });
  }

  closeModal() {
    this.showEditModal = false;
  }

  goBack() {
    this.router.navigate(['stock']);
  }
}