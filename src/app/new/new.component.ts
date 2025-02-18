import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StockService, CrearStock } from '../stock.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule ],
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
    categoria: this._formBuilder.control('', Validators.required),  // Modificado de macro a categoria
    minimo: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
  });

  async submit() {
    if (this.form.valid) {
      const { nombre, cantidad, tipo, categoria, minimo } = this.form.value;

      try {
        // 1. Buscar el stock existente por nombre
        const existingStock = await this.stockService.getStockByName(nombre ?? '');

        if (existingStock) {
          // 2. Si existe, actualizar la cantidad
          const updatedCantidad = (existingStock.cantidad || 0) + (cantidad ?? 0); // Suma segura con nullish coalescing
          const updatedStock = { ...existingStock, cantidad: updatedCantidad }; // Crea un nuevo objeto con la cantidad actualizada

          await this.stockService.update(updatedStock); // Llama al método de actualización en tu servicio
          toast.success('Stock actualizado correctamente');
        } else {
          // 3. Si no existe, crear el nuevo stock
          const stock: CrearStock = {
            nombre: nombre || '',
            cantidad: cantidad ?? 0,
            tipo: tipo ?? '',
            categoria: categoria ?? '',
            minimo: minimo ?? 0,
          };
          await this.stockService.create(stock);
          toast.success('Stock creado correctamente');
        }

        this.mensajeExito = '¡Stock procesado exitosamente!';
        this.form.reset();

        setTimeout(() => {
          this.mensajeExito = '';
 
        }, 2000);
      } catch (error) {
        console.error("Error al procesar el formulario:", error); // Imprime el error en la consola para depuración
        toast.error('Error al procesar el formulario');
      }
    } else {
      toast.error('Formulario inválido');
    }
  }
}

