import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  form = this._formBuilder.group({
    nombre: this._formBuilder.control('', Validators.required),
    cantidad: this._formBuilder.control(0, Validators.required),
    tipo: this._formBuilder.control('', Validators.required),
    macro: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if (this.form.valid) {
      try {
        const { nombre, cantidad, tipo, macro } = this.form.value;

        const stock: CrearStock = {
          nombre: nombre || '',
          cantidad: cantidad ?? 0,
          tipo: tipo ?? '',
          macro: macro ?? '',
        };

        await this.stockService.create(stock);
        toast.success('cargado correctamente');
      } catch (error) {
        console.error('Error al procesar el formulario', error);
      }
    } else {
      alert('Formulario inválido');
    }
  }
}
