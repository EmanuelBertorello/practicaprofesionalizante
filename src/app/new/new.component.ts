import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StockService, CrearStock } from '../stock.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  private _formBuilder = inject(FormBuilder);
  private stockService = inject(StockService);
  private router = inject(Router);

  mensajeExito: string = ''; // 🔹 Definir la variable mensajeExito

  form = this._formBuilder.group({
    nombre: this._formBuilder.control('', Validators.required),
    cantidad: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
    tipo: this._formBuilder.control('', Validators.required),
    macro: this._formBuilder.control('', Validators.required),
    minimo: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
  });

  async submit() {
    if (this.form.valid) {
      const { nombre, cantidad, tipo, macro, minimo } = this.form.value;

      // Verificar si el stock con el mismo nombre ya existe
      const exists = await this.stockService.checkIfStockExists(nombre ?? '');
      if (exists) {
        toast.error('Ya existe un stock con ese nombre');
        return;
      }

      try {
        const stock: CrearStock = {
          nombre: nombre || '',
          cantidad: cantidad ?? 0,
          tipo: tipo ?? '',
          macro: macro ?? '',
          minimo: minimo ?? 0,
        };

        // Crear el stock solo si no existe
        await this.stockService.create(stock);
        toast.success('Cargado correctamente');

        this.mensajeExito = '¡Stock cargado exitosamente!'; // 🔹 Mostrar mensaje en el template
        this.form.reset();

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.mensajeExito = ''; // 🔹 Ocultar mensaje antes de redirigir
          this.router.navigate(['/stock']);
        }, 2000);
      } catch {
        toast.error('Error al procesar el formulario');
      }
    } else {
      toast.error('Formulario inválido');
    }
  }
}
