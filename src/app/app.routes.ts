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
import { ListadoRecetasComponent } from './listado-recetas/listado-recetas.component';
import { TutorialesComponent } from './tutoriales/tutoriales.component';
import { AuthGuard } from './auth.guard'; // Importa tu AuthGuard

export const routes: Routes = [
  { path: 'stock', component: StockComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'recetas', component: RecetasComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'info', component: SobrenosotrosComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'index', component: IndexComponent }, // No protegida (login)
  { path: 'login', component: LogInComponent }, // No protegida (login)
  { path: 'recuperarcontra', component: RecuperarContraComponent }, // No protegida (recuperar contraseña)
  { path: 'new', component: NewComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'cargarReceta', component: CargarRecetaComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'listadoRecetas', component: ListadoRecetasComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'tutoriales', component: TutorialesComponent, canActivate: [AuthGuard] }, // Protegida
  { path: '**', component: NotfoundComponent }, // Ruta comodín
];