import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sobrenosotros',
  
  host: { 'ngSkipHydration': '' },
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './sobrenosotros.component.html',
  styleUrl: './sobrenosotros.component.css'
})
export class SobrenosotrosComponent {

}
