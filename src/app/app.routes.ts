import { Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { RecetasComponent } from './recetas/recetas.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { IndexComponent } from './index/index.component';
import { SobrenosotrosComponent } from './sobrenosotros/sobrenosotros.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegistroComponent } from './registro/registro.component';
import { RecuperarContraComponent } from './recuperar-contra/recuperar-contra.component';
import { ProteComponent } from './prote/prote.component';
import { GrasasComponent } from './grasas/grasas.component';
import { CarboComponent } from './carbo/carbo.component';

export  const routes: Routes = [
  { path: "prote", component: ProteComponent,},
  { path: "grasas", component: GrasasComponent,},
  { path: "carbos", component: CarboComponent,},
  { path: "stock", component: StockComponent,},
  {path: "recetas", component:RecetasComponent},
  {path: "info", component:SobrenosotrosComponent},
  {path: "index", component:IndexComponent},
  {path: "login", component:LogInComponent},
  {path: "registro", component:RegistroComponent},
  {path: "recuperarcontra", component:RecuperarContraComponent},
  {path: '**',component:NotfoundComponent}
];

