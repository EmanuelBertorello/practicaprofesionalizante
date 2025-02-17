import { Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { RecetasComponent } from './recetas/recetas.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { IndexComponent } from './index/index.component';
import { SobrenosotrosComponent } from './sobrenosotros/sobrenosotros.component';
import { LogInComponent } from './log-in/log-in.component';
 
import { RecuperarContraComponent } from './recuperar-contra/recuperar-contra.component';
 
  
import { NewComponent } from './new/new.component';
import { CargarRecetaComponent } from './cargar-receta/cargar-receta.component';
 


export  const routes: Routes = [
  
  {   path: "stock", component: StockComponent,},
  { path: "recetas", component:RecetasComponent},
  {  path: "info", component:SobrenosotrosComponent},
  {  path: "index", component:IndexComponent},
  {  path: "login", component:LogInComponent},
  { path: "recuperarcontra", component:RecuperarContraComponent},
  { path: "new", component:NewComponent},
  { path: "cargarReceta", component:CargarRecetaComponent},
  {  path: '**',component:NotfoundComponent}
];

