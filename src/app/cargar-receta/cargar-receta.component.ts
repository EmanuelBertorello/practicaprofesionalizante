import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { RecetaService, CrearReceta } from '../receta.service';
import { Router } from '@angular/router'; // Importamos Router

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
  private router = inject(Router); // Inyectamos Router

  form = this._formBuilder.group({
    imagen: this._formBuilder.control('', Validators.required),
    info: this._formBuilder.control('', Validators.required),
    nombre: this._formBuilder.control('', Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    ingredientes: this._formBuilder.control('', Validators.required),
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
          .map(ing => ing.trim())
          .filter(ing => ing.length > 0)
          .slice(0, 3);

        while (ingredientesArray.length < 3) {
          ingredientesArray.push('');
        }

        const receta: CrearReceta = {
          Imagen: imagen || '',
          Info: info || '',
          Nombre: nombre || '',
          Tipo: tipo || '',
          ingredientes: ingredientesArray,
          TiempoCoccion: tiempoCoccion ?? 0,
          Tutorial: tutorial || '',
        };

        // Verificamos si ya existe una receta con ese nombre
        const recetaExistente = await this.recetaService.create(receta);
        
        // Si la receta existe, mostramos el mensaje de error
        if (recetaExistente === 'Ya existe una receta con ese nombre') {
          toast.error('Ya existe una receta con ese nombre');
          return;
        }

        toast.success('Receta cargada correctamente');

        // Limpiar el formulario
        this.form.reset();

        // Redirigir a "stock"
        this.router.navigate(['/stock']);
      } catch (error) {
        // Verificación del tipo de error
        if (error instanceof Error) {
          if (error.message === 'Ya existe una receta con ese nombre') {
            toast.error(error.message);
          } else {
            toast.error('Error al procesar el formulario');
          }
        } else {
          toast.error('Error desconocido');
        }
      }
    } else {
      toast.error('Formulario inválido');
    }
  }
}
