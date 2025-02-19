import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StockService, CrearStock } from '../stock.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  private _formBuilder = inject(FormBuilder);
  private stockService = inject(StockService);
  private router = inject(Router);

  mensajeExito: string = '';

  form = this._formBuilder.group({
    nombre: this._formBuilder.control('', Validators.required),
    cantidad: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
    tipo: this._formBuilder.control('', Validators.required),
    categoria: this._formBuilder.control('', Validators.required),
    minimo: this._formBuilder.control(0, [Validators.required, Validators.min(1)]),
  });

  // Función para normalizar el texto (convierte a minúsculas y elimina acentos)
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD") // Descompone caracteres con acento
      .replace(/[\u0300-\u036f]/g, ""); // Elimina los caracteres de acento
  }

  async submit() {
    if (this.form.valid) {
      let { nombre, cantidad, tipo, categoria, minimo } = this.form.value;

      // Normalizar los valores antes de usarlos
      nombre = this.normalizeText(nombre ?? '');
      tipo = this.normalizeText(tipo ?? '');
      categoria = this.normalizeText(categoria ?? '');

      try {
        const existingStock = await this.stockService.getStockByName(nombre);

        if (existingStock) {
          const updatedCantidad = (existingStock.cantidad || 0) + (cantidad ?? 0);
          const updatedStock = { ...existingStock, cantidad: updatedCantidad };

          await this.stockService.update(updatedStock);
          toast.success('Stock actualizado correctamente');
        } else {
          const stock: CrearStock = {
            nombre,
            cantidad: cantidad ?? 0,
            tipo,
            categoria,
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
        console.error("Error al procesar el formulario:", error);
        toast.error('Error al procesar el formulario');
      }
    } else {
      toast.error('Formulario inválido');
    }
  }
}
