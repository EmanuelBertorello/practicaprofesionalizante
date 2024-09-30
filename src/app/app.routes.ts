import { Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { RecetasComponent } from './recetas/recetas.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { IndexComponent } from './index/index.component';
import { SobrenosotrosComponent } from './sobrenosotros/sobrenosotros.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegistroComponent } from './registro/registro.component';

export  const routes: Routes = [
  { path: 'stock', component: StockComponent,},
  {path: "recetas", component:RecetasComponent},
  {path: "info", component:SobrenosotrosComponent},
  {path: "index", component:IndexComponent},
  {path: "login", component:LogInComponent},
  {path: "registro", component:RegistroComponent},
  {path: '**',component:NotfoundComponent}
];

