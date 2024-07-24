import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SobrenosotrosComponent } from "./sobrenosotros/sobrenosotros.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SobrenosotrosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoEscuela';
}
