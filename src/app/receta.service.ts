import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

export interface CrearReceta {
  imagen: string;
  info: string;
  nombre: string;
  tipo: string;
  ingredientes: string[];
  tiempoCoccion: number;
  tutorial: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {

  constructor() { }

  // Método para crear una receta (simulado aquí)
  async create(receta: CrearReceta) {
    try {
      console.log('Receta creada:', receta); // Simulando la creación de la receta

      // Aquí agregarías la lógica para guardar la receta en una base de datos o backend
      toast.success('Receta guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar receta');
    }
  }
}
