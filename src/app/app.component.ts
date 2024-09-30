import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./index/index.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IndexComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoEscuela';
}
