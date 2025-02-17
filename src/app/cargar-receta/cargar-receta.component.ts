import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { RecetaService } from '../receta.service'; // Asegúrate de importar correctamente
import { CrearReceta } from '../receta.service'; // Asegúrate de usar el tipo correcto

@Component({
  selector: 'app-cargar-receta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cargar-receta.component.html',
  styleUrls: ['./cargar-receta.component.css']
})
export class CargarRecetaComponent {
  private _formBuilder = inject(FormBuilder);
  private recetaService = inject(RecetaService); // Cambié 'CrearReceta' a 'recetaService'

  form = this._formBuilder.group({
    imagen: this._formBuilder.control('', Validators.required),
    info: this._formBuilder.control('', Validators.required),
    nombre: this._formBuilder.control('', Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    ingredientes: this._formBuilder.control([], Validators.required),
    tiempoCoccion: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
    tutorial: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if (this.form.valid) {
      try {
        const { imagen, info, nombre, tipo, ingredientes, tiempoCoccion, tutorial } = this.form.value;

        // Asegúrate de que CrearReceta esté con las propiedades correctas
        const receta: CrearReceta = {
          imagen: imagen || '',
          info: info || '',
          nombre: nombre || '',
          tipo: tipo || '',
          ingredientes: ingredientes ?? [],  // Para evitar enviar un valor nulo
          tiempoCoccion: tiempoCoccion ?? 0,
          tutorial: tutorial || '',
        };

        // Usando el servicio correctamente para crear la receta
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
