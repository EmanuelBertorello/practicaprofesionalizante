import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { RecetaService, CrearReceta } from '../receta.service'; // Asegúrate de importar correctamente

@Component({
  selector: 'app-cargar-receta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cargar-receta.component.html',
  styleUrls: ['./cargar-receta.component.css']
})
export class CargarRecetaComponent {
  private _formBuilder = inject(FormBuilder);
  private recetaService = inject(RecetaService);

  form = this._formBuilder.group({
    imagen: this._formBuilder.control('', Validators.required),
    info: this._formBuilder.control('', Validators.required),
    nombre: this._formBuilder.control('', Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    ingredientes: this._formBuilder.control('', Validators.required),  // Ahora es un string
    tiempoCoccion: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
    tutorial: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if (this.form.valid) {
      try {
        const { imagen, info, nombre, tipo, ingredientes, tiempoCoccion, tutorial } = this.form.value;

        // Convertir el string de ingredientes en un array de 3 elementos
        let ingredientesArray = (ingredientes || '')
          .split(',')
          .map(ing => ing.trim()) // Eliminar espacios en blanco
          .filter(ing => ing.length > 0) // Eliminar elementos vacíos
          .slice(0, 3); // Tomar solo los primeros 3 elementos

        // Si hay menos de 3 elementos, rellenar con strings vacíos
        while (ingredientesArray.length < 3) {
          ingredientesArray.push('');
        }

        const receta: CrearReceta = {
          Imagen: imagen || '',
          Info: info || '',
          Nombre: nombre || '',
          Tipo: tipo || '',
          ingredientes: ingredientesArray, // Guardamos el array en lugar del string
          TiempoCoccion: tiempoCoccion ?? 0,
          Tutorial: tutorial || '',
        };

        await this.recetaService.create(receta);
        toast.success('Receta cargada correctamente');
      } catch {
        toast.error('Error al procesar el formulario');
      }
    } else {
      toast.error('Formulario inválido');
    }
  }
}
